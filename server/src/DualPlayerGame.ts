import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME } from "./messages";
import { crosswordData } from "./crosswordData";

export class DualPlayerGame {
    public player1: WebSocket;
    public player2: WebSocket;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                data: crosswordData
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                data: crosswordData
            }
        }));
    }
}