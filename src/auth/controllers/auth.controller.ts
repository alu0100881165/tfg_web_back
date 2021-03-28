import { Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';
import { get } from 'config';
import { RefreshTokenPayload } from 'src/types/auth.types';
import { AuthUtils } from 'src/utils/auth.utils';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserService } from '../services/user.service';

interface RefreshTokenResponse {
	ok: boolean;
	message?: string;
	accessToken?: string;
}

@Controller('auth')
export class AuthController {
	constructor(private userService: UserService) {}

	@Post('refresh-token')
	async refreshToken(
		@Req() request: Request,
		@Res() response: Response
	): Promise<Response<RefreshTokenResponse>> {
		const refreshToken = request.cookies[String(get('JWT_REFRESH_COOKIE_KEY'))];
		if (!refreshToken) {
			return response.status(400).send({
				ok: false,
				message: 'No se ha encontrado un token de refresco',
			});
		}

		let payload: RefreshTokenPayload;
		try {
			payload = AuthUtils.verifyRefreshToken(refreshToken);
		} catch (err) {
			if (err instanceof TokenExpiredError) {
				return response
					.status(400)
					.send({ ok: false, message: 'El token de refresco ha expirado' });
			}

			return response.status(400).send({ ok: false, message: 'Token de refresco inválido' });
		}

		const user = await this.userService.findById(payload.userId);
		if (!user) {
			return response.status(400).send({
				ok: false,
				message: 'No se ha podido encontrar el usuario al que hace referencia el token de refresco',
			});
		}

		if (user.tokenVersion !== payload.tokenVersion) {
			return response.status(400).send({ ok: false, message: 'Token revocado' });
		}

		const [accessToken] = AuthUtils.generateAccessToken(user);
		const [newRefreshToken, newPayload] = AuthUtils.generateRefreshToken(
			user,
			payload.expirationDate
		);
		AuthUtils.sendRefreshToken(response, newRefreshToken, newPayload);

		return response.send({ ok: true, accessToken });
	}
}
