import { Inject, Injectable } from "@nestjs/common";
import config from "config";
import { sign } from "jsonwebtoken";
import { UserModel } from "src/models/user.model";
import { checkPassword } from "src/utils/hash";
import { LoginModel } from '../models/login.model';
import { UserService } from '../user/user.service';

@Injectable()
export class LoginService {
    constructor(
        @Inject(UserService) private userService: UserService
    ) {}
    
    async login(username: string, password: string): Promise<LoginModel> {
        console.log("Petición de login");

        if(username && password) {  // controlar que la password es correcta, encriptarla y desencriptarla
            const user: UserModel = await this.userService.findByUsername(username);

            if(checkPassword(user, password)) {

                const refreshToken = sign({ pwd: user.password, count: user.counter }, config.get('jwtSecret'), { expiresIn: '2d' });

                const accessToken = sign({ pwd: user.password, count: user.counter }, config.get('jwtSecret'), { expiresIn: '1800' });

                const logger: LoginModel = {
                    username: user.username,
                    password: user.password
                }
    
                return logger;
            }
        }
        const badLogger: LoginModel = {
            username: "",
            password: "",
        }

        return badLogger;
    }
}