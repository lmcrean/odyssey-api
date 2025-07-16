#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m'
};

function log(message, color = COLORS.RESET) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function runCommand(command, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    log(`\n${COLORS.BLUE}Running: ${command}${COLORS.RESET}`, COLORS.BOLD);
    log(`${COLORS.BLUE}Directory: ${cwd}${COLORS.RESET}`);
    
    const child = spawn(command, { 
      shell: true, 
      stdio: 'inherit', 
      cwd 
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        log(`${COLORS.GREEN}✅ Command succeeded: ${command}${COLORS.RESET}`);
        resolve();
      } else {
        log(`${COLORS.RED}❌ Command failed: ${command} (exit code: ${code})${COLORS.RESET}`);
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    child.on('error', (err) => {
      log(`${COLORS.RED}❌ Command error: ${err.message}${COLORS.RESET}`);
      reject(err);
    });
  });
}

async function runTests() {
  const args = process.argv.slice(2);
  const testType = args[0] || 'all';
  
  log(`${COLORS.BOLD}🧪 Competitor Analysis Dashboard Test Runner${COLORS.RESET}`, COLORS.BLUE);
  log(`${COLORS.BOLD}Test Type: ${testType}${COLORS.RESET}`, COLORS.BLUE);
  
  try {
    switch (testType) {
      case 'api':
        log(`${COLORS.YELLOW}Running API Integration Tests...${COLORS.RESET}`);
        await runCommand('dotnet test', path.join(__dirname, 'integration-tests', 'api'));
        break;
        
      case 'web':
        log(`${COLORS.YELLOW}Running Web Integration Tests...${COLORS.RESET}`);
        await runCommand('npm test', path.join(__dirname, 'integration-tests', 'web'));
        break;
        
      case 'e2e':
        log(`${COLORS.YELLOW}Running E2E Tests...${COLORS.RESET}`);
        await runCommand('npm test', path.join(__dirname, 'e2e-tests'));
        break;
        
      case 'integration':
        log(`${COLORS.YELLOW}Running Integration Tests (API + Web)...${COLORS.RESET}`);
        await runCommand('dotnet test', path.join(__dirname, 'integration-tests', 'api'));
        await runCommand('npm test', path.join(__dirname, 'integration-tests', 'web'));
        break;
        
      case 'all':
        log(`${COLORS.YELLOW}Running All Tests...${COLORS.RESET}`);
        await runCommand('dotnet test', path.join(__dirname, 'integration-tests', 'api'));
        await runCommand('npm test', path.join(__dirname, 'integration-tests', 'web'));
        await runCommand('npm test', path.join(__dirname, 'e2e-tests'));
        break;
        
      default:
        log(`${COLORS.RED}Unknown test type: ${testType}${COLORS.RESET}`);
        log(`${COLORS.YELLOW}Available options: api, web, e2e, integration, all${COLORS.RESET}`);
        process.exit(1);
    }
    
    log(`${COLORS.GREEN}${COLORS.BOLD}🎉 All tests completed successfully!${COLORS.RESET}`);
    
  } catch (error) {
    log(`${COLORS.RED}${COLORS.BOLD}💥 Tests failed: ${error.message}${COLORS.RESET}`);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log(`${COLORS.RED}Unhandled Rejection at: ${promise}, reason: ${reason}${COLORS.RESET}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  log(`${COLORS.RED}Uncaught Exception: ${err.message}${COLORS.RESET}`);
  process.exit(1);
});

runTests();