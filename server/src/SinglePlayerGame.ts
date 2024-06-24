import { Socket } from 'socket.io';
import { GAME_OVER, INIT_GAME } from './messages';
import { crosswordData, crosswordData2 } from './crosswordData';

export class SinglePlayerGame {
    public player1: Socket;

    constructor(player1: Socket) {
        this.player1 = player1;
        this.player1.emit('message', {
            type: INIT_GAME,
            payload: {
                data: crosswordData
            }
        });
    }
}
