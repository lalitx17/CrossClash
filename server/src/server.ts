import WebSocket, { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const wss = new WebSocketServer({ port });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  gameManager.addUser(ws);
  ws.on("close", () => gameManager.removeUser(ws)); // Use "close" instead of "disconnect"
});

console.log(`WebSocket server is running on port ${port}`);
