import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  type: 'refresh';
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: Omit<User, 'passwordHash'>;
}

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {
    // Access token expires in 15 minutes (in seconds)
    this.accessTokenExpiresIn = 15 * 60;
    // Refresh token expires in 7 days (in seconds)
    this.refreshTokenExpiresIn = 7 * 24 * 60 * 60;
  }

  async register(
    registerDto: RegisterDto,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<AuthResponse> {
    const { email, password, firstName, lastName, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Create new user
    const user = await this.usersService.create({
      email,
      password,
      firstName,
      lastName,
      role: role || UserRole.SHOPPER,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user, deviceInfo, ipAddress);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      ...tokens,
      user: userWithoutPassword as Omit<User, 'passwordHash'>,
    };
  }

  async login(
    loginDto: LoginDto,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<AuthResponse> {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);

    // Generate tokens
    const tokens = await this.generateTokens(user, deviceInfo, ipAddress);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      ...tokens,
      user: userWithoutPassword as Omit<User, 'passwordHash'>,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async validateUserById(userId: string): Promise<User> {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async refreshTokens(
    userId: string,
    tokenId: string,
    oldRefreshToken: string,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<TokensResponse> {
    // Find the refresh token in database
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { id: tokenId, userId },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is valid
    if (storedToken.isRevoked) {
      // Token reuse detected - revoke all tokens for this user
      await this.revokeAllUserTokens(userId);
      throw new UnauthorizedException(
        'Refresh token has been revoked. Please login again.',
      );
    }

    if (storedToken.isExpired) {
      throw new UnauthorizedException(
        'Refresh token has expired. Please login again.',
      );
    }

    // Verify the token matches
    if (storedToken.token !== oldRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Revoke the old token (rotation)
    storedToken.isRevoked = true;
    await this.refreshTokenRepository.save(storedToken);

    // Get user and generate new tokens
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(user, deviceInfo, ipAddress);
  }

  async logout(userId: string, tokenId?: string): Promise<void> {
    if (tokenId) {
      // Revoke specific token
      await this.refreshTokenRepository.update(
        { id: tokenId, userId },
        { isRevoked: true },
      );
    } else {
      // Revoke all tokens for user
      await this.revokeAllUserTokens(userId);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.revokeAllUserTokens(userId);
  }

  private async generateTokens(
    user: User,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<TokensResponse> {
    // Create refresh token record first to get the ID
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + this.refreshTokenExpiresIn);

    const refreshTokenEntity = this.refreshTokenRepository.create({
      userId: user.id,
      token: '', // Will be updated after signing
      expiresAt,
      deviceInfo: deviceInfo || null,
      ipAddress: ipAddress || null,
    });

    const savedRefreshToken =
      await this.refreshTokenRepository.save(refreshTokenEntity);

    // Generate access token
    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: this.accessTokenExpiresIn,
    });

    // Generate refresh token
    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
      tokenId: savedRefreshToken.id,
      type: 'refresh',
    };

    const refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'your-refresh-secret-key',
    );

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: refreshSecret,
      expiresIn: this.refreshTokenExpiresIn,
    });

    // Update the refresh token record with the actual token
    savedRefreshToken.token = refreshToken;
    await this.refreshTokenRepository.save(savedRefreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenExpiresIn,
    };
  }

  private async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  // Cleanup expired tokens (can be called by a cron job)
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.refreshTokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
    return result.affected || 0;
  }

  // Get active sessions for a user
  async getActiveSessions(
    userId: string,
  ): Promise<
    Pick<RefreshToken, 'id' | 'deviceInfo' | 'ipAddress' | 'createdAt'>[]
  > {
    const tokens = await this.refreshTokenRepository.find({
      where: { userId, isRevoked: false },
      select: ['id', 'deviceInfo', 'ipAddress', 'createdAt'],
      order: { createdAt: 'DESC' },
    });

    return tokens.filter((t) => new Date() < t.expiresAt);
  }

  // Revoke a specific session
  async revokeSession(userId: string, tokenId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { id: tokenId, userId },
      { isRevoked: true },
    );
  }
}
