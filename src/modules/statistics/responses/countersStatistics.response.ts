import { Field, ObjectType } from '@nestjs/graphql';

import { StatisticsModel } from '../models/statistics.model';

@ObjectType()
export class CountersStatistics {
	@Field(() => Number)
	id: number;

	@Field(() => [StatisticsModel])
	statistics: StatisticsModel[];
}
