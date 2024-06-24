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
          const ws = new WebSocket('ws://' + window.location.host);
          ws.onmessage = function(event) {
            document.getElementById('message').innerText = event.data;
          };
        </script>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Create a WebSocket server on top of the HTTP server
const wss = new WebSocketServer({ server });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  gameManager.addUser(ws);
  ws.send('Welcome! You are connected to the WebSocket server.');

  ws.on('close', () => gameManager.removeUser(ws)); // Use "close" instead of "disconnect"
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
