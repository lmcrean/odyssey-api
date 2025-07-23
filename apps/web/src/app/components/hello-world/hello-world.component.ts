import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { HealthResponse } from '@odyssey/shared';

@Component({
  selector: 'app-hello-world',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.scss']
})
export class HelloWorldComponent implements OnInit {
  message: string = '';
  healthStatus: HealthResponse | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    this.apiService.getHealth().subscribe({
      next: (response) => {
        this.message = response;
        this.loadHealthStatus();
      },
      error: (err) => {
        this.error = 'Failed to connect to API: ' + err.message;
        this.loading = false;
      }
    });
  }

  private loadHealthStatus(): void {
    this.apiService.getHealthStatus().subscribe({
      next: (response) => {
        this.healthStatus = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load health status: ' + err.message;
        this.loading = false;
      }
    });
  }

  retry(): void {
    this.loadData();
  }
}