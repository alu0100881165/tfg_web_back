import { Field, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserModel } from '../../auth/models/user.model';

@ObjectType()
@Entity()
export class CompanyModel {
	@Field({ description: 'Identifier' })
	@PrimaryGeneratedColumn('rowid')
	id: number;

	@Field({ description: 'Company name' })
	@Column({ type: 'varchar', length: 255, unique: true })
	name: string;

	@Field({ description: 'Company address' })
	@Column({ type: 'varchar', length: 255 })
	address: string;

	@Field({ description: 'Company postal code' })
	@Column({ type: 'varchar', length: 255 })
	postalCode: string;

	@Field({ description: 'Contact phone' })
	@Column({ type: 'varchar', length: 255 })
	phone: string;

	// @Field(() => [UserModel], { description: 'Related users' })
	@OneToMany(() => UserModel, user => user.company, { nullable: true })
	users: UserModel[];

	@BeforeInsert()
	infoToLowerCase(): void {
		this.name = this.name.toLowerCase();
	}
}
