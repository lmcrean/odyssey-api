import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../../../../apps/web/src/app/services/api.service';
import { HealthResponse, API_MESSAGES, API_VERSION } from '@odyssey/shared';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock environment
const environment = {
  apiUrl: 'http://localhost:5000'
};

describe('ApiService Integration Tests', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Clear any previous test module configuration
    TestBed.resetTestingModule();
    
    // Mock the environment module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: 'environment', useValue: environment }
      ]
    });

    // Override the environment import
    TestBed.overrideProvider(ApiService, {
      useFactory: (http: any) => {
        const service = new ApiService(http);
        (service as any).baseUrl = environment.apiUrl;
        return service;
      },
      deps: [HttpClient]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  describe('getHealth', () => {
    it('should return hello world message', () => {
      const mockResponse = API_MESSAGES.HEALTH;

      service.getHealth().subscribe(response => {
        expect(response).toBe(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/health`);
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

      const req = httpMock.expectOne(`${environment.apiUrl}/api/health`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getHealthStatus', () => {
    it('should return structured health response', () => {
      const mockResponse: HealthResponse = {
        message: API_MESSAGES.HEALTH_STATUS,
        version: API_VERSION,
        timestamp: new Date().toISOString()
      };

      service.getHealthStatus().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.message).toBe(API_MESSAGES.HEALTH_STATUS);
        expect(response.version).toBe(API_VERSION);
        expect(response.timestamp).toBeDefined();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/health/status`);
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

      const req = httpMock.expectOne(`${environment.apiUrl}/api/health/status`);
      req.flush('Invalid JSON', { status: 200, statusText: 'OK' });
    });
  });

  describe('HTTP Configuration', () => {
    it('should make requests with correct headers', () => {
      service.getHealth().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/health`);
      // Angular's HttpClient automatically sets Accept headers
      const acceptHeader = req.request.headers.get('Accept');
      expect(acceptHeader).toBeTruthy();
    });

    it('should handle network timeouts', () => {
      service.getHealthStatus().subscribe({
        next: () => expect.fail('Should have failed'),
        error: (error) => {
          expect(error.name).toBe('HttpErrorResponse');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/health/status`);
      req.error(new ProgressEvent('timeout'));
    });
  });
});