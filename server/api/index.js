"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
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
        <script src="/socket.io/socket.io.js"></script>
        <script>
          const socket = io();
          socket.on('connect', () => {
            console.log('Socket.IO connection opened');
          });
          socket.on('message', (data) => {
            document.getElementById('message').innerText = data;
          });
          socket.on('disconnect', () => {
            console.log('Socket.IO connection closed');
          });
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
// Create a Socket.IO server on top of the HTTP server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "https://cross-clash-client.vercel.app",
        methods: ["GET", "POST"],
        credentials: true
    }
});
const gameManager = new GameManager_1.GameManager();
io.on('connection', (socket) => {
    gameManager.addUser(socket);
    socket.emit('message', 'Welcome! You are connected to the Socket.IO server.');
    socket.on('disconnect', () => gameManager.removeUser(socket));
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
