import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
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
}
