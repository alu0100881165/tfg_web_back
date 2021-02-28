import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginDTO } from 'src/dto/Login.dts';
import { UserModel } from 'src/models/user.model';
import { AuthService } from './auth.service';
import { LoginResponse } from './responses/login.response';
import { RegisterResponse } from './responses/register.response';

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Mutation(() => LoginResponse)
	login(
		@Args('username') username: string,
		@Args('password') password: string
	): Promise<LoginResponse> {
		return this.authService.login({ username, password });
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
