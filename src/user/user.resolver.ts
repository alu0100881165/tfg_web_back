import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import { UserService } from './user.service';

@Resolver(of => UserModel)
export class UserResolver {
    constructor(
        @Inject(UserService) private userService: UserService,
    ){}

    @Mutation(() => UserModel)
    async createUser(
        @Args('username') username: string,
        @Args('password') password: string,
        @Args('firstname') firstname: string,
        @Args('lastname') lastname: string,
    ): Promise<UserModel> {
        return this.userService.create({username, password, firstname, lastname});
    }

    @Query(returns => [UserModel])
    async getAllUsers(): Promise<UserModel[]> {
        return this.userService.findAll();
    }

    @Query(returns => UserModel)
    async getUser(
        @Args('username') username: string,
        @Args('password') password: string,
    ): Promise<UserModel> {
        return this.userService.findOne(username, password);
    }

    @Mutation(() => UserModel)
    async deleteUser(
        @Args('username') username: string,
    ): Promise<UserModel> {
        return this.userService.delete(username);
    }
}