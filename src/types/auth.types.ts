export interface AccessTokenPayload {
	user: AccessTokenPayloadUser;
}

export interface AccessTokenPayloadUser {
	id: number;
	firstname: string;
	username: string;
}

export interface RefreshTokenPayload {
	userId: number;
	tokenVersion: number;
	expirationDate: number;
}
