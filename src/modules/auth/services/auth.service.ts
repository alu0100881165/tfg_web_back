import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/CreateUser.dto';
import { Role } from 'src/types/auth.types';
import { AuthUtils } from 'src/utils/auth.utils';

import { UserModel } from '../models/user.model';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
	private logger = new Logger(AuthService.name, false);

	constructor(private userService: UserService) {}

	async validateUser(username: string): Promise<UserModel> {
		return this.userService.findUser(username);
	}

	async register(userRegist: CreateUserDTO): Promise<UserModel> {
		const newUser: CreateUserDTO = userRegist;
		const userValid = await this.userService.usernameExists(newUser.username);
		if (!userValid) {
			this.logger.error(`Error al crear el usuario ${newUser.username}: ya esta en uso`);
			throw new BadRequestException({ message: 'Usuario en uso' });
		}

		const emailValid = await this.userService.emailExists(newUser.email);

		if (!emailValid) {
			throw new Error('El email ya está asignado a otra cuenta');
		}

		newUser.password = await AuthUtils.passwordToHash(newUser.password);

		const user = await this.userService.create(newUser);

		console.log(user.company);

		return user;
	}

	async registerAdmin(userRegist: CreateUserDTO): Promise<UserModel> {
		const newUser: CreateUserDTO = userRegist;
		newUser.roles = [Role.BaseUser, Role.Admin];
		const userValid = await this.userService.usernameExists(newUser.username);
		if (!userValid) {
			this.logger.error(`Error al crear el usuario ${newUser.username}: ya esta en uso`);
			throw new BadRequestException({ message: 'Usuario en uso' });
		}

		const emailValid = await this.userService.emailExists(newUser.email);

		if (!emailValid) {
			throw new Error('El email ya está asignado a otra cuenta');
		}

		newUser.password = await AuthUtils.passwordToHash(newUser.password);

		const user = await this.userService.create(newUser);

		return user;
	}

	async login(username: string, password: string): Promise<UserModel> {
		const user = await this.userService.findUser(username);
		if (!user) {
			this.logger.error(`Error al hacer login con el usuario (${username}). No existe`);
			throw new UnauthorizedException({
				message: 'Credenciales erroneas',
			});
		}
		const isSamePassword = await AuthUtils.comparePasswords(password, user.password);
		if (!isSamePassword) {
			this.logger.error(
				`Error al hacer login con el usuario (${username}). Las contraseñas no coinciden`
			);
			throw new UnauthorizedException({
				message: 'Credenciales erroneas',
			});
		}

		return user;
	}
}
