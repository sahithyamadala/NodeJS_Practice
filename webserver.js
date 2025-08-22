const http = require('http');
const path = require('path');
const fs = require('fs');
const { format, formatDistance } = require('date-fns');
const { v4: uuidv4 } = require('uuid');

const PORT = 3000;
const serverStartTime = new Date();
const serverId = uuidv4();

// Request logging with timestamps and unique IDs
const logRequest = (req) => {
  const requestId = uuidv4();
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const uptime = formatDistance(serverStartTime, new Date(), { addSuffix: true });
  
  console.log(`[${timestamp}] [${requestId}] ${req.method} ${req.url}`);
  console.log(`Server uptime: ${uptime}`);
  
  return requestId;
};

// Enhanced content type detection
const getContentType = (url) => {
  const extname = path.extname(url);
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip'
  };
  
  return contentTypes[extname] || 'text/html';
};

// Generate server info page
const generateServerInfo = (requestId) => {
  const now = new Date();
  const uptime = formatDistance(serverStartTime, now, { addSuffix: true });
  const currentTime = format(now, 'EEEE, MMMM do, yyyy \'at\' h:mm:ss a');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Info</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .info-box { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .timestamp { color: #666; font-size: 0.9em; }
        .uuid { font-family: monospace; background: #e8e8e8; padding: 3px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>Server Information</h1>
    <div class="info-box">
        <h3>Server Details</h3>
        <p><strong>Server ID:</strong> <span class="uuid">${serverId}</span></p>
        <p><strong>Started:</strong> ${format(serverStartTime, 'EEEE, MMMM do, yyyy \'at\' h:mm:ss a')}</p>
        <p><strong>Uptime:</strong> ${uptime}</p>
        <p><strong>Port:</strong> ${PORT}</p>
    </div>
    
    <div class="info-box">
        <h3>Current Request</h3>
        <p><strong>Request ID:</strong> <span class="uuid">${requestId}</span></p>
        <p><strong>Time:</strong> ${currentTime}</p>
    </div>
    
    <div class="info-box">
        <h3>Available Endpoints</h3>
        <ul>
            <li><a href="/">/</a> - This server info page</li>
            <li><a href="/status">/status</a> - Server status JSON</li>
            <li><a href="/time">/time</a> - Current time in various formats</li>
            <li>Static files from your project directory</li>
        </ul>
    </div>
</body>
</html>`;
};

// Generate time information
const generateTimeInfo = () => {
  const now = new Date();
  return {
    iso: now.toISOString(),
    formatted: format(now, 'EEEE, MMMM do, yyyy \'at\' h:mm:ss a'),
    timestamp: now.getTime(),
    uptime: formatDistance(serverStartTime, now, { addSuffix: true }),
    serverStarted: format(serverStartTime, 'yyyy-MM-dd HH:mm:ss')
  };
};

const server = http.createServer((req, res) => {
  const requestId = logRequest(req);
  const contentType = getContentType(req.url);
  
  // Handle special endpoints
  if (req.url === '/status') {
    const status = {
      serverId,
      requestId,
      uptime: formatDistance(serverStartTime, new Date(), { addSuffix: true }),
      timestamp: new Date().toISOString(),
      port: PORT
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status, null, 2));
    return;
  }
  
  if (req.url === '/time') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(generateTimeInfo(), null, 2));
    return;
  }
  
  // Determine the file path to serve
  let filePath;
  if (contentType === 'text/html' && (req.url === '/' || req.url === '')) {
    // Check if index.html exists, otherwise show server info
    const indexPath = path.join(__dirname, 'views', 'index.html');
    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
    } else {
      // Generate server info page
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(generateServerInfo(requestId));
      return;
    }
  } else if (contentType === 'text/html' && req.url.endsWith('/')) {
    filePath = path.join(__dirname, 'views', req.url, 'index.html');
  } else {
    filePath = path.join(__dirname, req.url);
  }
  
  // Read the file and send response
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.log(`[${format(new Date(), 'HH:mm:ss')}] [${requestId}] 404 - File not found: ${filePath}`);
      
      // Enhanced 404 page
      const notFoundPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Not Found</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; }
        .error-info { color: #666; margin-top: 20px; }
        .uuid { font-family: monospace; background: #f0f0f0; padding: 2px 4px; }
    </style>
</head>
<body>
    <h1>404 - Not Found</h1>
    <p>The requested file could not be found.</p>
    <div class="error-info">
        <p>Request ID: <span class="uuid">${requestId}</span></p>
        <p>Time: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}</p>
        <p><a href="/">← Back to home</a></p>
    </div>
</body>
</html>`;
      
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(notFoundPage);
      return;
    }
    
    console.log(`[${format(new Date(), 'HH:mm:ss')}] [${requestId}] 200 - Served: ${filePath}`);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  const startMessage = `
Server started successfully!
📍 Server ID: ${serverId}
🕐 Started at: ${format(serverStartTime, 'EEEE, MMMM do, yyyy \'at\' h:mm:ss a')}
🔗 Running on: http://localhost:${PORT}
📊 Endpoints:
   • http://localhost:${PORT}/ - Home/Server info
   • http://localhost:${PORT}/status - Server status JSON
   • http://localhost:${PORT}/time - Time information
`;
  
  console.log(startMessage);
});