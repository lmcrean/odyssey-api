import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { HelloWorldComponent } from '../../../../apps/web/src/app/components/hello-world/hello-world.component';
import { ApiService } from '../../../../apps/web/src/app/services/api.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('HelloWorldComponent Integration Tests', () => {
  let component: HelloWorldComponent;
  let fixture: ComponentFixture<HelloWorldComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HelloWorldComponent
      ],
      providers: [ApiService]
    }).compileComponents();

    fixture = TestBed.createComponent(HelloWorldComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
  });

  describe('Component Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should load data on init', () => {
      const healthSpy = vi.spyOn(apiService, 'getHealth').mockReturnValue(of('Hello World!'));
      const statusSpy = vi.spyOn(apiService, 'getHealthStatus').mockReturnValue(of({
        message: 'Test message',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }));

      component.ngOnInit();

      expect(healthSpy).toHaveBeenCalled();
      expect(statusSpy).toHaveBeenCalled();
    });
  });

  describe('Data Loading', () => {
    it('should display loading state initially', () => {
      vi.spyOn(apiService, 'getHealth').mockReturnValue(of('Hello World!'));
      vi.spyOn(apiService, 'getHealthStatus').mockReturnValue(of({
        message: 'Test message',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }));

      component.loadData();
      
      expect(component.loading).toBe(true);
      expect(component.error).toBe('');
    });

    it('should handle successful API response', async () => {
      const mockMessage = 'Hello World from C# API!';
      const mockStatus = {
        message: 'Hello World from Competitor Analysis API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      };

      vi.spyOn(apiService, 'getHealth').mockReturnValue(of(mockMessage));
      vi.spyOn(apiService, 'getHealthStatus').mockReturnValue(of(mockStatus));

      component.loadData();

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.loading).toBe(false);
      expect(component.message).toBe(mockMessage);
      expect(component.healthStatus).toEqual(mockStatus);
      expect(component.error).toBe('');
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'Connection failed';
      vi.spyOn(apiService, 'getHealth').mockReturnValue(throwError(() => new Error(errorMessage)));

      component.loadData();

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.loading).toBe(false);
      expect(component.error).toContain(errorMessage);
      expect(component.message).toBe('');
    });
  });

  describe('UI Integration', () => {
    it('should display error message in template', () => {
      component.error = 'Test error message';
      component.loading = false;
      
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.error')).toBeTruthy();
      expect(compiled.textContent).toContain('Test error message');
    });

    it('should display success message in template', () => {
      component.message = 'Hello World!';
      component.loading = false;
      component.error = '';
      
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.success')).toBeTruthy();
      expect(compiled.textContent).toContain('Hello World!');
    });

    it('should display loading state in template', () => {
      component.loading = true;
      
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.loading')).toBeTruthy();
      expect(compiled.textContent).toContain('Loading...');
    });

    it('should handle retry button click', () => {
      const loadDataSpy = vi.spyOn(component, 'loadData');
      component.error = 'Some error';
      component.loading = false;
      
      fixture.detectChanges();
      
      const retryButton = fixture.nativeElement.querySelector('button');
      retryButton.click();
      
      expect(loadDataSpy).toHaveBeenCalled();
    });
  });

  describe('Health Status Display', () => {
    it('should display health status when available', () => {
      const mockStatus = {
        message: 'API is healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      };

      component.healthStatus = mockStatus;
      component.loading = false;
      component.error = '';
      
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain(mockStatus.message);
      expect(compiled.textContent).toContain(mockStatus.version);
    });

    it('should not display health status when loading', () => {
      component.loading = true;
      component.healthStatus = {
        message: 'API is healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      };
      
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.status-card')).toBeFalsy();
    });
  });
});