import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDTO } from "src/dto/user.dto";
import { getConnection, Repository } from "typeorm";
import { UserModel } from '../models/user.model';
import { UserModule } from './user.module';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserModel) private userRepository: Repository<UserModel>
    ){}

    async create(data: UserDTO): Promise<UserModel> {
        return await this.userRepository.save(data);
    }

    async findAll(): Promise<UserModel[]> {
        return await this.userRepository.find();
    }

    async findOne(username: string, password: string): Promise<UserModel> {
        const user = await this.userRepository.findOne({ where: {username: username} });

        if( user.password === password ){
            return user;
        }
        const badUser: UserModel = {
            id: -1,
            username: "",
            password: "",
            firstname: "",
            lastname: ""
        }

        return badUser
    }

    async delete(username: string): Promise<UserModel> {
        const rowDeleted = await this.userRepository.findOne({ where: { username: username } });
        // await getConnection()
        // .createQueryBuilder()
        // .delete()
        // .from(UserModel)
        // .where("id = :id", { id: rowDeleted.id })
        // .execute();

        await this.userRepository.delete(rowDeleted.id)

        return rowDeleted;
    }
}