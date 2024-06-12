import { WebSocket } from "ws";
import { DUAL_PLAYER, INIT_GAME, SINGLE_PLAYER } from "./messages";
import { DualPlayerGame } from "./DualPlayerGame";
import { SinglePlayerGame } from "./SinglePlayerGame";

export class GameManager {
  private dualPlayerGames: DualPlayerGame[];
  private singlePlayerGames: SinglePlayerGame[];

  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.dualPlayerGames = [];
    this.pendingUser = null;
    this.users = [];
    this.singlePlayerGames = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data: string) => {
      const message = JSON.parse(data.toString());

      if (message.mode === SINGLE_PLAYER) {
        if (message.type === INIT_GAME){
            const singlePlayerGame = new SinglePlayerGame(socket);
            this.singlePlayerGames.push(singlePlayerGame);
            console.log("Game Started");
        }

      } else if (message.mode === DUAL_PLAYER) {
        if (message.type === INIT_GAME) {
          if (this.pendingUser) {
            const dualPlayerGame = new DualPlayerGame(this.pendingUser, socket);
            this.dualPlayerGames.push(dualPlayerGame);
            this.pendingUser = null;
            console.log("Game started");
          } else {
            this.pendingUser = socket;
            console.log("Waiting for another player");
          }
        }
      }
    });
  }
}
