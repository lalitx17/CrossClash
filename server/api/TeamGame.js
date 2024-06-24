"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamGame = void 0;
const messages_1 = require("./messages");
const crosswordData_1 = require("./crosswordData");
class TeamGame {
    constructor(gameId) {
        this.gameId = gameId;
        this.loadGamePressed = [];
        this.teamBlue = [];
        this.teamRed = [];
    }
    gameStarter(socket, teamName) {
        console.log("GAME STARTER");
        const leader = { socket, teamName };
        if (this.loadGamePressed.length === 0) {
            this.loadGamePressed.push(leader);
        }
        else if (this.loadGamePressed.length === 1 && this.loadGamePressed[0].teamName !== teamName) {
            this.loadGamePressed.push(leader);
            this.teamBlue.forEach((member) => {
                member.socket.send(JSON.stringify({
                    type: messages_1.INIT_GAME,
                    payload: {
                        data: crosswordData_1.crosswordData2,
                    },
                }));
            });
            this.teamRed.forEach((member) => {
                member.socket.send(JSON.stringify({
                    type: messages_1.INIT_GAME,
                    payload: {
                        data: crosswordData_1.crosswordData2,
                    },
                }));
            });
        }
    }
    addMembers(socket, teamName, playerName) {
        const member = { socket, playerName };
        if (teamName === messages_1.RED) {
            this.teamRed.push(member);
        }
        else if (teamName === messages_1.BLUE) {
            this.teamBlue.push(member);
        }
        this.broadcastTeamInfo();
    }
    statusUpdater(newPlayer) {
        newPlayer.send(JSON.stringify({
            type: messages_1.STATUS_UPDATE,
            data: {
                teamRed: this.teamRed.map((member) => member.playerName),
                teamBlue: this.teamBlue.map((member) => member.playerName),
            },
        }));
    }
    scoreUpdate(teamName, incrementAmount, answer, direction, number, row, col) {
        if (teamName === messages_1.RED) {
            this.teamBlue.forEach((member) => {
                member.socket.send(JSON.stringify({
                    type: messages_1.OPP_SCORE_UPDATE,
                    payload: {
                        incrementAmount: incrementAmount,
                    },
                }));
            });
            this.teamRed.forEach((member) => {
                member.socket.send(JSON.stringify({
                    type: messages_1.OWN_SCORE_UPDATE,
                    payload: {
                        incrementAmount: incrementAmount,
                        answer: answer,
                        direction: direction,
                        number: number,
                        row: row,
                        col: col,
                    },
                }));
            });
        }
        else if (teamName === messages_1.BLUE) {
            this.teamBlue.forEach((member) => {
                member.socket.send(JSON.stringify({
                    type: messages_1.OWN_SCORE_UPDATE,
                    payload: {
                        incrementAmount: incrementAmount,
                        answer: answer,
                        direction: direction,
                        number: number,
                        row: row,
                        col: col,
                    },
                }));
            });
            this.teamRed.forEach((member) => {
                member.socket.send(JSON.stringify({
                    type: messages_1.OPP_SCORE_UPDATE,
                    payload: {
                        incrementAmount: incrementAmount,
                    },
                }));
            });
        }
    }
    endGame(teamName) {
        if (teamName === messages_1.RED) {
            this.teamBlue.forEach((member) => {
                member.socket.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                }));
            });
        }
        else if (teamName === messages_1.BLUE) {
            this.teamRed.forEach((member) => {
                member.socket.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                }));
            });
        }
    }
    broadcastTeamInfo() {
        this.teamBlue.forEach((member) => {
            member.socket.send(JSON.stringify({
                type: messages_1.STATUS_UPDATE,
                data: {
                    teamRed: this.teamRed.map((member) => member.playerName),
                    teamBlue: this.teamBlue.map((member) => member.playerName),
                },
            }));
        });
        this.teamRed.forEach((member) => {
            member.socket.send(JSON.stringify({
                type: messages_1.STATUS_UPDATE,
                data: {
                    teamRed: this.teamRed.map((member) => member.playerName),
                    teamBlue: this.teamBlue.map((member) => member.playerName),
                },
            }));
        });
    }
}
exports.TeamGame = TeamGame;
