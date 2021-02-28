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
		const userValid = await this.usernameExists(newUser.username);
		if (!userValid) {
			throw new Error('El usuario ya existe');
		}

		const emailValid = await this.emailExists(newUser.email);

		if (!emailValid) {
			throw new Error('El email ya está asignado a otra cuenta');
		}

		newUser.password = await this.authService.hashPassword(newUser.password);

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

	async login(credentials: LoginUserDto): Promise<UserModel> {
		const user = await this.findUser(credentials.username);

		if (!user) {
			throw new Error('El usuario no existe');
		}

		const valid = await this.validatePassword(credentials.password, user.password);

		if (!valid) {
			throw new Error('La contraseña es incorrecta');
		}

		return user;
	}

	async validatePassword(password: string, storedHash: string): Promise<boolean> {
		return await this.authService.comparePassword(password, storedHash);
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
}
