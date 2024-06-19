import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, GAME_COMPLETED } from "./messages";
import { crosswordData, crosswordData2 } from "./crosswordData";

export class DualPlayerGame {
    public player1: WebSocket;
    public player2: WebSocket;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                data: crosswordData2
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                data: crosswordData2
            }
        }));
    }
    endGame(endingPlayer: WebSocket) {
        const opponent = (endingPlayer === this.player1) ? this.player2 : this.player1;
    
        opponent.send(JSON.stringify({
            type: GAME_COMPLETED
          }));
      }
}