import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';

@Resolver(of => UserModel)
export class UserResolver {
	constructor(@Inject(UserService) private userService: UserService) {}

	@Query(() => [UserModel])
	findAll(): Promise<UserModel[]> {
		return this.userService.findAll();
	}

	// @Query(() => UserModel)
	// login(
	// 	@Args('username') username: string,
	// 	@Args('password') password: string
	// ): Promise<UserModel> {
	// 	return this.userService.login({ username, password });
	// }
	@Mutation(() => UserModel)
	delete(@Args('userId') userId: string): Promise<UserModel> {
		return this.userService.delete(userId);
	}
}
