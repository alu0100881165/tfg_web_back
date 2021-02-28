import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UserModel } from 'src/models/user.model';
import { AccessDTO } from '../dto/Access.dto';
import { UserService } from '../user/user.service';
import { RegisterResponse } from './responses/register.response';
import { LoginResponse } from './responses/login.response';
import { CreateUserDTO } from 'src/dto/CreateUser.dto';
import { LoginDTO } from 'src/dto/Login.dts';

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService, private userService: UserService) {}

	async validateUser(username: string): Promise<UserModel> {
		return this.userService.findUser(username);
	}

	async generateAccessToken(username: string): Promise<string> {
		const payload: AccessDTO = { name: username };

		return this.jwtService.sign(payload);
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

		return { accessToken: await this.generateAccessToken(user.username), user };
	}
}
