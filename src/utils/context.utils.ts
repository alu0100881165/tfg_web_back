import { ExecutionContext, InternalServerErrorException, Logger } from '@nestjs/common';
import { CustomRequest, GraphQLCustomContext } from 'src/types/app.types';

export const getContextRequest = (context: ExecutionContext): CustomRequest => {
	const logger: Logger = new Logger('getContextRequest');
	const contextType = context.getType<'http' | 'graphql'>();

	switch (contextType) {
		case 'http':
			return context.switchToHttp().getRequest();
		case 'graphql':
			return (context.getArgs()[2] as GraphQLCustomContext).req;
		default:
			logger.error(`Contexto desconocido de tipo: ${contextType}`);
			throw new InternalServerErrorException({
				message: '',
			});
	}
};
