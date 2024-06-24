import { Socket } from 'socket.io';
import {
  DUAL_PLAYER,
  INIT_GAME,
  SINGLE_PLAYER,
  GAME_COMPLETED,
  SCORE_UPDATE,
  TEAM_GAME,
  PLAYER_JOINED,
  NEW_PLAYER,
} from './messages';
import { DualPlayerGame } from './DualPlayerGame';
import { SinglePlayerGame } from './SinglePlayerGame';
import { TeamGame } from './TeamGame';

export class GameManager {
  private dualPlayerGames: DualPlayerGame[];
  private singlePlayerGames: SinglePlayerGame[];
  private teamGames: TeamGame[];

  private pendingUser: Socket | null;
  private users: Socket[];

  constructor() {
    this.dualPlayerGames = [];
    this.pendingUser = null;
    this.users = [];
    this.singlePlayerGames = [];
    this.teamGames = [];
  }

  addUser(socket: Socket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: Socket) {
    this.users = this.users.filter((user) => user !== socket);
  }

  private addHandler(socket: Socket) {
    socket.on('message', (data: any) => {
      const message = typeof data === 'string' ? JSON.parse(data) : data;

      if (message.mode === SINGLE_PLAYER) {
        if (message.type === INIT_GAME) {
          const singlePlayerGame = new SinglePlayerGame(socket);
          this.singlePlayerGames.push(singlePlayerGame);
          console.log('Game Started');
        }
      } else if (message.mode === DUAL_PLAYER) {
        if (message.type === INIT_GAME) {
          if (this.pendingUser && socket !== this.pendingUser) {
            const dualPlayerGame = new DualPlayerGame(this.pendingUser, socket);
            this.dualPlayerGames.push(dualPlayerGame);
            this.pendingUser = null;
            console.log('Game started');
          } else {
            this.pendingUser = socket;
            console.log('Waiting for another player');
          }
        } else if (message.type === GAME_COMPLETED) {
          const game = this.findGameBySocket(socket);
          if (game) {
            game.endGame(socket);
          }
        } else if (message.type === SCORE_UPDATE) {
          const game = this.findGameBySocket(socket);
          if (game) {
            game.scoreUpdate(socket, message.incrementAmount);
          }
        }
      } else if (message.mode === TEAM_GAME) {
        if (message.type === INIT_GAME) {
          const game = this.findTeamGame(message.data.gameId);
          if (game) {
            game.gameStarter(socket, message.data.teamName);
          }
        } else if (message.type === PLAYER_JOINED) {
          const game = this.findTeamGame(message.data.gameId);
          if (game) {
            game.addMembers(socket, message.data.teamName, message.data.playerName);
          } else {
            const newGame = new TeamGame(message.data.gameId);
            newGame.addMembers(socket, message.data.teamName, message.data.playerName);
            this.teamGames.push(newGame);
          }
        } else if (message.type === NEW_PLAYER) {
          const game = this.findTeamGame(message.data.gameId);
          if (game) {
            game.statusUpdater(socket);
          }
        } else if (message.type === SCORE_UPDATE) {
          const game = this.findTeamGame(message.payload.gameId);
          if (game) {
            game.scoreUpdate(
              message.payload.teamName,
              message.payload.incrementAmount,
              message.payload.answer,
              message.payload.direction,
              message.payload.number,
              message.payload.row,
              message.payload.col
            );
          }
        } else if (message.type === GAME_COMPLETED) {
          const game = this.findTeamGame(message.payload.gameId);
          if (game) {
            game.endGame(message.payload.teamName);
          }
        }
      }
    });
  }

  private findGameBySocket(socket: Socket): DualPlayerGame | undefined {
    return this.dualPlayerGames.find(
      (game) => game.player1 === socket || game.player2 === socket
    );
  }

  private findTeamGame(gameId: string): TeamGame | undefined {
    return this.teamGames.find((game) => game.gameId === gameId);
  }
}
