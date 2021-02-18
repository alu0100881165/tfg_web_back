import { ObjectType, Field } from '@nestjs/graphql';

ObjectType()
export class LoginModel{
    @Field()
    username: string

    @Field()
    password: string
}