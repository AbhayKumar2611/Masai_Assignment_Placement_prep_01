const express = require('express');
const fs = require('fs');
const path = require('path');
const { processCSVFile } = require('./controllers/file.controller');

const app = express();
app.use(express.json());

// Create necessary directories
const uploadsDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'output');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Routes
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'File Processing API is running' });
});

// File processing endpoint
app.post('/process-file', processCSVFile);

// Get processing status
app.get('/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const statusFile = path.join(__dirname, 'status', `${jobId}.json`);
  
  if (fs.existsSync(statusFile)) {
    const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    res.json(status);
  } else {
    res.status(404).json({ error: 'Job not found' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

