import knex from 'knex';
import config from './config';

const db = knex(config);

export async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing SQLite database...');
    
    // Test connection
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Create tables if they don't exist
    await createTables();
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function createTables() {
  // Users table
  const hasUsersTable = await db.schema.hasTable('users');
  if (!hasUsersTable) {
    await db.schema.createTable('users', (table) => {
      table.uuid('id').primary();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('username');
      table.string('firstName');
      table.string('lastName');
      table.string('avatar');
      
      // Profile fields
      table.text('profileBio');
      table.string('profileLocation');
      table.string('profileWebsite');
      table.string('profileName');
      table.string('profilePicture');
      table.date('profileBirthdate');
      table.boolean('profilePrivate').defaultTo(false);
      
      // Social counts
      table.integer('postsCount').defaultTo(0);
      table.integer('followersCount').defaultTo(0);
      table.integer('followingCount').defaultTo(0);
      
      table.timestamps(true, true);
    });
    console.log('✅ Users table created');
  }
  
  // Always check and add missing columns (for existing tables)
  const hasProfileColumns = await db.schema.hasColumn('users', 'profileBio');
  if (!hasProfileColumns) {
    console.log('🔄 Adding missing profile columns to users table...');
    await db.schema.alterTable('users', (table) => {
      // Profile fields
      table.text('profileBio');
      table.string('profileLocation');
      table.string('profileWebsite');
      table.string('profileName');
      table.string('profilePicture');
      table.date('profileBirthdate');
      table.boolean('profilePrivate').defaultTo(false);
      
      // Social counts
      table.integer('postsCount').defaultTo(0);
      table.integer('followersCount').defaultTo(0);
      table.integer('followingCount').defaultTo(0);
    });
    console.log('✅ Users table updated with profile fields');
  }

  // Messages table
  const hasMessagesTable = await db.schema.hasTable('messages');
  if (!hasMessagesTable) {
    await db.schema.createTable('messages', (table) => {
      table.uuid('id').primary();
      table.text('content').notNullable();
      table.uuid('senderId').notNullable();
      table.uuid('receiverId');
      table.uuid('conversationId');
      table.enum('messageType', ['text', 'image', 'file']).defaultTo('text');
      table.boolean('isRead').defaultTo(false);
      table.timestamps(true, true);
      
      table.foreign('senderId').references('id').inTable('users');
      table.foreign('receiverId').references('id').inTable('users');
    });
    console.log('✅ Messages table created');
  }

  // Conversations table
  const hasConversationsTable = await db.schema.hasTable('conversations');
  if (!hasConversationsTable) {
    await db.schema.createTable('conversations', (table) => {
      table.uuid('id').primary();
      table.json('participants');
      table.uuid('lastMessageId');
      table.timestamps(true, true);
      
      table.foreign('lastMessageId').references('id').inTable('messages');
    });
    console.log('✅ Conversations table created');
  }
}

export { db };
export default db; 