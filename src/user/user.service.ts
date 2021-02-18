import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDTO } from "src/dto/user.dto";
import { Repository } from "typeorm";
import { UserModel } from '../models/user.model';

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

}