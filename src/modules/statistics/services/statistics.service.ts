import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStatisticsDTO } from 'src/dto/CreateStatistics.dto';
import { FindOneOptions, Repository } from 'typeorm';

import { CounterService } from '../../counter/services/counter.service';
import { StatisticsModel } from '../models/statistics.model';
import { CountersLastStatistics } from '../responses/countersLastStatistics.response';
import { CountersStatistics } from '../responses/countersStatistics.response';

@Injectable()
export class StatisticsService {
	private logger = new Logger(StatisticsService.name, false);

	constructor(
		@InjectRepository(StatisticsModel) private statisticsRepository: Repository<StatisticsModel>,
		private counterService: CounterService
	) {}

	async create(statisticsReceived: CreateStatisticsDTO): Promise<StatisticsModel> {
		const newStatistics: CreateStatisticsDTO = statisticsReceived;

		const latestEntry = await this.findLatest(newStatistics.counter.id);

		if (
			!latestEntry ||
			statisticsReceived.datetime.getTime() - latestEntry.datetime.getTime() > /* 600000 */ 5000
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

	async findLatest(counterId: number): Promise<StatisticsModel> {
		const latestIdEntry = await this.statisticsRepository.findOne({
			where: { counter: { id: counterId } },
			order: { id: 'DESC' },
		});

		return latestIdEntry;
	}

	async findOne(id: number, options: FindOneOptions<StatisticsModel>): Promise<StatisticsModel> {
		return this.statisticsRepository.findOne(id, options);
	}

	async findAll(): Promise<StatisticsModel[]> {
		const test: StatisticsModel[] = await this.statisticsRepository.find();
		// console.log(test);
		return test;
	}

	async findFromCounters(countersIds: number[]): Promise<CountersLastStatistics[]> {
		const counterStatistics: CountersLastStatistics[] = [];
		let statistic: StatisticsModel;

		// eslint-disable-next-line no-restricted-syntax
		for (const counterId of countersIds) {
			// eslint-disable-next-line no-await-in-loop
			statistic = await this.findLatest(counterId);
			if (statistic) counterStatistics.push({ id: counterId, statistics: statistic });
		}

		return counterStatistics;
	}

	async findGraphicsStatistics(countersIds: number[]): Promise<StatisticsModel[][]> {
		const counterStatistics: StatisticsModel[][] = [[]];
		let statistics: StatisticsModel[] = [];
		// TODO obtener cada 10 minutos
		// eslint-disable-next-line no-restricted-syntax
		for (const counterId of countersIds) {
			// eslint-disable-next-line no-await-in-loop
			statistics = await this.statisticsRepository.find({
				where: { counter: { id: counterId } },
				order: { id: 'DESC' },
				take: 10,
			});
			if (statistics) counterStatistics.push(statistics);
		}

		return counterStatistics;
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
