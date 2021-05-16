import { CounterModel } from '../modules/counter/models/counter.model';

export interface CreateStatisticsDTO {
	datetime: Date;
	entering: number;
	exiting: number;
	counter: CounterModel;
}
