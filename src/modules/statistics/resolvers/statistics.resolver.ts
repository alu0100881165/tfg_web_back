import { Logger } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CounterModel } from 'src/modules/counter/models/counter.model';

import { CounterService } from '../../counter/services/counter.service';
import { StatisticsModel } from '../models/statistics.model';
import { CountersLastStatistics } from '../responses/countersLastStatistics.response';
import { CountersStatistics } from '../responses/countersStatistics.response';
import { StatisticsService } from '../services/statistics.service';

@Resolver(() => StatisticsModel)
export class StatisticsResolver {
	private logger = new Logger(StatisticsModel.name);

	constructor(
		private statisticsService: StatisticsService,
		private counterService: CounterService
	) {}

	@Query(() => StatisticsModel)
	findLatest(@Args('counterId') counterId: number): Promise<StatisticsModel> {
		return this.statisticsService.findLatest(counterId);
	}

	@Query(() => [StatisticsModel])
	findAllStatistics(): Promise<StatisticsModel[]> {
		return this.statisticsService.findAll();
	}

	@Query(() => [CountersLastStatistics])
	async findStatisticsFromCounters(
		@Args({ name: 'countersIds', type: () => [Number] }) countersIds: number[]
	): Promise<CountersLastStatistics[]> {
		const countersStatistics = await this.statisticsService.findFromCounters(countersIds);
		return countersStatistics;
	}

	@Query(() => [[StatisticsModel]])
	async findGraphicsStatistics(
		@Args({ name: 'countersIds', type: () => [Number] }) countersIds: number[]
	): Promise<StatisticsModel[][]> {
		return this.statisticsService.findGraphicsStatistics(countersIds);
	}

	@ResolveField(() => CounterModel)
	async counter(@Parent() statistic: StatisticsModel): Promise<CounterModel> {
		const { counter } = await this.statisticsService.findOne(statistic.id, {
			relations: ['counter'],
		});
		return counter;
	}
}
