import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { CounterModule } from '../counter/counter.module';
import { CompanyModel } from './models/company.model';
import { CompanyResolver } from './resolvers/company.resolver';
import { CompanyService } from './services/company.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([CompanyModel]),
		forwardRef(() => AuthModule),
		forwardRef(() => CounterModule),
	],
	providers: [CompanyService, CompanyResolver],
	exports: [CompanyService],
})
export class CompanyModule {}
