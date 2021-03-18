import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/CreateUser.dto';
import { UserModel } from '../models/user.model';
import { AuthService } from '../auth/auth.service';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserModel) private userRepository: Repository<UserModel>) {}

	async create(newUser: CreateUserDTO): Promise<UserModel> {
		return await this.userRepository.save(newUser);
	}

	async findAll(): Promise<UserModel[]> {
		return await this.userRepository.find();
	}

	async findUser(username: string): Promise<UserModel> {
		return await this.userRepository.findOne({ where: { username } });
	}

	async findEmail(email: string): Promise<UserModel> {
		return await this.userRepository.findOne({ where: { email } });
	}

	async validatePassword(password: string, storedHash: string): Promise<boolean> {
		return await this.comparePassword(password, storedHash);
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

	async hashPassword(password: string): Promise<string> {
		const hashedPassword: string = await new Promise((resolve, reject) => {
			hash(password, 12, function (err, hash) {
				if (err) reject(err);
				resolve(hash);
			});
		});

		return hashedPassword;
	}

	async comparePassword(password: string, storedHash: string): Promise<boolean> {
		const valid: boolean = await new Promise((resolve, reject) => {
			compare(password, storedHash, function (err, isValid) {
				if (err) reject(err);
				resolve(isValid);
			});
		});
		return valid;
	}

	// async setCurrentRefreshToken(refreshToken: string, userId: number) {
	// 	const currentHashedRefreshToken = await hash(refreshToken, 10);
	// 	await this.userRepository.update(userId, {
	// 		currentHashedRefreshToken,
	// 	});
	// }
}
