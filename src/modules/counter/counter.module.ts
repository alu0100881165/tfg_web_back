import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyModule } from '../company/company.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { CounterController } from './controller/counter.controller';
import { CounterModel } from './models/counter.model';
import { CounterResolver } from './resolvers/counter.resolver';
import { CounterService } from './services/counter.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([CounterModel]),
		forwardRef(() => CompanyModule),
		StatisticsModule,
	],
	controllers: [CounterController],
	providers: [CounterResolver, CounterService],
	exports: [CounterService],
})
export class CounterModule {}
