import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, HealthResponse } from '../../../../apps/web/src/app/services/api.service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ApiService Integration Tests', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'http://localhost:5000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getHealth', () => {
    it('should return hello world message', () => {
      const mockResponse = 'Hello World from C# API!';

      service.getHealth().subscribe(response => {
        expect(response).toBe(mockResponse);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/health`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle HTTP errors gracefully', () => {
      service.getHealth().subscribe({
        next: () => expect.fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/health`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getHealthStatus', () => {
    it('should return structured health response', () => {
      const mockResponse: HealthResponse = {
        message: 'Hello World from Competitor Analysis API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      };

      service.getHealthStatus().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.message).toBe('Hello World from Competitor Analysis API');
        expect(response.version).toBe('1.0.0');
        expect(response.timestamp).toBeDefined();
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/health/status`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle malformed JSON responses', () => {
      service.getHealthStatus().subscribe({
        next: () => expect.fail('Should have failed'),
        error: (error) => {
          expect(error.name).toBe('HttpErrorResponse');
        }
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/health/status`);
      req.flush('Invalid JSON', { status: 200, statusText: 'OK' });
    });
  });

  describe('HTTP Configuration', () => {
    it('should make requests with correct headers', () => {
      service.getHealth().subscribe();

      const req = httpMock.expectOne(`${mockApiUrl}/api/health`);
      expect(req.request.headers.get('Accept')).toBe('text/plain, application/json, text/plain, */*');
    });

    it('should handle network timeouts', () => {
      service.getHealthStatus().subscribe({
        next: () => expect.fail('Should have failed'),
        error: (error) => {
          expect(error.name).toBe('HttpErrorResponse');
        }
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/health/status`);
      req.error(new ProgressEvent('timeout'));
    });
  });
});