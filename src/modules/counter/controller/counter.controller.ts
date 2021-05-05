import { Controller, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
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

	constructor(private counterService: CounterService) {}

	// TODO Duracion access token tiempo de apertura de una empresa
	@Post('login')
	async loginCounter(
		@Req() request: Request,
		@Res() response: Response
	): Promise<Response<AccessTokenResponse>> {
		const { username, password }: BodyCredentials = request.body;

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
		}

		const counter = await this.counterService.findUsername(username);
		if (!counter) {
			return;
		}

		// TODO Almacenar datos en la bdd
		console.log('Existes y tienes un token');
	}
}
