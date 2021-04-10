import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDTO } from '../../dto/CreateUser.dto';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserModel) private userRepository: Repository<UserModel>) {}

	async create(newUser: CreateUserDTO): Promise<UserModel> {
		return this.userRepository.save(newUser);
	}

	async findAll(): Promise<UserModel[]> {
		return this.userRepository.find();
	}

	async findById(userId: number): Promise<UserModel> {
		return this.userRepository.findOne(userId);
	}

	async findUser(username: string): Promise<UserModel> {
		return this.userRepository.findOne({ where: { username } });
	}

	async findEmail(email: string): Promise<UserModel> {
		return this.userRepository.findOne({ where: { email } });
	}

	async usernameExists(username: string): Promise<boolean> {
		const user = await this.findUser(username);

		if (user) {
			return false;
		}

		return true;
	}

	async emailExists(email: string): Promise<boolean> {
		const user = await this.findEmail(email);

		if (user) {
			return false;
		}

		return true;
	}

	async delete(userId: string): Promise<UserModel> {
		const rowDeleted = await this.userRepository.findOne(userId);

		await this.userRepository.delete(rowDeleted.id);

		return rowDeleted;
	}
}
