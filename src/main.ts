import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

async function bootstrap() {
	// dotenv.config();

	console.log(
		process.env.DB_HOST,
		Number(process.env.DB_PORT),
		process.env.DATABASE_USER,
		process.env.DATABASE_PASSWORD,
		process.env.DB_DATABASE
	);

	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.enableCors({
		credentials: true,
		// origin: 'http://localhost:8100',
		origin: '*',
		allowedHeaders: '*',
	});
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Origin', 'Content-Type, Accept');
	});
	await app.listen(process.env.PORT || 3000);
}
bootstrap();
