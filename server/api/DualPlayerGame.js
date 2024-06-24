"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DualPlayerGame = void 0;
const messages_1 = require("./messages");
const crosswordData_1 = require("./crosswordData");
class DualPlayerGame {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                data: crosswordData_1.crosswordData2
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                data: crosswordData_1.crosswordData2
            }
        }));
    }
    endGame(endingPlayer) {
        const opponent = this.opponentFinder(endingPlayer);
        if (opponent) {
            opponent.send(JSON.stringify({
                type: messages_1.GAME_COMPLETED
            }));
        }
    }
    scoreUpdate(scoringPlayer, incrementAmount) {
        const opponent = this.opponentFinder(scoringPlayer);
        if (opponent) {
            opponent.send(JSON.stringify({
                type: messages_1.SCORE_UPDATE,
                increment: incrementAmount
            }));
        }
    }
    opponentFinder(player) {
        return (player === this.player1) ? this.player2 : this.player1;
    }
}
exports.DualPlayerGame = DualPlayerGame;
