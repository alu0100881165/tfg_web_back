import { Field, ObjectType } from '@nestjs/graphql';

import { CounterModel } from '../models/counter.model';

@ObjectType()
export class RegisterCounterResponse {
	@Field(() => CounterModel)
	counter: CounterModel;
}
