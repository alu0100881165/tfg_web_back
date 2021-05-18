import { Field, ObjectType } from '@nestjs/graphql';
import { CompanyModel } from 'src/modules/company/models/company.model';
import { StatisticsModel } from 'src/modules/statistics/models/statistics.model';
import {
	BeforeInsert,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class CounterModel {
	@Field({ description: 'Identifier' })
	@PrimaryGeneratedColumn('rowid')
	id: number;

	@Field({ description: 'Username' })
	@Column({ type: 'varchar', length: 255, unique: true })
	username: string;

	// TODO añadir un nombre, distinto del username para evitar problemas al editarlo en el front

	@Column({ type: 'varchar', length: 255 })
	password: string;

	@Field({ description: 'Software Version' })
	@Column({ type: 'varchar', length: 255 })
	currentVersion: string;

	@Field({ description: 'Maximun capacity' })
	@Column({ type: 'int' })
	capacity: number;

	@Field(() => CompanyModel, { description: 'Associated company', nullable: true })
	@ManyToOne(() => CompanyModel, company => company.counters, {
		nullable: false,
	})
	@JoinColumn({ name: 'company' })
	company: CompanyModel;

	@OneToMany(() => StatisticsModel, statistics => statistics.counter, { nullable: true })
	statistics: CounterModel[];

	@BeforeInsert()
	infoToLowerCase(): void {
		this.username = this.username.toLowerCase();
	}
}
