import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { get } from 'config';
import { AuthResolver } from './auth.resolver';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
	imports: [
		forwardRef(() => UserModule),
		// JwtModule.register({
		// 	secret: get('JWT_ACCESS_SECRET'),
		// 	signOptions: {
		// 		expiresIn: `${get('JWT_ACCESS_EXPIRATION_TIME')}`,
		// 	},
		// }),
	],
	providers: [AuthResolver, AuthService, JwtStrategy, JwtAuthGuard],
	exports: [AuthService],
})
export class AuthModule {}
