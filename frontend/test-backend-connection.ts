import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

import axios, { AxiosInstance } from 'axios';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// API configuration
const API_BASE_URL: string =
  process.env.VITE_API_BASE_URL || 'http://localhost:5000';
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
});

// Check if API is running
const isApiRunning = async (): Promise<boolean> => {
  try {
    await apiClient.get('/api/hello', { timeout: 1000 });
    return true;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('API check failed:', errorMessage);
    return false;
  }
};

// Try to start the backend server
const startBackendServer = async (): Promise<boolean> => {
  try {
    // Calculate paths
    const projectRoot: string = path.resolve(__dirname, '..');
    const backendDir: string = path.join(projectRoot, 'backend');
    const serverPath: string = path.join(backendDir, 'server.js');

    // Check if paths exist
    const backendExists: boolean = fs.existsSync(backendDir);
    const serverFileExists: boolean = fs.existsSync(serverPath);

    if (!backendExists || !serverFileExists) {
      console.error('❌ Required paths not found');
      return false;
    }

    // Find the Node executable path
    const nodeExecutable: string = process.execPath;

    const serverProcess: ChildProcess = spawn(nodeExecutable, [serverPath], {
      cwd: backendDir,
      stdio: 'pipe',
      env: { ...process.env, PORT: '5000' },
    });

    serverProcess.stderr?.on('data', (data: Buffer) => {
      console.error(`Backend server error: ${data.toString().trim()}`);
    });

    // Handle server exit
    serverProcess.on('exit', (_code: number | null) => {
      // Process exit handling
    });

    // Wait and check if server is running
    let serverStarted: boolean = false;
    for (let i = 0; i < 10; i++) {
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));

      if (await isApiRunning()) {
        serverStarted = true;
        break;
      }
    }

    if (!serverStarted) {
      serverProcess.kill();
      return false;
    }

    return true;
  } catch (error: unknown) {
    console.error('Error starting server:', error);
    return false;
  }
};

// Run the main test function
const runTest = async (): Promise<void> => {
  const apiRunning: boolean = await isApiRunning();

  if (apiRunning) {
    return;
  }

  await startBackendServer();
};

runTest().catch((error: unknown) => {
  console.error('Test failed:', error);
});
