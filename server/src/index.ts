import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import { GameManager } from './GameManager';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>WebSocket Test</title>
      </head>
      <body>
        <h1>WebSocket Test</h1>
        <div id="message"></div>
        <script>
          const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const ws = new WebSocket(wsProtocol + '//' + window.location.host);
          
          ws.onopen = function() {
            console.log('WebSocket connection opened');
          };
          
          ws.onmessage = function(event) {
            document.getElementById('message').innerText = event.data;
          };
          
          ws.onclose = function() {
            console.log('WebSocket connection closed');
          };
          
          ws.onerror = function(error) {
            console.error('WebSocket error:', error);
          };
        </script>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Create a WebSocket server on top of the HTTP server
const wss = new WebSocketServer({ server });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  console.log('A new client connected');
  gameManager.addUser(ws);
  ws.send('Welcome! You are connected to the WebSocket server.');

  ws.on('close', () => {
    console.log('A client disconnected');
    gameManager.removeUser(ws);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
