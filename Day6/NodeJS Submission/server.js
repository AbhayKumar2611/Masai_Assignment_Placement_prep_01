const FileWatcher = require('./watcher');
const path = require('path');

// Directory to watch (default: ./watch)
const WATCH_DIR = path.join(__dirname, 'watch');

// Create file watcher instance
const fileWatcher = new FileWatcher(WATCH_DIR);

// Event listeners with timestamps

// File Added Event
fileWatcher.on('added', (data) => {
  console.log(`\n📄 [${data.timestamp}] FILE ADDED:`);
  console.log(`   File: ${data.filename}`);
  console.log(`   Path: ${data.filePath}`);
  console.log(`   Event Type: ${data.eventType}`);
});

// File Modified Event
fileWatcher.on('modified', (data) => {
  console.log(`\n✏️  [${data.timestamp}] FILE MODIFIED:`);
  console.log(`   File: ${data.filename}`);
  console.log(`   Path: ${data.filePath}`);
  console.log(`   Event Type: ${data.eventType}`);
});

// File Deleted Event
fileWatcher.on('deleted', (data) => {
  console.log(`\n🗑️  [${data.timestamp}] FILE DELETED:`);
  console.log(`   File: ${data.filename}`);
  console.log(`   Path: ${data.filePath}`);
  console.log(`   Event Type: ${data.eventType}`);
});

// Directory Event
fileWatcher.on('directory', (data) => {
  console.log(`\n📁 [${data.timestamp}] DIRECTORY EVENT:`);
  console.log(`   Directory: ${data.filename}`);
  console.log(`   Path: ${data.filePath}`);
});

// Info Event
fileWatcher.on('info', (message) => {
  console.log(`\nℹ️  [${new Date().toISOString()}] INFO: ${message}`);
});

// Started Event
fileWatcher.on('started', (message) => {
  console.log(`\n✅ [${new Date().toISOString()}] ${message}`);
  console.log(`\n📂 Watching directory: ${WATCH_DIR}`);
  console.log(`\n💡 Try creating, modifying, or deleting files in the 'watch' directory`);
  console.log(`   Press Ctrl+C to stop watching\n`);
});

// Stopped Event
fileWatcher.on('stopped', (message) => {
  console.log(`\n🛑 [${new Date().toISOString()}] ${message}`);
});

// Error Event Handler
fileWatcher.on('error', (error) => {
  console.error(`\n❌ [${new Date().toISOString()}] ERROR:`);
  console.error(`   Message: ${error.message}`);
  console.error(`   Stack: ${error.stack}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down file watcher...');
  fileWatcher.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down file watcher...');
  fileWatcher.stop();
  process.exit(0);
});

// Start watching
console.log('🚀 Starting File Watcher...\n');
fileWatcher.start();

// Keep process alive
process.stdin.resume();

