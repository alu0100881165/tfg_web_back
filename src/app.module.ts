import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { LoginModule } from './login/login.module';
import { validateToken } from './utils/hash';
import { LoginService } from './login/login.service';

@Module({
  imports: [GraphQLModule.forRoot({
    debug: true,
    playground: true,
    autoSchemaFile: 'schema.gql',
    path: '/graphql',
    context: async ({ req }) => {
      let user = null;

      try {
        if (req.headers.authorization) {
          user = await validateToken(req.headers.authorization);
        }
      } catch (e) {
        console.warn(`No se pudo autenticar el token.`);
      }
      return user;
    }
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'react',
    database: 'tfgback',
    entities: ['dist/**/*.model.js'],
    synchronize: true,
    migrations: ['dist/migrations/*{.ts, .js}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: true
  }),
  UserModule,
  LoginModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
