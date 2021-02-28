import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [TypeOrmModule.forFeature([UserModel]), AuthModule],
	providers: [UserResolver, UserService],
	exports: [UserService],
})
export class UserModule {}
