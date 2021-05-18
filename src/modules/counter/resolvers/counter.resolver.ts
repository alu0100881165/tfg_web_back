import { Logger } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CompanyModel } from 'src/modules/company/models/company.model';
import { CompanyService } from 'src/modules/company/services/company.service';

import { CounterModel } from '../models/counter.model';
import { CompanyCounters } from '../responses/companyCounters.response';
import { RegisterCounterResponse } from '../responses/register.response';
import { CounterService } from '../services/counter.service';

@Resolver(() => CounterModel)
export class CounterResolver {
	private logger = new Logger(CounterResolver.name);

	constructor(private counterService: CounterService, private companyService: CompanyService) {}

	@Mutation(() => RegisterCounterResponse)
	async createCounter(
		@Args('username') username: string,
		@Args('password') password: string,
		@Args('currentVersion') currentVersion: string,
		@Args('capacity') capacity: number,
		@Args('companyId') companyId: number
	): Promise<RegisterCounterResponse> {
		const company = await this.companyService.findOne(companyId);
		const counter = await this.counterService.create({
			username,
			password,
			currentVersion,
			capacity,
			company,
		});
		this.logger.log(`El contador ${counter.username} se ha registrado`);

		return { counter };
	}

	@Query(() => [CounterModel])
	findAllCounters(): Promise<CounterModel[]> {
		return this.counterService.findAll();
	}

	@Query(() => [CounterModel])
	async findAllCompanyCounters(@Args('companyId') companyId: number): Promise<CounterModel[]> {
		return this.counterService.findByCompanyId(companyId);
	}

	@ResolveField(() => CompanyModel)
	async company(@Parent() counter: CounterModel): Promise<CompanyModel> {
		const { company } = await this.counterService.findOne(counter.id, {
			relations: ['company'],
		});
		return company;
	}
}
