import { Field, ObjectType } from '@nestjs/graphql';

import { UserModel } from '../models/user.model';

@ObjectType()
export class RegisterResponse {
	@Field(() => UserModel)
	user: UserModel;
}
