import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCounterDTO } from 'src/dto/CreateCounter.dto';
import { AuthUtils } from 'src/utils/auth.utils';
import { Repository } from 'typeorm';

import { CounterModel } from '../models/counter.model';

@Injectable()
export class CounterService {
	private logger = new Logger(CounterService.name, false);

	constructor(
		@InjectRepository(CounterModel) private counterRepository: Repository<CounterModel>
	) {}

	async create(counterRegist: CreateCounterDTO): Promise<CounterModel> {
		const newCounter: CreateCounterDTO = counterRegist;

		const userValid = await this.usernameExists(newCounter.username);
		if (!userValid) {
			this.logger.error(`Error al crear el contador ${newCounter.username}: ya esta en uso`);
			throw new BadRequestException({ message: 'Usuario en uso' });
		}

		newCounter.password = await AuthUtils.passwordToHash(newCounter.password);
		return this.counterRepository.save(newCounter);
	}

	async login(username: string, password: string): Promise<CounterModel> {
		const counter = await this.findUsername(username);
		if (!counter) {
			this.logger.error(`Error al hacer login con el contador (${username}). No existe`);
			throw new UnauthorizedException({
				message: 'Credenciales erroneas',
			});
		}
		const isSamePassword = await AuthUtils.comparePasswords(password, counter.password);
		if (!isSamePassword) {
			this.logger.error(
				`Error al hacer login con el contador (${username}). Las contraseñas no coinciden`
			);
			throw new UnauthorizedException({
				message: 'Credenciales erroneas',
			});
		}

		return counter;
	}

	async findAll(): Promise<CounterModel[]> {
		return this.counterRepository.find();
	}

	async findById(counterId: number): Promise<CounterModel> {
		return this.counterRepository.findOne(counterId);
	}

	async findUsername(username: string): Promise<CounterModel> {
		return this.counterRepository.findOne({ where: { username } });
	}

	async usernameExists(username: string): Promise<boolean> {
		const user = await this.findUsername(username);

		if (user) {
			return false;
		}

		return true;
	}

	async delete(counterId: string): Promise<CounterModel> {
		const rowDeleted = await this.counterRepository.findOne(counterId);

		await this.counterRepository.delete(rowDeleted.id);

		return rowDeleted;
	}
}
