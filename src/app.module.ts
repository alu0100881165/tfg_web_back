import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GraphQLCustomContext } from './types/app.types';

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
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: 'react',
			database: 'tfgback',
			entities: ['dist/**/*.model.js'],
			// synchronize: true,
			migrations: ['dist/migrations/*{.ts, .js}'],
			migrationsTableName: 'migrations_typeorm',
			migrationsRun: true,
		}),
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
