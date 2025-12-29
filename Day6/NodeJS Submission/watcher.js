const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

/**
 * FileWatcher Class
 * Extends EventEmitter to watch directory for file changes
 */
class FileWatcher extends EventEmitter {
  constructor(watchDir) {
    super();
    this.watchDir = watchDir;
    this.watcher = null;
    this.isWatching = false;
    
    // Validate directory exists
    if (!fs.existsSync(watchDir)) {
      fs.mkdirSync(watchDir, { recursive: true });
      this.emit('info', `Directory created: ${watchDir}`);
    }
  }

  /**
   * Start watching the directory
   */
  start() {
    if (this.isWatching) {
      this.emit('error', new Error('Watcher is already running'));
      return;
    }

    try {
      // Watch directory for changes
      this.watcher = fs.watch(this.watchDir, { recursive: true }, (eventType, filename) => {
        if (!filename) {
          return; // Some systems emit events without filename
        }

        const filePath = path.join(this.watchDir, filename);
        
        // Handle different event types
        this.handleFileEvent(eventType, filename, filePath);
      });

      this.isWatching = true;
      this.emit('started', `Watching directory: ${this.watchDir}`);

      // Handle watcher errors
      this.watcher.on('error', (error) => {
        this.emit('error', error);
      });

    } catch (error) {
      this.emit('error', error);
    }
  }

  /**
   * Handle file events (change, rename)
   */
  handleFileEvent(eventType, filename, filePath) {
    // Check if file exists to determine if it was added, modified, or deleted
    fs.stat(filePath, (err, stats) => {
      const timestamp = new Date().toISOString();

      if (err) {
        // File doesn't exist - it was deleted
        if (err.code === 'ENOENT') {
          this.emit('deleted', {
            filename,
            filePath,
            timestamp,
            eventType
          });
        } else {
          this.emit('error', err);
        }
      } else {
        // File exists - check if it's a file or directory
        if (stats.isFile()) {
          // Check if file was just created or modified
          this.checkFileStatus(filePath, filename, timestamp, eventType);
        } else if (stats.isDirectory()) {
          this.emit('directory', {
            filename,
            filePath,
            timestamp,
            eventType
          });
        }
      }
    });
  }

  /**
   * Check if file was added or modified
   */
  checkFileStatus(filePath, filename, timestamp, eventType) {
    // Use a small delay to distinguish between add and modify
    // In production, you might want to track file state
    const fileKey = filePath;
    
    if (!this.fileCache) {
      this.fileCache = new Set();
    }

    // Check if we've seen this file before
    if (this.fileCache.has(fileKey)) {
      // File exists and we've seen it - it was modified
      this.emit('modified', {
        filename,
        filePath,
        timestamp,
        eventType
      });
    } else {
      // First time seeing this file - it was added
      this.fileCache.add(fileKey);
      this.emit('added', {
        filename,
        filePath,
        timestamp,
        eventType
      });
    }
  }

  /**
   * Stop watching the directory
   */
  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      this.isWatching = false;
      this.emit('stopped', 'File watcher stopped');
    }
  }

  /**
   * Get current watch status
   */
  getStatus() {
    return {
      isWatching: this.isWatching,
      watchDir: this.watchDir
    };
  }
}

module.exports = FileWatcher;

