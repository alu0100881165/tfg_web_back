import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CountAccessTokenPayload } from 'src/types/counter.types';

import { AuthUtils } from '../../../utils/auth.utils';
import { getContextRequest } from '../../../utils/context.utils';
import { CounterUtils } from '../../../utils/counter.utils';

@Injectable()
export class CounterGuard implements CanActivate {
	private logger: Logger = new Logger(CounterGuard.name);

	canActivate(ctx: ExecutionContext): boolean {
		const handler = ctx.getHandler().name;
		const request = getContextRequest(ctx);

		const {
			headers: { authorization },
		} = request;

		if (!authorization) {
			this.logger.error(`${handler}: No hay Bearer token.`);
			throw new UnauthorizedException({
				message: 'No hay Bearer token.',
			});
		}

		if (!authorization.match(/^bearer\s.+$/i)) {
			this.logger.error(`${handler}: Error en la estructuración del Bearer token.`);
			throw new UnauthorizedException({
				message: 'Error en la estructuración del Bearer token.',
			});
		}

		const [, token] = authorization.split(' ');

		try {
			const payload = CounterUtils.verifyAccessToken(token);
			request.counter = payload.counter;
		} catch (err) {
			let loggerMessage = `${handler}: Bearer token invalido`;

			if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
				try {
					const {
						counter: { username },
					} = AuthUtils.decodeToken<CountAccessTokenPayload>(token);
					loggerMessage = `${handler}: ${username} ${err.message}`;
				} catch (e) {
					throw new UnauthorizedException({
						message: 'Error de validación del access token',
					});
				}
			}

			this.logger.error(loggerMessage);
			throw new UnauthorizedException({
				message: 'Error de validación del access token',
			});
		}

		return true;
	}
}
