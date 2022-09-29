import { ExtractJwt, Strategy } from 'passport-jwt';

import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { config } from 'src/config/configurations';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_CONSTANTS.secret,
    });
  }

  validate(payload: any) {
    return {
      id: payload.sub,
      role: payload.role,
    };
  }
}
