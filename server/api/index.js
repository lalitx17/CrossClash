"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const GameManager_1 = require("./GameManager");
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
// Create an HTTP server
const server = http_1.default.createServer((req, res) => {
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
          ws.onopen = function() {
            console.log('WebSocket connection opened');
          };
          ws.onmessage = function(event) {
            document.getElementById('message').innerText = event.data;
          };
          ws.onclose = function() {
            console.log('WebSocket connection closed');
          };
        </script>
      </body>
      </html>
    `);
    }
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});
// Create a WebSocket server on top of the HTTP server
const wss = new ws_1.WebSocketServer({ server });
const gameManager = new GameManager_1.GameManager();
wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.send('Welcome! You are connected to the WebSocket server.');
    ws.on('close', () => gameManager.removeUser(ws)); // Use "close" instead of "disconnect"
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
