import { Field, ObjectType } from '@nestjs/graphql';
import { CompanyModel } from 'src/modules/company/models/company.model';
import {
	BeforeInsert,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { CounterModel } from '../../counter/models/counter.model';

@ObjectType()
@Entity()
export class StatisticsModel {
	@Field({ description: 'Identifier' })
	@PrimaryGeneratedColumn('rowid')
	id: number;

	@Field({ description: 'When data was received' })
	@Column({ type: 'timestamptz' })
	datetime: Date;

	@Field({ description: 'Number of people entering' })
	@Column({ type: 'int' })
	entering: number;

	@Field({ description: 'Number of people exiting' })
	@Column({ type: 'int' })
	exiting: number;

	@Field(() => CounterModel, { description: 'Associated counter' })
	@ManyToOne(() => CounterModel, counter => counter.statistics, {
		nullable: false,
	})
	@JoinColumn({ name: 'counter' })
	counter: CounterModel;
}
