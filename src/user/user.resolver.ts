import { Inject, Req, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserModel } from '../models/user.model';
import { UserService } from './user.service';

@Resolver(of => UserModel)
export class UserResolver {
	constructor(@Inject(UserService) private userService: UserService) {}

	@UseGuards(JwtAuthGuard)
	@Query(() => [UserModel])
	findAll(@Req() request): Promise<UserModel[]> {
		console.log(request.user);
		return this.userService.findAll();
	}

	// @Query(() => UserModel)
	// login(
	// 	@Args('username') username: string,
	// 	@Args('password') password: string
	// ): Promise<UserModel> {
	// 	return this.userService.login({ username, password });
	// }
}
