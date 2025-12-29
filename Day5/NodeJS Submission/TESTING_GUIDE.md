# Testing Guide - File Processing API

## Quick Test Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Server

```bash
npm start
```

### 3. Test with cURL

#### Test Server

```bash
curl http://localhost:3000/test
```

#### Process Sample File

```bash
curl -X POST http://localhost:3000/process-file \
  -H "Content-Type: application/json" \
  -d "{\"filename\": \"sample.csv\"}"
```

**Response:**

```json
{
  "message": "File processing started",
  "jobId": "job_1234567890_abc123",
  "statusUrl": "/status/job_1234567890_abc123"
}
```

#### Check Status

```bash
# Replace JOB_ID with actual jobId from above
curl http://localhost:3000/status/JOB_ID
```

### 4. Test with Postman

1. **Test Endpoint:**

   - Method: GET
   - URL: `http://localhost:3000/test`

2. **Process File:**

   - Method: POST
   - URL: `http://localhost:3000/process-file`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):

   ```json
   {
     "filename": "sample.csv"
   }
   ```

3. **Check Status:**
   - Method: GET
   - URL: `http://localhost:3000/status/{jobId}`

### 5. Verify Output

Check the `output/` directory for `processed_sample.csv`:

```bash
# Windows PowerShell
Get-Content "output/processed_sample.csv"

# Linux/Mac
cat output/processed_sample.csv
```

Expected output (all uppercase):

```csv
NAME,EMAIL,CITY
JOHN DOE,JOHN@EXAMPLE.COM,NEW YORK
JANE SMITH,JANE@EXAMPLE.COM,LOS ANGELES
...
```

### 6. Monitor Progress

Use a script to poll status:

```bash
# PowerShell
$jobId = "YOUR_JOB_ID"
while ($true) {
  $status = Invoke-RestMethod "http://localhost:3000/status/$jobId"
  Write-Host "Progress: $($status.progress)% - $($status.message)"
  if ($status.status -eq "completed" -or $status.status -eq "error") {
    break
  }
  Start-Sleep -Seconds 2
}
```

## Expected Behavior

1. **File Processing:**

   - Reads CSV file in chunks (64KB)
   - Converts each line to uppercase
   - Writes to output file
   - Tracks progress percentage

2. **Progress Updates:**

   - Updates every 5% progress
   - Shows lines processed
   - Shows bytes processed

3. **Status States:**
   - `processing`: File is being processed
   - `completed`: Processing finished successfully
   - `error`: An error occurred

## Troubleshooting

### File Not Found

- Ensure CSV file is in `uploads/` directory
- Check filename spelling (case-sensitive)

### Processing Stuck

- Check server logs for errors
- Verify file is not corrupted
- Ensure sufficient disk space

### Status Not Updating

- Check `status/` directory permissions
- Verify server has write permissions
