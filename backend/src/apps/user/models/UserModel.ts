import { db } from '../../../shared/db/init-sqlite';
import { User, DatabaseUser } from '../types';
import bcrypt from 'bcrypt';

export class UserModel {
  // Initialize the users table with profile columns (this will use the schema from init-sqlite.ts)
  static async initializeTable() {
    // The table creation is handled by init-sqlite.ts during server startup
    // This method ensures the table exists but doesn't recreate it
    const tableExists = await db.schema.hasTable('users');
    if (!tableExists) {
      // This should not happen in normal operation since init-sqlite.ts creates the table
      console.log('⚠️  Users table not found - this should be created by init-sqlite.ts first');
    }
  }

  static async findById(id: string): Promise<DatabaseUser | null> {
    await this.initializeTable();
    
    const user = await db('users').where({ id }).first();
    
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      password: user.password, // Include password for auth
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatarUrl: user.avatar || user.profilePicture, // Handle both column names
      isPrivate: user.profilePrivate || false,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    };
  }

  static async findByEmail(email: string): Promise<DatabaseUser | null> {
    await this.initializeTable();
    
    const user = await db('users').where({ email }).first();
    
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      password: user.password, // Include password for auth
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatarUrl: user.avatar || user.profilePicture,
      isPrivate: user.profilePrivate || false,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    };
  }

  static async findByUsername(username: string): Promise<User | null> {
    await this.initializeTable();
    
    const user = await db('users').where({ username }).first();
    
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatarUrl: user.avatar || user.profilePicture,
      isPrivate: user.profilePrivate || false,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    };
  }

  static async create(userData: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username?: string;
  }): Promise<User> {
    await this.initializeTable();
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
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
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatarUrl: user.avatar || user.profilePicture,
      isPrivate: user.profilePrivate || false,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    };
  }

  static async update(id: string, updateData: Partial<{
    firstName: string;
    lastName: string;
    username: string;
    bio: string;
    location: string;
    website: string;
    avatarUrl: string;
    isPrivate: boolean;
  }>): Promise<User | null> {
    await this.initializeTable();
    
    // Map to database column names (camelCase as per init-sqlite.ts schema)
    const dbUpdateData: any = {};
    if (updateData.firstName !== undefined) dbUpdateData.firstName = updateData.firstName;
    if (updateData.lastName !== undefined) dbUpdateData.lastName = updateData.lastName;
    if (updateData.username !== undefined) dbUpdateData.username = updateData.username;
    if (updateData.bio !== undefined) dbUpdateData.bio = updateData.bio;
    if (updateData.location !== undefined) dbUpdateData.location = updateData.location;
    if (updateData.website !== undefined) dbUpdateData.website = updateData.website;
    if (updateData.avatarUrl !== undefined) dbUpdateData.avatar = updateData.avatarUrl;
    // Skip isPrivate update for now - column might not exist yet
    // if (updateData.isPrivate !== undefined) dbUpdateData.profilePrivate = updateData.isPrivate;
    
    dbUpdateData.updated_at = db.fn.now();
    
    const [updatedUser] = await db('users')
      .where({ id })
      .update(dbUpdateData)
      .returning('*');
    
    if (!updatedUser) return null;
    
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      bio: updatedUser.bio,
      location: updatedUser.location,
      website: updatedUser.website,
      avatarUrl: updatedUser.avatar || updatedUser.profilePicture,
      isPrivate: updatedUser.profilePrivate || false,
      createdAt: new Date(updatedUser.created_at),
      updatedAt: new Date(updatedUser.updated_at)
    };
  }

  static async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    await this.initializeTable();
    
    const users = await db('users')
      .where('username', 'like', `%${query}%`)
      .orWhere('firstName', 'like', `%${query}%`)
      .orWhere('lastName', 'like', `%${query}%`)
      .limit(limit)
      .select('*');

    return users.map((user: any) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatarUrl: user.avatar || user.profilePicture,
      isPrivate: user.profilePrivate || false,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    }));
  }

  static async checkUsernameExists(username: string): Promise<boolean> {
    await this.initializeTable();
    
    const user = await db('users').where({ username }).first();
    return !!user;
  }

  // Helper method for creating users (used by auth service)
  static async createUser(userData: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    await this.initializeTable();
    
    // Generate a simple ID for SQLite
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    const [user] = await db('users')
      .insert({
        id: id,
        email: userData.email,
        password: userData.password, // Already hashed by auth service
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatarUrl: user.avatar || user.profilePicture,
      isPrivate: user.profilePrivate || false,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    };
  }
} 