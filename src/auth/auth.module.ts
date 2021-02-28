import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { get } from 'config';
import { AuthResolver } from './auth.resolver';

@Module({
	imports: [
		forwardRef(() => UserModule),
		JwtModule.register({
			secret: get('JWT_ACCESS_SECRET'),
		}),
	],
	providers: [AuthResolver, AuthService, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
