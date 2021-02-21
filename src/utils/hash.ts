import * as bcrypt from 'bcrypt';
import { decode } from 'jsonwebtoken';
import { UserDTO } from 'src/dto/user.dto';
import * as config from "config";
import { UserModel } from '../models/user.model';

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

export async function checkPassword (user: UserDTO, password: string): Promise<boolean> {

  bcrypt.compare(user.password, password)
  .then((isMatch) => {
    if(isMatch)
      return true;
  });
  
  return false;
}

export async function validateToken (bearer: string): Promise<UserModel>{
  const token = bearer.split(" ")[1];

  const payload = decode(token, config.get('jwtSecret'))
  console.log(payload);
  
  return {
    "id": 1,
    "username": "test",
    "password": "$2b$10$5eZiGx92nYlzpZlsm0qQC.f/xg6wQBpt7aQG.oZXfhKRU4AYJvD2a",
    "firstname": "Prueba",
    "lastname": "Usuario",
    "counter": 0
  };
}