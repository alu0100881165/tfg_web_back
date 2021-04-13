import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/types/auth.types';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class UserModel {
	@Field({ description: 'Identifier' })
	@PrimaryGeneratedColumn('rowid')
	id: number;

	@Field({ description: 'Username' })
	@Column({ type: 'varchar', length: 255, unique: true })
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

	@BeforeInsert()
	infoToLowerCase(): void {
		this.username = this.username.toLowerCase();
		this.email = this.email.toLowerCase();
	}
}
