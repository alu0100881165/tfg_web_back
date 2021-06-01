import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { CounterModule } from './modules/counter/counter.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
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
			url: process.env.DATABASE_URL,
			entities: ['dist/**/*.model.js'],
			synchronize: true,
			migrations: ['dist/migrations/*{.ts, .js}'],
			migrationsTableName: 'migrations_typeorm',
			migrationsRun: true,
		}),
		AuthModule,
		CounterModule,
		CompanyModule,
		StatisticsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
