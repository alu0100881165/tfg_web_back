import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CounterModule } from '../counter/counter.module';
import { StatisticsModel } from './models/statistics.model';
import { StatisticsResolver } from './resolvers/statistics.resolver';
import { StatisticsService } from './services/statistics.service';

@Module({
	imports: [TypeOrmModule.forFeature([StatisticsModel]), forwardRef(() => CounterModule)],
	// controllers: [CounterController],
	providers: [StatisticsResolver, StatisticsService],
	exports: [StatisticsService],
})
export class StatisticsModule {}
