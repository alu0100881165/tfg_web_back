import { Res, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LoginDTO } from 'src/dto/Login.dts';
import { UserModel } from 'src/models/user.model';
import { AuthService } from './auth.service';
import { LoginResponse } from './responses/login.response';
import { RegisterResponse } from './responses/register.response';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Mutation(() => LoginResponse)
	async login(
		@Args('username') username: string,
		@Args('password') password: string,
		@Context('res') response: Response
	): Promise<LoginResponse> {
		console.log('Objeto de respuestas: ', response);
		const loginResponse = await this.authService.login({ username, password });

		const [refreshToken, payload] = this.authService.generateRefreshToken(loginResponse.user);

		this.authService.sendRefreshToken(response, refreshToken);

		return loginResponse;
	}

	@Mutation(() => UserModel)
	register(
		@Args('username') username: string,
		@Args('email') email: string,
		@Args('password') password: string,
		@Args('firstname') firstname: string,
		@Args('lastname') lastname: string
	): Promise<UserModel> {
		return this.authService.register({ username, email, password, firstname, lastname });
	}
}
