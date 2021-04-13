import {
	createParamDecorator,
	ExecutionContext,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { AccessTokenPayloadCounter } from 'src/types/counter.types';

import { getContextRequest } from '../../../utils/context.utils';

export const counterParamDecoratorCallback = (
	property: keyof AccessTokenPayloadCounter | '',
	ctx: ExecutionContext
): AccessTokenPayloadCounter | AccessTokenPayloadCounter[keyof AccessTokenPayloadCounter] => {
	const { counter } = getContextRequest(ctx);

	if (!counter) {
		const handler = ctx.getHandler().name;
		const logger = new Logger('UserParamDecorator');
		logger.error(`${handler}: user property is not defined in session context`);
		// InternalServer
		throw new InternalServerErrorException({ message: '' });
	}

	return property ? counter?.[property] : counter;
};

export const Counter = createParamDecorator(counterParamDecoratorCallback);
