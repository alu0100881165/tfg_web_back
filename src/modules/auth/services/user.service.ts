import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/dto/CreateUser.dto';
import { FindOneOptions, getRepository, Repository } from 'typeorm';

import { UserModel } from '../models/user.model';

@Injectable()
export class UserService {
	private logger = new Logger(UserService.name, false);

	constructor(@InjectRepository(UserModel) private userRepository: Repository<UserModel>) {}

	async create(newUser: CreateUserDTO): Promise<UserModel> {
		return this.userRepository.save(newUser);
	}

	async findAll(): Promise<UserModel[]> {
		return this.userRepository.find({ relations: ['company'] });
		// const users = await getRepository(UserModel)
		// 	.createQueryBuilder('user')
		// 	.groupBy('user.id')
		// 	.getMany();

		// return users;
	}

	async findCompanyUsers(companyId: number): Promise<UserModel[]> {
		return this.userRepository.find({ where: { company: { id: companyId } } });
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

	async findCompanyUser(username: string, companyId: number): Promise<UserModel> {
		return this.userRepository.findOne({
			where: [{ username, company: { id: companyId } }],
		});
	}

	async findEmail(email: string): Promise<UserModel> {
		return this.userRepository.findOne({ where: { email } });
	}

	async usernameExists(username: string, companyId: number): Promise<boolean> {
		const user = await this.findCompanyUser(username, companyId);

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
	): Promise<UserModel> {
		const userUpdate = await this.findUser(username);
		const userUpdateDto: CreateUserDTO = userUpdate;

		console.log('ESta llegando: ', username, newUsername, newEmail, newFirstname, newLastname);

		if (!userUpdate) {
			this.logger.error(`Error al actualizar el usuario ${username}: no existe`);
			throw new BadRequestException({ message: '[Update] Usuario no existe' });
		}

		if (newUsername) {
			userUpdateDto.username = newUsername;
		}

		if (newEmail) {
			const emailValid = await this.emailExists(newEmail);

			if (!emailValid) {
				throw new Error('El email ya está asignado a otra cuenta');
			}
			userUpdateDto.email = newEmail;
		}

		if (newFirstname) {
			userUpdateDto.firstname = newFirstname;
		}

		if (newLastname) {
			userUpdateDto.lastname = newLastname;
		}

		const updatedUser = await this.userRepository.save({ ...userUpdate, ...userUpdateDto });

		return updatedUser;
	}

	async delete(userId: number): Promise<UserModel> {
		const rowDeleted = await this.userRepository.findOne(userId);

		await this.userRepository.delete(rowDeleted.id);

		return rowDeleted;
	}
}
