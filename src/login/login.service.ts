import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserModel } from "src/models/user.model";
import { Repository } from "typeorm";
import { LoginModel } from '../models/login.model';
import { UserService } from '../user/user.service';

@Injectable()
export class LoginService {
    constructor(
        @Inject(UserService) private userService: UserService
    ) {}
    
    async login(username: string, password: string): Promise<LoginModel> {
        console.log("Petición de login");

        // if(username && password) {  // controlar que la password es correcta, encriptarla y desencriptarla
        //     return this.userService.findOne(username, password);
        // }
        // const badLogin: LoginModel = {
        //     username: "",
        //     password: "",
        // }

        // return badLogin;

        return this.userService.findOne(username, password);
    }
}