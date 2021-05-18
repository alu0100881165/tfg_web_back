import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CompanyCounters {
	@Field(() => [Number])
	counterIds: number[];
}
