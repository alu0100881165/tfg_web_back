import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/types/auth.types';
import { AuthUtils } from 'src/utils/auth.utils';
import { getContextRequest } from 'src/utils/context.utils';

import { METADATA_ROLE } from '../decorators/auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	private logger: Logger = new Logger(RolesGuard.name);

	constructor(private readonly reflector: Reflector) {}

	canActivate(ctx: ExecutionContext): boolean {
		const handler = ctx.getHandler().name;
		const metadataRoles = this.reflector.get<Role[]>(METADATA_ROLE, ctx.getHandler());

		if (!metadataRoles) {
			this.logger.error(`${handler}: roles metadata not found`);
			throw new InternalServerErrorException({ message: '' });
		}

		const requiredRoles =
			metadataRoles && metadataRoles.length > 0 ? metadataRoles : [Role.BaseUser];

		const { user } = getContextRequest(ctx);

		if (!user) {
			this.logger.error(`${handler}: session context does not contain user property`);
			throw new InternalServerErrorException({ message: '' });
		}
		const { username } = user;

		const enoughPrivilegies = requiredRoles.every(requiredRole =>
			AuthUtils.hasRole(requiredRole, user)
		);

		if (!enoughPrivilegies) {
			this.logger.error(`${handler}: User ${username} does not have enough privilegies`);
			throw new ForbiddenException({
				message: 'Insufficient permissions',
			});
		}

		return true;
	}
}
