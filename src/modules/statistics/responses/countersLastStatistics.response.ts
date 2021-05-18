import { Field, ObjectType } from '@nestjs/graphql';

import { StatisticsModel } from '../models/statistics.model';

@ObjectType()
export class CountersLastStatistics {
	@Field(() => Number)
	id: number;

	@Field(() => StatisticsModel)
	statistics: StatisticsModel;
}
