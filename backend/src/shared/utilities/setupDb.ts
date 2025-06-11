import { initializeDatabase, db } from '../db/init-sqlite.js';

export async function setup() {
  console.log('🧪 Setting up test database...');
  
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  try {
    await initializeDatabase();
    console.log('✅ Test database setup complete');
  } catch (error) {
    console.error('❌ Test database setup failed:', error);
    throw error;
  }
}

export async function teardown() {
  console.log('🧹 Cleaning up test database...');
  try {
    // Close all database connections and destroy the pool
    await db.destroy();
    console.log('✅ Database connections closed');
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  }
} 