import { db } from '../../../../shared/db/init-sqlite';
import { UserWithoutPassword } from '../../types';
import { ValidationService } from '../../../auth/services/ValidationService';
import { transformToUserWithoutPassword } from './transformations';
import * as bcrypt from 'bcrypt';

interface CreateUserInput {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
}

/**
 * Create a new user with essential validation and database insert
 * Enhanced function with lean validation approach
 */
export async function createUser(userData: CreateUserInput): Promise<UserWithoutPassword> {
  // 1. ESSENTIAL VALIDATION ONLY
  validateInput(userData);

  try {
    // 2. PASSWORD PROCESSING
    const hashedPassword = await hashPassword(userData.password);

    // 3. DATABASE INSERT
    const [user] = await db('users')
      .insert({
        id: userData.id,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');

    // 4. DATA TRANSFORMATION
    return transformToUserWithoutPassword(user);

  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Handle database constraints
    if (error.code === 'SQLITE_CONSTRAINT') {
      if (error.message.includes('users.email')) throw new Error('Email already exists');
      if (error.message.includes('users.username')) throw new Error('Username already exists');
    }
    
    throw new Error('Failed to create user');
  }
}

/**
 * Essential input validation only
 */
function validateInput(userData: CreateUserInput): void {
  if (!userData.id?.trim()) throw new Error('ID is required');
  if (!userData.firstName?.trim()) throw new Error('First name is required');
  if (!userData.lastName?.trim()) throw new Error('Last name is required');
  
  if (!ValidationService.validateEmail(userData.email)) {
    throw new Error('Invalid email format');
  }
  
  const passwordValidation = ValidationService.validatePassword(userData.password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.message!);
  }
}

/**
 * Hash password if not already hashed
 */
async function hashPassword(password: string): Promise<string> {
  return password.startsWith('$2b$') ? password : await bcrypt.hash(password, 10);
}

 