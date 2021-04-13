import { Request, Response } from 'express';

import { AccessTokenPayloadUser } from './auth.types';
import { AccessTokenPayloadCounter } from './counter.types';

export interface CustomRequest extends Request {
	user?: AccessTokenPayloadUser;
	counter?: AccessTokenPayloadCounter;
}

export interface GraphQLCustomContext {
	req: CustomRequest;
	res: Response;
}
