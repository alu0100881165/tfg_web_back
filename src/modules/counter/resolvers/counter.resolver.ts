import { Inject, Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CounterModel } from '../models/counter.model';
import { RegisterCounterResponse } from '../responses/register.response';
import { CounterService } from '../services/counter.service';

@Resolver(() => CounterModel)
export class CounterResolver {
	private logger = new Logger(CounterResolver.name);

	constructor(@Inject(CounterService) private counterService: CounterService) {}

	@Mutation(() => RegisterCounterResponse)
	async createCounter(
		@Args('username') username: string,
		@Args('password') password: string,
		@Args('currentVersion') currentVersion: string
	): Promise<RegisterCounterResponse> {
		const counter = await this.counterService.create({
			username,
			password,
			currentVersion,
		});
		this.logger.log(`El contador ${counter.username} se ha registrado`);

		return { counter };
	}
}
