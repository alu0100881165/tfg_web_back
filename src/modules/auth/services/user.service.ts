import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/dto/CreateUser.dto';
import { FindOneOptions, Repository } from 'typeorm';

import { UserModel } from '../models/user.model';

@Injectable()
export class UserService {
	private logger = new Logger(UserService.name, false);

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

	async findOne(userId: number, options: FindOneOptions<UserModel>): Promise<UserModel> {
		const user = await this.userRepository.findOne(userId, options);

		return user;
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

	async update(
		username: string,
		newUsername?: string,
		newEmail?: string,
		newFirstname?: string,
		newLastname?: string
	): Promise<CreateUserDTO> {
		const userUpdate = await this.findUser(username);
		const userUpdateDto: CreateUserDTO = userUpdate;

		if (!userUpdate) {
			this.logger.error(`Error al actualizar el usuario ${username}: no existe`);
			throw new BadRequestException({ message: '[Update] Usuario no existe' });
		}

		if (newUsername) {
			userUpdateDto.username = newUsername;
		}

		if (newEmail) {
			userUpdateDto.email = newEmail;
		}

		if (newFirstname) {
			userUpdateDto.firstname = newFirstname;
		}

		if (newLastname) {
			userUpdateDto.lastname = newLastname;
		}

		await this.userRepository.update(userUpdate.id, userUpdateDto);

		return userUpdateDto;
	}

	async delete(userId: string): Promise<UserModel> {
		const rowDeleted = await this.userRepository.findOne(userId);

		await this.userRepository.delete(rowDeleted.id);

		return rowDeleted;
	}
}
