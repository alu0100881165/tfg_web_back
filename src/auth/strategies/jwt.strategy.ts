import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { ExtractJwt } from 'passport-jwt';
import { AccessDTO } from '../../dto/Access.dto';
import { get } from 'config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly authService: AuthService) {
		super({
			// Extrae el token del header y lo valida
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: get('JWT_ACCESS_SECRET'),
		});
	}

	async validate(payload: AccessDTO) {
		const user = await this.authService.validateUser(payload.name);

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
