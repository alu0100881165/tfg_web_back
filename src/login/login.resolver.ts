import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { LoginModel } from '../models/login.model';
import { LoginService } from './login.service';

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
}