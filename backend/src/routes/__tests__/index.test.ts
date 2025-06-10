import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server';

describe('Routes', () => {
  describe('GET /api/hello', () => {
    it('should return hello message', async () => {
      const response = await request(app)
        .get('/api/hello')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Hello from Odyssey Backend!');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version', '1.0.0');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('message', 'Odyssey Backend is running');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/hello-db', () => {
    it('should return hello message from database', async () => {
      const response = await request(app)
        .get('/api/hello-db');

      // Should succeed with either 200 (found in DB) or 500 (DB error with fallback)
      expect([200, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('source');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('version', '1.0.0');
      } else {
        expect(response.body).toHaveProperty('fallback', 'Hello World from Neon DB! (error fallback)');
      }
    });
  });

  describe('GET /api/db-health', () => {
    it('should return database health status', async () => {
      const response = await request(app)
        .get('/api/db-health');

      // Should succeed with either 200 (healthy) or 500 (connection failed)
      expect([200, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('timestamp');
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('status', 'ok');
        expect(response.body).toHaveProperty('message', 'Database connection successful');
      } else {
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Database connection failed');
      }
    });
  });
}); 