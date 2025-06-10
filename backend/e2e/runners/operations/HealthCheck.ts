import { APIRequestContext } from '@playwright/test';
import { HealthStatusRunner } from '../health/HealthStatus';
import { HelloMessageRunner } from '../health/HelloMessage';
import { HelloFromSQLiteRunner } from '../health/HelloFromSQLite';
import { DatabaseHealthRunner } from '../health/DatabaseHealth';
import { CorsCheckRunner } from '../health/CorsCheck';

export class HealthCheckOperation {
  private healthStatusRunner: HealthStatusRunner;
  private helloMessageRunner: HelloMessageRunner;
  private helloFromSQLiteRunner: HelloFromSQLiteRunner;
  private databaseHealthRunner: DatabaseHealthRunner;
  private corsCheckRunner: CorsCheckRunner;

  constructor(private request: APIRequestContext) {
    this.healthStatusRunner = new HealthStatusRunner(request);
    this.helloMessageRunner = new HelloMessageRunner(request);
    this.helloFromSQLiteRunner = new HelloFromSQLiteRunner(request);
    this.databaseHealthRunner = new DatabaseHealthRunner(request);
    this.corsCheckRunner = new CorsCheckRunner(request);
  }

  async runHealthStatus() {
    return await this.healthStatusRunner.run();
  }

  async runHelloMessage() {
    return await this.helloMessageRunner.run();
  }

  async runHelloFromDatabase() {
    return await this.helloFromSQLiteRunner.run();
  }

  async runDatabaseHealth() {
    return await this.databaseHealthRunner.run();
  }

  async runCorsCheck() {
    return await this.corsCheckRunner.run();
  }

  async runAllHealthChecks() {
    const results = {
      healthStatus: await this.runHealthStatus(),
      helloMessage: await this.runHelloMessage(),
      helloFromDatabase: await this.runHelloFromDatabase(),
      databaseHealth: await this.runDatabaseHealth(),
      corsCheck: await this.runCorsCheck()
    };

    return results;
  }
} 