import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class UserModel {
    @Field()
    @PrimaryGeneratedColumn( "rowid" )
    id: number;

    @Field()
    @Column( {type: "varchar", length: 255, unique: true } )
    username: string;

    @Field()
    @Column( {type: "varchar", length: 255 } )
    password: string;

    @Field()
    @Column( {type: "varchar", length: 255 } )
    firstname: string;

    @Field()
    @Column( {type: "varchar", length: 255 } )
    lastname: string;
}