import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  type: 'refresh';
}

/** Typed Express Request with RefreshTokenDto body */
type RefreshTokenRequest = Request<
  Record<string, never>, // params
  unknown, // res body
  RefreshTokenDto // req body
>;

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_REFRESH_SECRET',
        'your-refresh-secret-key',
      ),
      passReqToCallback: true,
    });
  }

  validate(req: RefreshTokenRequest, payload: RefreshTokenPayload) {
    if (!payload.sub || payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { refreshToken } = req.body;

    return {
      userId: payload.sub,
      tokenId: payload.tokenId,
      refreshToken,
    };
  }
}
