import { Inject, Logger } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCompanyDTO } from 'src/dto/CreateCompany.dto';
import { GraphQLCustomContext } from 'src/types/app.types';
import { AuthUtils } from 'src/utils/auth.utils';

import { CompanyModel } from '../models/company.model';
import { CompanyService } from '../services/company.service';

@Resolver(() => CompanyModel)
export class CompanyResolver {
	private logger = new Logger(CompanyModel.name);

	constructor(@Inject(CompanyService) private companyService: CompanyService) {}

	@Mutation(() => CompanyModel)
	async createCompany(
		@Args('name') name: string,
		@Args('address') address: string,
		@Args('postalCode') postalCode: string,
		@Args('phone') phone: string
	): Promise<CompanyModel> {
		return this.companyService.create({ name, address, postalCode, phone });
	}

	@Query(() => [CompanyModel])
	findAllCompanies(): Promise<CompanyModel[]> {
		return this.companyService.findAll();
	}

	@Query(() => CompanyModel)
	async findCompany(@Args('id') id: number): Promise<CompanyModel> {
		return this.companyService.findOne(id);
	}

	@Query(() => CompanyModel)
	async findCompanyByName(@Args('name') name: string): Promise<CompanyModel> {
		return this.companyService.findOneByName(name);
	}

	@Mutation(() => CompanyModel)
	async updateCompany(
		@Args('name') name: string,
		@Args('newName', { nullable: true }) newName?: string,
		@Args('newAddress', { nullable: true }) newAddress?: string,
		@Args('newPostalCode', { nullable: true }) newPostalCode?: string,
		@Args('newPhone', { nullable: true }) newPhone?: string
	): Promise<CreateCompanyDTO> {
		return this.companyService.update(name, newName, newAddress, newPostalCode, newPhone);
	}

	@Mutation(() => CompanyModel)
	delete(@Args('id') id: number): Promise<CompanyModel> {
		return this.companyService.delete(id);
	}
}
