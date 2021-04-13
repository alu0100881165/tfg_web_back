import { IncomingHttpHeaders } from 'http';

export interface CustomHttpHeaders extends IncomingHttpHeaders {
	'API-COUNTER-KEY'?: string;
}

export interface AccessTokenPayloadCounter {
	id: number;
	username: string;
}

export interface CountAccessTokenPayload {
	counter: AccessTokenPayloadCounter;
}
