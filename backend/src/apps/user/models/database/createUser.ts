import { db } from '../../../../shared/db/init-sqlite';
import { User } from '../../types';
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
 * Create a new user record in database
 */
export async function createUser(userData: CreateUserInput): Promise<User> {
  try {
    // Ensure the table exists
    const tableExists = await db.schema.hasTable('users');
    if (!tableExists) {
      throw new Error('Users table not found - this should be created by init-sqlite.ts first');
    }

    // Hash password if not already hashed
    const hashedPassword = userData.password.startsWith('$2b$') 
      ? userData.password 
      : await bcrypt.hash(userData.password, 10);

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

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profileName: user.profileName,
      profilePicture: user.profilePicture || user.avatar,
      profileBio: user.profileBio || user.bio,
      profileLocation: user.profileLocation || user.location,
      profileWebsite: user.profileWebsite || user.website,
      profileBirthdate: user.profileBirthdate ? new Date(user.profileBirthdate) : undefined,
      profilePrivate: user.profilePrivate || false,
      postsCount: user.postsCount || 0,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
} 