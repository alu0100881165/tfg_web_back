import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CounterController } from './controller/counter.controller';
import { CounterModel } from './models/counter.model';
import { CounterResolver } from './resolvers/counter.resolver';
import { CounterService } from './services/counter.service';

@Module({
	imports: [TypeOrmModule.forFeature([CounterModel])],
	controllers: [CounterController],
	providers: [CounterResolver, CounterService],
})
export class CounterModule {}
