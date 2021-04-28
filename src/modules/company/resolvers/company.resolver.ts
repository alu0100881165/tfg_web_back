import { Inject, Logger } from '@nestjs/common';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CreateCompanyDTO } from 'src/dto/CreateCompany.dto';
import { UserModel } from 'src/modules/auth/models/user.model';
import { GraphQLCustomContext } from 'src/types/app.types';
import { AuthUtils } from 'src/utils/auth.utils';

import { UserService } from '../../auth/services/user.service';
import { CompanyModel } from '../models/company.model';
import { CompanyService } from '../services/company.service';

@Resolver(() => CompanyModel)
export class CompanyResolver {
	private logger = new Logger(CompanyModel.name);

	constructor(
		@Inject(CompanyService) private companyService: CompanyService,
		@Inject(UserService) private userService: UserService
	) {}

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
	deleteCompany(@Args('id') id: number): Promise<CompanyModel> {
		return this.companyService.delete(id);
	}

	// @ResolveField(() => UserModel)
	// async users(@Parent() user: UserModel): Promise<UserModel> {
	// 	const { id } = user;
	// 	return this.userService.findById(id);
	// }
}
