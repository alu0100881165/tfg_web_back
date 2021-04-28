import { Logger } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { CompanyService } from 'src/modules/company/services/company.service';
import { AccessTokenPayloadUser, Role } from 'src/types/auth.types';
import { AuthUtils } from 'src/utils/auth.utils';

import { Auth } from '../decorators/auth.decorator';
import { User } from '../decorators/user.decorator';
import { LoginResponse } from '../responses/login.response';
import { LogoutResponse } from '../responses/logout.repsonse';
import { AuthService } from '../services/auth.service';

@Resolver()
export class AuthResolver {
	private logger = new Logger(AuthResolver.name);

	constructor(private authService: AuthService, private companyService: CompanyService) {}

	// TODO solo se puede referenciar a un usuario por cada compañía, da error si no
	@Mutation(() => LoginResponse)
	async register(
		@Args('username') username: string,
		@Args('email') email: string,
		@Args('password') password: string,
		@Args('firstname') firstname: string,
		@Args('lastname') lastname: string,
		@Args('companyId') companyId: number,
		@Context('res') response: Response
	): Promise<LoginResponse> {
		const company = await this.companyService.findOne(companyId);
		const user = await this.authService.register({
			username,
			email,
			password,
			firstname,
			lastname,
			company,
		});
		this.logger.log(`El usuario ${user.username} se ha registrado`);

		const [refreshToken, payload] = AuthUtils.generateRefreshToken(user);
		AuthUtils.sendRefreshToken(response, refreshToken, payload);
		const [accessToken] = AuthUtils.generateAccessToken(user);

		return { accessToken, user };
	}

	@Mutation(() => LoginResponse)
	async registerAdmin(
		@Args('username') username: string,
		@Args('email') email: string,
		@Args('password') password: string,
		@Args('firstname') firstname: string,
		@Args('lastname') lastname: string,
		@Args('companyId') companyId: number,
		@Context('res') response: Response
	): Promise<LoginResponse> {
		const company = await this.companyService.findOne(companyId);
		const user = await this.authService.registerAdmin({
			username,
			email,
			password,
			firstname,
			lastname,
			company,
		});
		this.logger.log(`El usuario ${user.username} se ha registrado`);

		const [refreshToken, payload] = AuthUtils.generateRefreshToken(user);
		AuthUtils.sendRefreshToken(response, refreshToken, payload);
		const [accessToken] = AuthUtils.generateAccessToken(user);

		return { accessToken, user };
	}

	@Mutation(() => LoginResponse)
	async login(
		@Args('username') username: string,
		@Args('password') password: string,
		@Context('res') response: Response
	): Promise<LoginResponse> {
		const user = await this.authService.login(username, password);
		this.logger.log(`El usuario ${username} ha iniciado sesion`);

		const [accessToken] = AuthUtils.generateAccessToken(user);
		const [refreshToken, payload] = AuthUtils.generateRefreshToken(user);
		AuthUtils.sendRefreshToken(response, refreshToken, payload);

		console.log(user.company);

		return { accessToken, user };
	}

	@Auth()
	@Mutation(() => LogoutResponse)
	async logout(
		@User() { username }: AccessTokenPayloadUser,
		@Context('res') response: Response
	): Promise<LogoutResponse> {
		this.logger.log(`User ${username} logged out`);
		AuthUtils.clearRefreshToken(response);
		return { username };
	}
}
