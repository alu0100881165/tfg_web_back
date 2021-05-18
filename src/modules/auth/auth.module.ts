import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyModule } from '../company/company.module';
import { CounterModule } from '../counter/counter.module';
import { AuthController } from './controllers/auth.controller';
import { UserModel } from './models/user.model';
import { AuthResolver } from './resolvers/auth.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Module({
	imports: [TypeOrmModule.forFeature([UserModel]), forwardRef(() => CompanyModule), CounterModule],
	controllers: [AuthController],
	providers: [AuthResolver, AuthService, UserResolver, UserService],
	exports: [AuthService, UserService],
})
export class AuthModule {}
