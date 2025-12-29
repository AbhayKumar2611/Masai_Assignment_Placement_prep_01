const fs = require('fs');
const path = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { Transform } = require('stream');

// Store processing status
const processingStatus = new Map();

// Transform stream to convert lines to uppercase
class UppercaseTransform extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
    this.lineCount = 0;
  }

  _transform(chunk, encoding, callback) {
    this.lineCount++;
    const upperCaseLine = chunk.toString().toUpperCase();
    callback(null, upperCaseLine);
  }
}

// Process CSV file using streams
const processCSVFile = async (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({ 
      error: 'Filename is required',
      message: 'Please provide filename in request body: { "filename": "input.csv" }'
    });
  }

  const inputPath = path.join(__dirname, '../uploads', filename);
  const outputPath = path.join(__dirname, '../output', `processed_${filename}`);
  const statusDir = path.join(__dirname, '../status');

  // Create status directory if it doesn't exist
  if (!fs.existsSync(statusDir)) {
    fs.mkdirSync(statusDir, { recursive: true });
  }

  // Generate job ID
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const statusFile = path.join(statusDir, `${jobId}.json`);

  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    return res.status(404).json({ 
      error: 'File not found',
      message: `File ${filename} not found in uploads directory`,
      hint: 'Place your CSV file in the uploads directory'
    });
  }

  // Initialize status
  const initialStatus = {
    jobId,
    status: 'processing',
    progress: 0,
    message: 'Processing started',
    inputFile: filename,
    outputFile: `processed_${filename}`,
    startTime: new Date().toISOString()
  };

  fs.writeFileSync(statusFile, JSON.stringify(initialStatus, null, 2));
  processingStatus.set(jobId, initialStatus);

  // Start processing asynchronously
  processFileStream(inputPath, outputPath, jobId, statusFile)
    .then(() => {
      console.log(`✅ Processing completed for job: ${jobId}`);
    })
    .catch((error) => {
      console.error(`❌ Processing failed for job: ${jobId}:`, error);
      updateStatus(jobId, statusFile, {
        status: 'error',
        progress: 0,
        message: `Error: ${error.message}`,
        error: error.message,
        endTime: new Date().toISOString()
      });
    });

  // Return immediately with job ID
  res.status(202).json({
    message: 'File processing started',
    jobId,
    statusUrl: `/status/${jobId}`
  });
};

// Process file using streams
const processFileStream = (inputPath, outputPath, jobId, statusFile) => {
  return new Promise((resolve, reject) => {
    try {
      // Get file size for progress calculation
      const stats = fs.statSync(inputPath);
      const fileSize = stats.size;
      let processedBytes = 0;
      let lineCount = 0;

      // Create read stream
      const readStream = createReadStream(inputPath, { 
        encoding: 'utf8',
        highWaterMark: 64 * 1024 // 64KB chunks
      });

      // Create write stream
      const writeStream = createWriteStream(outputPath, { encoding: 'utf8' });

      // Create transform stream for uppercase conversion
      const uppercaseTransform = new Transform({
        objectMode: false,
        transform(chunk, encoding, callback) {
          const data = chunk.toString();
          const lines = data.split('\n');
          
          // Process each line
          const processedLines = lines.map((line, index) => {
            if (line.trim()) {
              lineCount++;
              return line.toUpperCase();
            }
            return line;
          });

          processedBytes += chunk.length;
          const progress = Math.min(100, Math.round((processedBytes / fileSize) * 100));

          // Update status every 5% progress
          if (progress % 5 === 0 || progress === 100) {
            updateStatus(jobId, statusFile, {
              status: 'processing',
              progress,
              message: `Processing... ${progress}% complete`,
              linesProcessed: lineCount,
              bytesProcessed: processedBytes,
              totalBytes: fileSize
            });
          }

          callback(null, processedLines.join('\n'));
        },
        flush(callback) {
          callback();
        }
      });

      // Pipe streams: read -> transform -> write
      readStream
        .pipe(uppercaseTransform)
        .pipe(writeStream);

      // Handle stream events
      readStream.on('error', (error) => {
        reject(new Error(`Read error: ${error.message}`));
      });

      writeStream.on('error', (error) => {
        reject(new Error(`Write error: ${error.message}`));
      });

      writeStream.on('finish', () => {
        // Final status update
        updateStatus(jobId, statusFile, {
          status: 'completed',
          progress: 100,
          message: 'Processing completed successfully',
          linesProcessed: lineCount,
          endTime: new Date().toISOString(),
          outputPath: outputPath
        });

        resolve();
      });

    } catch (error) {
      reject(error);
    }
  });
};

// Update status file
const updateStatus = (jobId, statusFile, updates) => {
  try {
    let status = {};
    if (fs.existsSync(statusFile)) {
      status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    }
    
    const updatedStatus = { ...status, ...updates };
    fs.writeFileSync(statusFile, JSON.stringify(updatedStatus, null, 2));
    processingStatus.set(jobId, updatedStatus);
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

module.exports = { processCSVFile };

