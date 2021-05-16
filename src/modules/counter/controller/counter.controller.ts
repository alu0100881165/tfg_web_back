import { Controller, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { StatisticsService } from 'src/modules/statistics/services/statistics.service';
import { AccessTokenPayloadCounter } from 'src/types/counter.types';

import { CounterUtils } from '../../../utils/counter.utils';
import { Counter } from '../decorators/counter.decorator';
import { CounterGuard } from '../guards/counter.guard';
import { CounterService } from '../services/counter.service';

interface AccessTokenResponse {
	ok: boolean;
	message?: string;
	accessToken?: string;
}

interface BodyCredentials {
	username: string;
	password: string;
}

@Controller('counter')
export class CounterController {
	private logger = new Logger(CounterController.name);

	constructor(
		private counterService: CounterService,
		private statisticsService: StatisticsService
	) {}

	// TODO Duracion access token tiempo de apertura de una empresa
	@Post('login')
	async loginCounter(
		@Req() request: Request,
		@Res() response: Response
	): Promise<Response<AccessTokenResponse>> {
		const { username, password }: BodyCredentials = request.body;

		console.log('Me esta llegando: ', username, password);

		const counter = await this.counterService.login(username, password);

		this.logger.log(`El contador ${username} ha iniciado sesion`);

		const [accessToken] = CounterUtils.generateAccessToken(counter);

		return response.send({ ok: true, accessToken });
	}

	@UseGuards(CounterGuard)
	@Post('update-values')
	async updateValue(
		@Req() request: Request,
		@Counter() { username }: AccessTokenPayloadCounter
	): Promise<void> {
		const location = process.env.COUNTER_HEADER_KEY_LOCATION;
		const counterKey = request.headers[`${location}`];

		if (!counterKey) {
			return;
			// return response.status(400).send({
			// 	ok: false,
			// 	message: 'No se ha encontrado la ApiKey del contador',
			// });
		}

		const counter = await this.counterService.findUsername(username);
		if (!counter) {
			return;
			// return response.status(400).send({
			// 	ok: false,
			// 	message: 'No se ha encontrado ningún contador con la ApiKey suministrada',
			// });
		}

		const actualDate = new Date();

		this.statisticsService.create({
			datetime: actualDate,
			entering: request.body.entering,
			exiting: request.body.exiting,
			counter,
		});
	}
}
