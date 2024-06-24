"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const DualPlayerGame_1 = require("./DualPlayerGame");
const SinglePlayerGame_1 = require("./SinglePlayerGame");
const TeamGame_1 = require("./TeamGame");
class GameManager {
    constructor() {
        this.dualPlayerGames = [];
        this.pendingUser = null;
        this.users = [];
        this.singlePlayerGames = [];
        this.teamGames = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter((user) => user !== socket);
    }
    addHandler(socket) {
        socket.on('message', (data) => {
            const message = typeof data === 'string' ? JSON.parse(data) : data;
            if (message.mode === messages_1.SINGLE_PLAYER) {
                if (message.type === messages_1.INIT_GAME) {
                    const singlePlayerGame = new SinglePlayerGame_1.SinglePlayerGame(socket);
                    this.singlePlayerGames.push(singlePlayerGame);
                    console.log('Game Started');
                }
            }
            else if (message.mode === messages_1.DUAL_PLAYER) {
                if (message.type === messages_1.INIT_GAME) {
                    if (this.pendingUser && socket !== this.pendingUser) {
                        const dualPlayerGame = new DualPlayerGame_1.DualPlayerGame(this.pendingUser, socket);
                        this.dualPlayerGames.push(dualPlayerGame);
                        this.pendingUser = null;
                        console.log('Game started');
                    }
                    else {
                        this.pendingUser = socket;
                        console.log('Waiting for another player');
                    }
                }
                else if (message.type === messages_1.GAME_COMPLETED) {
                    const game = this.findGameBySocket(socket);
                    if (game) {
                        game.endGame(socket);
                    }
                }
                else if (message.type === messages_1.SCORE_UPDATE) {
                    const game = this.findGameBySocket(socket);
                    if (game) {
                        game.scoreUpdate(socket, message.incrementAmount);
                    }
                }
            }
            else if (message.mode === messages_1.TEAM_GAME) {
                if (message.type === messages_1.INIT_GAME) {
                    const game = this.findTeamGame(message.data.gameId);
                    if (game) {
                        game.gameStarter(socket, message.data.teamName);
                    }
                }
                else if (message.type === messages_1.PLAYER_JOINED) {
                    const game = this.findTeamGame(message.data.gameId);
                    if (game) {
                        game.addMembers(socket, message.data.teamName, message.data.playerName);
                    }
                    else {
                        const newGame = new TeamGame_1.TeamGame(message.data.gameId);
                        newGame.addMembers(socket, message.data.teamName, message.data.playerName);
                        this.teamGames.push(newGame);
                    }
                }
                else if (message.type === messages_1.NEW_PLAYER) {
                    const game = this.findTeamGame(message.data.gameId);
                    if (game) {
                        game.statusUpdater(socket);
                    }
                }
                else if (message.type === messages_1.SCORE_UPDATE) {
                    const game = this.findTeamGame(message.payload.gameId);
                    if (game) {
                        game.scoreUpdate(message.payload.teamName, message.payload.incrementAmount, message.payload.answer, message.payload.direction, message.payload.number, message.payload.row, message.payload.col);
                    }
                }
                else if (message.type === messages_1.GAME_COMPLETED) {
                    const game = this.findTeamGame(message.payload.gameId);
                    if (game) {
                        game.endGame(message.payload.teamName);
                    }
                }
            }
        });
    }
    findGameBySocket(socket) {
        return this.dualPlayerGames.find((game) => game.player1 === socket || game.player2 === socket);
    }
    findTeamGame(gameId) {
        return this.teamGames.find((game) => game.gameId === gameId);
    }
}
exports.GameManager = GameManager;
