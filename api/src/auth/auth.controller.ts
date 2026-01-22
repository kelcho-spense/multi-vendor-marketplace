import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
  Ip,
  Headers,
} from '@nestjs/common';
import { AuthService, AuthResponse, TokensResponse } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

interface RequestWithUser {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

interface RequestWithRefreshToken {
  user: {
    userId: string;
    tokenId: string;
    refreshToken: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Headers('user-agent') userAgent?: string,
    @Ip() ip?: string,
  ): Promise<AuthResponse> {
    return this.authService.register(registerDto, userAgent, ip);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Headers('user-agent') userAgent?: string,
    @Ip() ip?: string,
  ): Promise<AuthResponse> {
    return this.authService.login(loginDto, userAgent, ip);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: RequestWithUser) {
    return this.authService.validateUserById(req.user.userId);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Request() req: RequestWithRefreshToken,
    @Body() _refreshTokenDto: RefreshTokenDto,
    @Headers('user-agent') userAgent?: string,
    @Ip() ip?: string,
  ): Promise<TokensResponse> {
    return this.authService.refreshTokens(
      req.user.userId,
      req.user.tokenId,
      req.user.refreshToken,
      userAgent,
      ip,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req: RequestWithUser): Promise<void> {
    await this.authService.logout(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(@Request() req: RequestWithUser): Promise<void> {
    await this.authService.logoutAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  async getActiveSessions(@Request() req: RequestWithUser) {
    return this.authService.getActiveSessions(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeSession(
    @Request() req: RequestWithUser,
    @Param('sessionId') sessionId: string,
  ): Promise<void> {
    await this.authService.revokeSession(req.user.userId, sessionId);
  }
}
