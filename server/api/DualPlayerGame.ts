import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, GAME_COMPLETED, SCORE_UPDATE } from "./messages";
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
    public endGame(endingPlayer: WebSocket) {
        const opponent = this.opponentFinder(endingPlayer);
    
        if (opponent) {
            opponent.send(JSON.stringify({
                type: GAME_COMPLETED
            }));
        }
    }

    public scoreUpdate(scoringPlayer: WebSocket, incrementAmount: string){
        const opponent = this.opponentFinder(scoringPlayer);
        if (opponent){
            opponent.send(JSON.stringify({
                type:SCORE_UPDATE,
                increment: incrementAmount
            }))
        }

    }

    private opponentFinder(player: WebSocket): WebSocket | undefined {
        return (player === this.player1) ? this.player2 : this.player1;
    }
}