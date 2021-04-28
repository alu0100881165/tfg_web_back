import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyDTO } from 'src/dto/CreateCompany.dto';
import { getConnection, Repository } from 'typeorm';

import { CompanyModel } from '../models/company.model';

@Injectable()
export class CompanyService {
	private logger = new Logger(CompanyService.name, false);

	constructor(
		@InjectRepository(CompanyModel) private companyRepository: Repository<CompanyModel>
	) {}

	// TODO comprobar que no exista ya
	async create(newCompany: CreateCompanyDTO): Promise<CompanyModel> {
		return this.companyRepository.save(newCompany);
	}

	// TODO al buscar controlar mensajes de error
	async findAll(): Promise<CompanyModel[]> {
		return this.companyRepository.find();
	}

	async findOne(id: number): Promise<CompanyModel> {
		return this.companyRepository.findOne(id);
	}

	async findOneByName(name: string): Promise<CompanyModel> {
		return this.companyRepository.findOne({ where: { name } });
	}

	async update(
		name: string,
		newName?: string,
		newAddress?: string,
		newPostalCode?: string,
		newPhone?: string
	): Promise<CreateCompanyDTO> {
		const companyUpdate = await this.findOneByName(name);
		const companyUpdateDto: CreateCompanyDTO = companyUpdate;

		if (!companyUpdate) {
			this.logger.error(`Error al actualizar la compañía ${name}: no existe`);
			throw new BadRequestException({ message: '[Update] Compañía no existe' });
		}

		if (newName) {
			companyUpdateDto.name = newName;
		}

		if (newAddress) {
			companyUpdateDto.address = newAddress;
		}

		if (newPostalCode) {
			companyUpdateDto.postalCode = newPostalCode;
		}

		if (newPhone) {
			companyUpdateDto.phone = newPhone;
		}

		await this.companyRepository.update(companyUpdate.id, companyUpdateDto);

		return companyUpdateDto;
	}

	async delete(id: number): Promise<CompanyModel> {
		const rowDeleted = await this.companyRepository.findOne(id);

		if (!rowDeleted) {
			this.logger.error(`Error al eliminar la compañía ${rowDeleted.name}: no existe`);
			throw new BadRequestException({ message: '[Delete] Compañía no existe' });
		}

		this.companyRepository.delete(id);

		return rowDeleted;
	}
}
