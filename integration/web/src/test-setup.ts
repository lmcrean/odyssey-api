// Load Zone.js first
import 'zone.js';
import 'zone.js/testing';

// Then import Angular testing modules
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Mock environment for tests
(globalThis as any).process = { env: { NODE_ENV: 'test' } };