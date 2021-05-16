import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStatisticsDTO } from 'src/dto/CreateStatistics.dto';
import { createQueryBuilder, Repository } from 'typeorm';

import { CounterService } from '../../counter/services/counter.service';
import { StatisticsModel } from '../models/statistics.model';

@Injectable()
export class StatisticsService {
	private logger = new Logger(StatisticsService.name, false);

	constructor(
		@InjectRepository(StatisticsModel) private statisticsRepository: Repository<StatisticsModel>,
		private counterService: CounterService
	) {}

	async create(statisticsReceived: CreateStatisticsDTO): Promise<StatisticsModel> {
		const newStatistics: CreateStatisticsDTO = statisticsReceived;

		const latestEntry = await this.findLatest();

		if (
			!latestEntry ||
			statisticsReceived.datetime.getTime() - latestEntry.datetime.getTime() > 60000
		) {
			const createdStatistics = await this.statisticsRepository.save(newStatistics);

			this.logger.log(`Se han generado estadísticas del contador ${createdStatistics.counter.id}`);

			return createdStatistics;
		}

		const updatedLastStatistic = await this.statisticsRepository.save({
			id: latestEntry.id,
			newStatistics,
		});

		this.logger.log(
			`Se han actualizado las últimas estadísticas del contador ${updatedLastStatistic.newStatistics.counter.id}`
		);

		return updatedLastStatistic;
	}

	async findLatest(): Promise<StatisticsModel> {
		const latestIdEntry = await this.statisticsRepository.findOne({
			order: { id: 'DESC' },
		});

		return latestIdEntry;
	}

	async findOne(id: number): Promise<StatisticsModel> {
		return this.statisticsRepository.findOne(id);
	}

	async findAll(): Promise<StatisticsModel[]> {
		return this.statisticsRepository.find();
	}

	// async findById(counterId: number): Promise<CounterModel> {
	// 	return this.counterRepository.findOne(counterId);
	// }

	// async findUsername(username: string): Promise<CounterModel> {
	// 	return this.counterRepository.findOne({ where: { username } });
	// }

	// async usernameExists(username: string): Promise<boolean> {
	// 	const user = await this.findUsername(username);

	// 	if (user) {
	// 		return false;
	// 	}

	// 	return true;
	// }

	// async delete(counterId: string): Promise<CounterModel> {
	// 	const rowDeleted = await this.counterRepository.findOne(counterId);

	// 	await this.counterRepository.delete(rowDeleted.id);

	// 	return rowDeleted;
	// }
}
