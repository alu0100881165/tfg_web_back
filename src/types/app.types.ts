import { Request, Response } from 'express';

import { AccessTokenPayloadUser } from './auth.types';

export interface CustomRequest extends Request {
	user?: AccessTokenPayloadUser;
}

export interface GraphQLCustomContext {
	req: CustomRequest;
	res: Response;
}
