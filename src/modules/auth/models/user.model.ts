import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/types/auth.types';
import {
	BeforeInsert,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { CompanyModel } from '../../company/models/company.model';

@ObjectType()
@Entity()
export class UserModel {
	@Field({ description: 'Identifier' })
	@PrimaryGeneratedColumn('rowid')
	id: number;

	@Field({ description: 'Username' })
	@Column({ type: 'varchar', length: 255 })
	username: string;

	@Field({ description: 'Email' })
	@Column({ type: 'varchar', length: 255, unique: true })
	email: string;

	@Field(() => [Role], { description: 'Roles' })
	@Column('enum', { enum: Role, nullable: false, array: true, default: [Role.BaseUser] })
	roles: Role[];

	@Column({ type: 'varchar', length: 255 })
	password: string;

	@Field({ description: 'Name' })
	@Column({ type: 'varchar', length: 255 })
	firstname: string;

	@Field({ description: 'Lastname' })
	@Column({ type: 'varchar', length: 255 })
	lastname: string;

	@Column({ type: 'integer', default: 0 })
	tokenVersion: number;

	// @Field()
	// @Column({ type: 'integer', nullable: false })
	// companyId: number;

	@Field(() => CompanyModel, { description: 'Associated company', nullable: true })
	@ManyToOne(() => CompanyModel, company => company.users, {
		nullable: false,
	})
	@JoinColumn({ name: 'company' })
	company: CompanyModel;

	@BeforeInsert()
	infoToLowerCase(): void {
		this.username = this.username.toLowerCase();
		this.email = this.email.toLowerCase();
	}
}
