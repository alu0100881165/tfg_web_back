import { Inject } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { LoginModel } from '../models/login.model';
import { LoginService } from './login.service';
import { UserModel } from '../models/user.model';

@Resolver()
export class LoginResolver {
    constructor(
        @Inject(LoginService) private loginService: LoginService
    ) {}

    @Query(returns => LoginModel)
    async login(
        @Args('username') username: string,
        @Args('password') password: string,
    ): Promise<LoginModel> {
        return this.loginService.login(username, password);
    }

    @Query(returns => UserModel)
    async validateToken(
        @Context('user') user: UserModel,
        // @Context('req') req: Request,
        // @Args('token') token: string,
    ): Promise<UserModel> {
        return this.loginService.validateToken(user);
    }
}