import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModel } from "src/models/user.model";
import { LoginModel } from '../models/login.model';
import { LoginService } from './login.service';
import { LoginResolver } from './login.resolver';
import { UserModule } from "src/user/user.module";

@Module({
    imports: [forwardRef(() => UserModule)],
    providers: [LoginService, LoginResolver],
    exports: [LoginService]
})
export class LoginModule {}