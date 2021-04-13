import { Field, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

	@BeforeInsert()
	infoToLowerCase(): void {
		this.username = this.username.toLowerCase();
	}
}
