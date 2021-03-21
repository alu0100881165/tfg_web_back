import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { UserModel } from 'src/auth/models/user.model';
import { AccessDTO } from '../../dto/Access.dto';
import { UserService } from './user.service';
import { RegisterResponse } from '../responses/register.response';
import { LoginResponse } from '../responses/login.response';
import { CreateUserDTO } from 'src/dto/CreateUser.dto';
import { LoginDTO } from 'src/dto/Login.dts';
import { get } from 'config';
import { CookieOptions, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { RefreshTokenPayload } from 'src/types/auth.types';
import { AuthUtils } from 'src/utils/auth.utils';

interface JWTCookie {
	cookie: string;
	token: string;
}

@Injectable()
export class AuthService {
	private logger = new Logger(AuthService.name, false);

	constructor(private userService: UserService) {}

	async validateUser(username: string): Promise<UserModel> {
		return this.userService.findUser(username);
	}

	async register(newUser: CreateUserDTO): Promise<UserModel> {
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
		console.log('User', user);

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
