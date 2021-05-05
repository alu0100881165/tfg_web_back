import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

async function bootstrap() {
	dotenv.config();

	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.enableCors({
		credentials: true,
		origin: 'http://localhost:8100',
	});
	await app.listen(process.env.PORT || 3000);
}
bootstrap();
