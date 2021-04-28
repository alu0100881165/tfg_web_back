import { Logger } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { get } from 'config';
import { CookieOptions, Response } from 'express';
import { decode, sign, verify } from 'jsonwebtoken';
import { UserModel } from 'src/modules/auth/models/user.model';
import {
	AccessTokenPayload,
	AccessTokenPayloadUser,
	Role,
	RolesComposition,
} from 'src/types/auth.types';

import { RefreshTokenPayload } from '../types/auth.types';

export class AuthUtils {
	// Nombre del logger, y eliminamos el timestamp
	private static logger: Logger = new Logger(AuthUtils.name, false);

	static async passwordToHash(password: string): Promise<string> {
		const hashedPassword: string = await new Promise((resolve, reject) => {
			hash(password, 12, (err, hashed) => {
				if (err) reject(err);
				resolve(hashed);
			});
		});

		return hashedPassword;
	}

	static async comparePasswords(password: string, storedHash: string): Promise<boolean> {
		const valid: boolean = await new Promise((resolve, reject) => {
			compare(password, storedHash, (err, isValid) => {
				if (err) reject(err);
				resolve(isValid);
			});
		});
		return valid;
	}

	static generateAccessToken(user: AccessTokenPayloadUser): [string, AccessTokenPayload] {
		const { id, firstname, username, roles } = user;

		const payload: AccessTokenPayload = {
			user: {
				id,
				firstname,
				username,
				roles,
			},
		};

		const token = sign(payload, get('JWT_ACCESS_SECRET'), {
			expiresIn: get('JWT_ACCESS_EXPIRATION_TIME'),
		});

		this.logger.log(`Se ha concedido un token de acceso al usuario ${username}`);

		return [token, payload];
	}

	static generateRefreshToken(
		user: UserModel,
		previousExpirationDate?: number
	): [string, RefreshTokenPayload] {
		const { id, username, tokenVersion } = user;
		const payload: RefreshTokenPayload = {
			userId: id,
			tokenVersion,
			expirationDate:
				previousExpirationDate ??
				Date.now() + Number(get('JWT_REFRESH_EXPIRATION_TIME')) * 24 * 60 * 60 * 1000,
		};

		const token = sign(payload, get('JWT_REFRESH_SECRET'), {
			expiresIn: `${get('JWT_REFRESH_EXPIRATION_TIME')}d`,
		});

		this.logger.log(`Se ha concedido un token de refresco al usuario ${username}`);

		return [token, payload];
	}

	// Decode vs verify
	static decodeToken<T>(token: string): T {
		return decode(token) as T;
	}

	static verifyAccessToken(token: string): AccessTokenPayload {
		const payload = verify(token, get('JWT_ACCESS_SECRET')) as AccessTokenPayload;
		return payload;
	}

	static verifyRefreshToken(token: string): RefreshTokenPayload {
		const payload = verify(token, get('JWT_REFRESH_SECRET')) as RefreshTokenPayload;
		return payload;
	}

	static clearRefreshToken(response: Response): void {
		response.cookie(get('JWT_REFRESH_COOKIE_KEY'), '', {
			httpOnly: true,
			maxAge: 0,
		});
	}

	static sendRefreshToken(
		response: Response,
		refreshToken: string,
		{ expirationDate }: RefreshTokenPayload
	): void {
		// Revisar bien en que path quiero enviar la cookie
		const cookieOptions: CookieOptions = {
			httpOnly: true,
			maxAge: expirationDate - Date.now(),
		};

		response.cookie(get('JWT_REFRESH_COOKIE_KEY'), refreshToken, cookieOptions);
	}

	static hasRole(required: Role, user: AccessTokenPayloadUser): boolean {
		if (user.roles.includes(required)) return true;

		const rolesToCheck: Role[] = [...user.roles];
		const checked: Partial<Record<Role, boolean>> = {};

		while (rolesToCheck.length > 0) {
			const current = rolesToCheck.shift();
			if (!checked[current]) {
				checked[current] = true;

				if (current === required) return true;

				rolesToCheck.push(...RolesComposition[current]);
			}
		}

		return false;
	}
}
