async function globalTeardown() {
  // Clean up any hanging resources
  console.log('🧹 Cleaning up after Playwright tests...');
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  // Set a timeout to force exit if needed
  setTimeout(() => {
    console.log('⏰ Force exiting after teardown timeout');
    process.exit(0);
  }, 2000);
}

export default globalTeardown; 