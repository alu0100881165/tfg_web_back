import { Logger } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CounterModel } from 'src/modules/counter/models/counter.model';

import { CounterService } from '../../counter/services/counter.service';
import { StatisticsModel } from '../models/statistics.model';
import { StatisticsService } from '../services/statistics.service';

@Resolver(() => StatisticsModel)
export class StatisticsResolver {
	private logger = new Logger(StatisticsModel.name);

	constructor(
		private statisticsService: StatisticsService,
		private counterService: CounterService
	) {}

	@Query(() => StatisticsModel)
	findLatest(): Promise<StatisticsModel> {
		const dateNow = new Date();
		return this.statisticsService.findLatest();
	}

	@Query(() => [StatisticsModel])
	findAllStatistics(): Promise<StatisticsModel[]> {
		return this.statisticsService.findAll();
	}

	@ResolveField(() => CounterModel)
	async company(@Parent() counter: CounterModel): Promise<CounterModel> {
		const { id } = counter;
		return this.counterService.findById(id);
	}
}
