"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SinglePlayerGame = void 0;
const messages_1 = require("./messages");
const crosswordData_1 = require("./crosswordData");
class SinglePlayerGame {
    constructor(player1) {
        this.player1 = player1;
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                data: crosswordData_1.crosswordData
            }
        }));
    }
}
exports.SinglePlayerGame = SinglePlayerGame;
