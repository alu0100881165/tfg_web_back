import { Inject, Logger } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLCustomContext } from 'src/types/app.types';
import { AuthUtils } from 'src/utils/auth.utils';

import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthResolver } from './auth.resolver';

@Resolver(() => UserModel)
export class UserResolver {
	private logger = new Logger(AuthResolver.name);

	constructor(@Inject(UserService) private userService: UserService) {}

	@Query(() => [UserModel])
	findAll(): Promise<UserModel[]> {
		return this.userService.findAll();
	}

	@Mutation(() => UserModel)
	delete(@Args('userId') userId: string): Promise<UserModel> {
		return this.userService.delete(userId);
	}

	@Query(() => UserModel, { nullable: true })
	async me(@Context() context: GraphQLCustomContext): Promise<UserModel | null> {
		const { authorization } = context.req.headers;
		if (!authorization) {
			return null;
		}
		const [, token] = authorization.split(' ');

		if (!token || !authorization.match(/bearer\s.+/i)) {
			return null;
		}

		try {
			const { user } = AuthUtils.verifyAccessToken(token);
			const { id, username } = user;
			this.logger.log(`${username} requested user info`);
			const currentUser = await this.userService.findById(id);
			return currentUser;
		} catch (err) {
			return null;
		}
	}
}
