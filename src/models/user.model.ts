import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//TODO implementar un contador, para que cuando se cambie la contraseña, se invaliden todos los tokens anteriores
//TODO plantearse eliminar el login como modulo, y que toodo lo haga el user

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

    @Field()
    @Column( {type: "integer", default: 0 } )
    counter: number;
}