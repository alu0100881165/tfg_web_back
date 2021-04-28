import { Logger } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { get } from 'config';
import { decode, sign, verify } from 'jsonwebtoken';
import { AccessTokenPayloadCounter, CountAccessTokenPayload } from 'src/types/counter.types';

export class CounterUtils {
	// Nombre del logger, y eliminamos el timestamp
	private static logger: Logger = new Logger(CounterUtils.name, false);

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

	static generateAccessToken(
		counter: AccessTokenPayloadCounter
	): [string, CountAccessTokenPayload] {
		const { id, username } = counter;

		const payload: CountAccessTokenPayload = {
			counter: {
				id,
				username,
			},
		};

		const token = sign(payload, get('JWT_ACCESS_SECRET'), {
			expiresIn: get('JWT_ACCESS_EXPIRATION_TIME'),
		});

		this.logger.log(`Se ha concedido un token de acceso al contador ${username}`);

		return [token, payload];
	}

	static decodeToken<T>(token: string): T {
		return decode(token) as T;
	}

	static verifyAccessToken(token: string): CountAccessTokenPayload {
		const payload = verify(token, get('JWT_ACCESS_SECRET')) as CountAccessTokenPayload;
		return payload;
	}
}
