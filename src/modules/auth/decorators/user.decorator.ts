import {
	createParamDecorator,
	ExecutionContext,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { AccessTokenPayloadUser } from 'src/types/auth.types';
import { getContextRequest } from 'src/utils/context.utils';

export const userParamDecoratorCallback = (
	property: keyof AccessTokenPayloadUser | '',
	ctx: ExecutionContext
): AccessTokenPayloadUser | AccessTokenPayloadUser[keyof AccessTokenPayloadUser] => {
	const { user } = getContextRequest(ctx);

	if (!user) {
		const handler = ctx.getHandler().name;
		const logger = new Logger('UserParamDecorator');
		logger.error(`${handler}: user property is not defined in session context`);
		// InternalServer
		throw new InternalServerErrorException({ message: '' });
	}

	return property ? user?.[property] : user;
};

export const User = createParamDecorator(userParamDecoratorCallback);
