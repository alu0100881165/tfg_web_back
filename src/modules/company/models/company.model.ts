import { Field, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

	@Field({ description: 'Contact phone' })
	@Column({ type: 'varchar', length: 255 })
	phone: string;

	@BeforeInsert()
	infoToLowerCase(): void {
		this.name = this.name.toLowerCase();
	}
}
