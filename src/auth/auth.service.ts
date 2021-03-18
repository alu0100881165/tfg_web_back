import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { UserModel } from 'src/models/user.model';
import { AccessDTO } from '../dto/Access.dto';
import { UserService } from '../user/user.service';
import { RegisterResponse } from './responses/register.response';
import { LoginResponse } from './responses/login.response';
import { CreateUserDTO } from 'src/dto/CreateUser.dto';
import { LoginDTO } from 'src/dto/Login.dts';
import { get } from 'config';
import { CookieOptions, Response } from 'express';
import { sign } from 'jsonwebtoken';

interface JWTCookie {
	cookie: string;
	token: string;
}

export interface RefreshTokenPayload {
	userId: number;
	tokenVersion: number;
}

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

	async validateUser(username: string): Promise<UserModel> {
		return this.userService.findUser(username);
	}

	generateAccessToken(username: string): string {
		const payload: AccessDTO = { name: username };

		return sign(payload, get('JWT_ACCESS_SECRET'), {
			expiresIn: get('JWT_ACCESS_EXPIRATION_TIME'),
		});
	}

	generateRefreshToken(
		user: UserModel,
		previousExpirationDate?: number
	): [string, RefreshTokenPayload] {
		const { id, username, counter } = user;

		const payload: RefreshTokenPayload = {
			userId: id,
			tokenVersion: counter,
		};

		const token = sign(payload, get('JWT_REFRESH_SECRET'), {
			expiresIn: get('JWT_REFRESH_EXPIRATION_TIME'),
		});

		return [token, payload];
	}

	sendRefreshToken(response: Response, refreshToken: string): void {
		const cookieOptions: CookieOptions = {
			httpOnly: true,
		};

		console.log('Refresh token: ', refreshToken);

		response.cookie(get('JWT_REFRESH_COOKIE_KEY'), refreshToken, cookieOptions);
	}

	getJwtRefreshToken(username: string): JWTCookie {
		const payload: AccessDTO = { name: username };
		const token = sign(payload, get('JWT_REFRESH_SECRET'), {
			expiresIn: get('JWT_REFRESH_EXPIRATION_TIME'),
		});

		const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=get('JWT_REFRESH_EXPIRATION_TIME')`;

		return {
			cookie,
			token,
		};
	}

	async register(newUser: CreateUserDTO): Promise<UserModel> {
		const userValid = await this.userService.usernameExists(newUser.username);
		if (!userValid) {
			throw new Error('El usuario ya existe');
		}

		const emailValid = await this.userService.emailExists(newUser.email);

		if (!emailValid) {
			throw new Error('El email ya está asignado a otra cuenta');
		}

		newUser.password = await this.userService.hashPassword(newUser.password);

		return await this.userService.create(newUser);
	}

	async login(credentials: LoginDTO): Promise<LoginResponse> {
		const user = await this.userService.findUser(credentials.username);

		if (!user) {
			throw new Error('El usuario no existe');
		}

		const valid = await this.userService.validatePassword(credentials.password, user.password);

		if (!valid) {
			throw new Error('La contraseña es incorrecta');
		}

		return { accessToken: this.generateAccessToken(user.username), user };
	}
}
