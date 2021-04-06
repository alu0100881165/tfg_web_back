import { registerEnumType } from '@nestjs/graphql';

export interface AccessTokenPayload {
	user: AccessTokenPayloadUser;
}

export interface AccessTokenPayloadUser {
	id: number;
	firstname: string;
	username: string;
	roles: Role[];
}

export interface RefreshTokenPayload {
	userId: number;
	tokenVersion: number;
	expirationDate: number;
}

export enum Role {
	BaseUser = 'BaseUser',
	Admin = 'Admin',
}

registerEnumType(Role, {
	name: 'Role',
});

export const RolesComposition: Record<Role, Role[]> = {
	[Role.BaseUser]: [],
	[Role.Admin]: [Role.BaseUser],
};
