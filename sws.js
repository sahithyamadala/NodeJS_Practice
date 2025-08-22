// const http = require('http');
// const path = require('path');
// const fs = require('fs');
// const { format } = require('date-fns');
// const { v4: uuidv4 } = require('uuid');

// const PORT = 3000;

// const server = http.createServer((req, res) => {
//   const requestId = uuidv4();
//   const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  
//   console.log(`[${timestamp}] [${requestId}] ${req.method} ${req.url}`);

//   // Content type detection
//   const extname = path.extname(req.url);
//   const contentTypes = {
//     '.jpg': 'image/jpeg',
//     '.jpeg': 'image/jpeg', 
//     '.png': 'image/png',
//     '.txt': 'text/plain',
//     '.html': 'text/html',
//     '.css': 'text/css',
//     '.js': 'application/javascript'
//   };
//   const contentType = contentTypes[extname] || 'text/html';

//   // File path logic
//   let filePath;
//   if (req.url === '/' || req.url === '') {
//     filePath = path.join(__dirname, 'views', 'index.html');
//   } else if (req.url.endsWith('/')) {
//     filePath = path.join(__dirname, 'views', req.url, 'index.html');
//   } else {
//     filePath = path.join(__dirname, req.url);
//   }

//   // Serve file
//   fs.readFile(filePath, (err, content) => {
//     if (err) {
//       res.writeHead(404, { 'Content-Type': 'text/plain' });
//       res.end(`404 Not Found - Request ID: ${requestId}`);
//       return;
//     }
    
//     res.writeHead(200, { 'Content-Type': contentType });
//     res.end(content);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT} - Started at ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`);
// });
//_________________________________________________________________________________________________________________________________


const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server1 = http.createServer((req, res) => {
  let filePath = '';

  if (req.url === '/') {
    filePath = path.join(__dirname, 'Files', 'index.html');
  } else if (req.url === '/about') {
    filePath = path.join(__dirname, 'Files', 'demo.html');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page Not Found</h1>');
    return;
  }

  // Read and serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
});

server1.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
