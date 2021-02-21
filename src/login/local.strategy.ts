import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserModel } from "src/models/user.model";
import { LoginService } from './login.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private loginService: LoginService) {
        super();
    }

    async validate(username: string, password: string): Promise<UserModel> {
        const user = await this.loginService.validateUser(username, password);

        if(!user || user.id === -1) {
            throw new UnauthorizedException();
        }

        return user;
    }
}