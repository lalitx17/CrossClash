import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME } from "./messages";
import { crosswordData, crosswordData2 } from "./crosswordData";

export class SinglePlayerGame {
    public player1: WebSocket;

    constructor(player1: WebSocket) {
        this.player1 = player1;
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                data: crosswordData
            }
        }));
    }
}