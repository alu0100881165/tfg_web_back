import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UserModel } from './user.model';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from './dto/LoginUser.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserModel) private userRepository: Repository<UserModel>,
		private authService: AuthService
	) {}

	async create(newUser: CreateUserDTO): Promise<UserModel> {
		newUser.password = await this.authService.hashPassword(newUser.password);

		return await this.userRepository.create(newUser);
	}

	async findAll(): Promise<UserModel[]> {
		return await this.userRepository.find();
	}

	async findUser(username: string): Promise<UserModel> {
		return await this.userRepository.findOne({ where: { username } });
	}

	async login(credentials: LoginUserDto): Promise<UserModel> {
		const user = await this.usernameExists(credentials.username);

		const valid = await this.validatePassword(credentials.password, user.password);

		if (!valid) {
			throw new Error('La contraseña es incorrecta');
		}

		return user;
	}

	async validatePassword(password: string, storedHash: string): Promise<boolean> {
		return await this.authService.comparePassword(password, storedHash);
	}

	async usernameExists(username: string): Promise<UserModel> {
		const user = await this.findUser(username);

		if (!user) {
			throw new Error('El usuario no existe');
		}

		return user;
	}
}
