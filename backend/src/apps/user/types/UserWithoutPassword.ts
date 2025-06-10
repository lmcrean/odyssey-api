import { User } from './User';

export interface UserWithoutPassword extends Omit<User, 'password'> {} 