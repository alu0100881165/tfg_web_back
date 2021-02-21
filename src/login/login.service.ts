import { Inject, Injectable } from "@nestjs/common";
import * as config from "config";
import { decode, sign } from "jsonwebtoken";
import { UserModel } from "src/models/user.model";
import { checkPassword } from "src/utils/hash";
import { LoginModel } from '../models/login.model';
import { UserService } from '../user/user.service';
// import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService {
    constructor(
        @Inject(UserService) private userService: UserService
    ) {}
    
    // async login(username: string, password: string): Promise<LoginModel> {
    //     console.log("Petición de login");

    //     if(username && password) {  // controlar que la password es correcta, encriptarla y desencriptarla
    //         const user: UserModel = await this.userService.findByUsername(username);

    //         if(checkPassword(user, password)) {

    //             const refreshToken = sign({ pwd: user.password, count: user.counter }, config.get('jwtSecret'), { expiresIn: '2d' });

    //             const accessToken = sign({ pwd: user.password, count: user.counter }, config.get('jwtSecret'), { expiresIn: '1800' });

    //             const logger: LoginModel = {
    //                 username: user.username,
    //                 password: user.password
    //             }
    
    //             return logger;
    //         }
    //     }

    //     const badLogger: LoginModel = {
    //         username: "",
    //         password: "",
    //     }

    //     return badLogger;
    // }

    async login(username: string, password: string): Promise<LoginModel> {
        if(username && password) {  // controlar que la password es correcta, encriptarla y desencriptarla
            const user: UserModel = await this.userService.findByUsername(username);

            if(checkPassword(user, password)) {

                const refreshToken = sign({ id: user.id, count: user.counter }, config.get('jwtSecret'), { expiresIn: '2d' });

                const accessToken = sign({ id: user.id }, config.get('jwtSecret'), { expiresIn: '1800' });

                // console.log(accessToken);
    
                return {accessToken, refreshToken};
            }
        }

        return {accessToken: "Bad login", refreshToken: "Bad login"};
    }

    async validateToken(user: UserModel): Promise<UserModel> {
        // console.log(decode(token, config.get('jwtSecret')));

        // console.log("Usuario: ");
        // console.log(user);

        return await this.userService.findByUsername("test");
    }

    // async validateUser(username: string, password: string): Promise<UserModel> {
    //     const user = await this.userService.findByUsername(username);

    //     if(user && bcrypt.compare(user.password, password)) {
    //         return user
    //     }

    //     const badUser: UserModel = {
    //         id: -1,
    //         username: "",
    //         password: "",
    //         firstname: "",
    //         lastname: "",
    //         counter: -1
    //     }

    //     return badUser 
    // }
}