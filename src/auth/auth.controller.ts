import { Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	// @Post('refresh-token')
	// async refreshToken(@Req() request: Request) {
	//   const
	// }
}
