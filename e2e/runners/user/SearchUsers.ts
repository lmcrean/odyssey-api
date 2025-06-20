import { APIRequestContext, expect } from '@playwright/test';

export class SearchUsersRunner {
  constructor(private request: APIRequestContext) {}

  async runValidSearch(query: string, limit?: number) {
    const url = new URL('/api/user/search', 'http://localhost');
    url.searchParams.append('q', query);
    if (limit) {
      url.searchParams.append('limit', limit.toString());
    }

    const response = await this.request.get(url.pathname + url.search);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('query', query);
    expect(data.data).toHaveProperty('results');
    expect(data.data).toHaveProperty('count');
    expect(Array.isArray(data.data.results)).toBe(true);

    return { success: true, data };
  }

  async runWithoutQuery() {
    const response = await this.request.get('/api/user/search');

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Search query is required');

    return { success: true, data };
  }

  async runWithEmptyQuery() {
    const response = await this.request.get('/api/user/search?q=');

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Search query is required');

    return { success: true, data };
  }

  async runWithShortQuery() {
    const response = await this.request.get('/api/user/search?q=x');

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Search query must be at least 2 characters long');

    return { success: true, data };
  }

  async runWithExcessiveLimit() {
    const response = await this.request.get('/api/user/search?q=test&limit=100');

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Search limit cannot exceed 50 results');

    return { success: true, data };
  }

  async runWithCustomLimit() {
    const response = await this.request.get('/api/user/search?q=test&limit=10');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data.data.results.length).toBeLessThanOrEqual(10);

    return { success: true, data };
  }

  async runWithWhitespaceQuery() {
    const response = await this.request.get('/api/user/search?q=%20%20%20'); // URL encoded spaces

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Search query must be at least 2 characters long');

    return { success: true, data };
  }
} 