import { db } from '../../../../shared/db/init-sqlite';
import { UserWithoutPassword } from '../../types';
import { ValidationService } from '../../../auth/services/ValidationService';
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

/**
 * Transform database row to UserWithoutPassword type
 */
function transformToUserWithoutPassword(dbRow: any): UserWithoutPassword {
  return {
    id: dbRow.id,
    email: dbRow.email,
    firstName: dbRow.firstName,
    lastName: dbRow.lastName,
    username: dbRow.username,
    profileName: dbRow.profileName,
    profilePicture: dbRow.profilePicture || dbRow.avatar,
    profileBio: dbRow.profileBio || dbRow.bio,
    profileLocation: dbRow.profileLocation || dbRow.location,
    profileWebsite: dbRow.profileWebsite || dbRow.website,
    profileBirthdate: dbRow.profileBirthdate ? new Date(dbRow.profileBirthdate) : undefined,
    profilePrivate: dbRow.profilePrivate || false,
    postsCount: dbRow.postsCount || 0,
    followersCount: dbRow.followersCount || 0,
    followingCount: dbRow.followingCount || 0,
    createdAt: new Date(dbRow.created_at),
    updatedAt: new Date(dbRow.updated_at)
  };
} 