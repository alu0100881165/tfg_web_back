import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModel } from './models/user.model';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthService } from './services/auth.service';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';

@Module({
	imports: [TypeOrmModule.forFeature([UserModel])],
	providers: [AuthResolver, AuthService, UserResolver, UserService],
	exports: [AuthService, UserService],
})
export class AuthModule {}
