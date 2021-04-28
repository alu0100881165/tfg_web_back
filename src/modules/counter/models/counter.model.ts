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

@ObjectType()
@Entity()
export class CounterModel {
	@Field({ description: 'Identifier' })
	@PrimaryGeneratedColumn('rowid')
	id: number;

	@Field({ description: 'Username' })
	@Column({ type: 'varchar', length: 255, unique: true })
	username: string;

	@Column({ type: 'varchar', length: 255 })
	password: string;

	@Field({ description: 'Software Version' })
	@Column({ type: 'varchar', length: 255 })
	currentVersion: string;

	@Field(() => CompanyModel, { description: 'Associated company' })
	@ManyToOne(() => CompanyModel, company => company.users, {
		nullable: false,
	})
	@JoinColumn({ name: 'company' })
	company: CompanyModel;

	@BeforeInsert()
	infoToLowerCase(): void {
		this.username = this.username.toLowerCase();
	}
}
