import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { CounterModule } from './modules/counter/counter.module';
import { GraphQLCustomContext } from './types/app.types';

dotenv.config();

@Module({
	imports: [
		GraphQLModule.forRoot({
			debug: true,
			playground: true,
			autoSchemaFile: 'schema.gql',
			path: '/graphql',
			cors: {
				credentials: true,
				origin: 'http://localhost:8100',
			},
			context: ({ req, res, connection }): GraphQLCustomContext =>
				connection ? { req: connection.context, res } : { req, res },
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			// username: 'postgres',
			// password: 'react',
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT, 10),
			database: process.env.DB_DATABASE,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			entities: ['dist/**/*.model.js'],
			synchronize: true,
			migrations: ['dist/migrations/*{.ts, .js}'],
			migrationsTableName: 'migrations_typeorm',
			migrationsRun: true,
		}),
		AuthModule,
		CounterModule,
		CompanyModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
