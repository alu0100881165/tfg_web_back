import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/dto/user.dto';

export async function hashPassword (user: UserDTO): Promise<string> {

    const password = user.password
  
    const hashedPassword: string = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function(err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
  
    return hashedPassword
  }