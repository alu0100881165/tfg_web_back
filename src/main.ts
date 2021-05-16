import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.enableCors({
		credentials: true,
		// origin: 'http://localhost:8100',
		// origin: '*',
		origin: ['http://localhost:8100', 'http://localhost:8101'],
	});
	// await app.listen(process.env.PORT || 3000, '0.0.0.0');
	await app.listen(process.env.PORT || 3000);
}
bootstrap();
