import { Field, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class UserModel {
	@Field()
	@PrimaryGeneratedColumn('rowid')
	id: number;

	@Field()
	@Column({ type: 'varchar', length: 255, unique: true })
	username: string;

	@Field()
	@Column({ type: 'varchar', length: 255, unique: true })
	email: string;

	@Column({ type: 'varchar', length: 255 })
	password: string;

	@Field()
	@Column({ type: 'varchar', length: 255 })
	firstname: string;

	@Field()
	@Column({ type: 'varchar', length: 255 })
	lastname: string;

	@Field()
	@Column({ type: 'integer', default: 0 })
	tokenVersion: number;

	@BeforeInsert()
	infoToLowerCase() {
		this.username = this.username.toLowerCase();
		this.email = this.email.toLowerCase();
	}
}
