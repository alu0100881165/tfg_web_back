import { Logger } from '@nestjs/common';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphQLCustomContext } from 'src/types/app.types';
import { AuthUtils } from 'src/utils/auth.utils';

import { CompanyModel } from '../../company/models/company.model';
import { CompanyService } from '../../company/services/company.service';
import { CounterService } from '../../counter/services/counter.service';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthResolver } from './auth.resolver';

// TODO proteger todas las rutas

@Resolver(() => UserModel)
export class UserResolver {
	private logger = new Logger(AuthResolver.name);

	constructor(
		private userService: UserService,
		private companyService: CompanyService,
		private counterService: CounterService
	) {}

	@Query(() => [UserModel])
	findAll(): Promise<UserModel[]> {
		return this.userService.findAll();
	}

	@Query(() => [UserModel])
	findCompanyUsers(@Args('companyId') companyId: number): Promise<UserModel[]> {
		return this.userService.findCompanyUsers(companyId);
	}

	@Mutation(() => UserModel)
	update(
		@Args('username') username: string,
		@Args('newUsername', { nullable: true }) newUsername?: string,
		@Args('newEmail', { nullable: true }) newEmail?: string,
		@Args('newFirstname', { nullable: true }) newFirstname?: string,
		@Args('newLastname', { nullable: true }) newLastname?: string
	): Promise<UserModel> {
		return this.userService.update(username, newUsername, newEmail, newFirstname, newLastname);
	}

	@Mutation(() => UserModel)
	delete(@Args('userId') userId: number): Promise<UserModel> {
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

	@ResolveField(() => CompanyModel)
	async company(@Parent() user: UserModel): Promise<CompanyModel> {
		const { company } = await this.userService.findOne(user.id, { relations: ['company'] });
		return company;
	}
}
