import { forwardRef, Module } from "@nestjs/common";
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModel } from "src/models/user.model";
import { LoginModule } from "src/login/login.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserModel])],
    providers: [UserResolver, UserService],
    exports: [UserService]
})
export class UserModule {}