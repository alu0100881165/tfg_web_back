import { Role } from 'src/types/auth.types';

export interface CreateUserDTO {
	username: string;
	email: string;
	password: string;
	firstname: string;
	lastname: string;
	roles?: [Role];
}
