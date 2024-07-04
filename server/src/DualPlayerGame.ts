import { Socket } from 'socket.io';
import { GAME_OVER, INIT_GAME, GAME_COMPLETED, SCORE_UPDATE } from './messages';
import { crosswordData, crosswordData2 } from './crosswordData';

export class DualPlayerGame {
    public player1: Socket;
    public player2: Socket;

    constructor(player1: Socket, player2: Socket) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1.emit('message', {
            type: INIT_GAME,
            payload: {
                data: crosswordData
            }
        });
        this.player2.emit('message', {
            type: INIT_GAME,
            payload: {
                data: crosswordData
            }
        });
    }

    public endGame(endingPlayer: Socket) {
        const opponent = this.opponentFinder(endingPlayer);

        if (opponent) {
            opponent.emit('message', {
                type: GAME_COMPLETED
            });
        }
    }

    public scoreUpdate(scoringPlayer: Socket, incrementAmount: string) {
        const opponent = this.opponentFinder(scoringPlayer);
        if (opponent) {
            opponent.emit('message', {
                type: SCORE_UPDATE,
                increment: incrementAmount
            });
        }
    }

    private opponentFinder(player: Socket): Socket | undefined {
        return (player === this.player1) ? this.player2 : this.player1;
    }
}
