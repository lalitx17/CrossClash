import { Socket } from 'socket.io';
import { GAME_OVER, INIT_GAME, RED, BLUE, STATUS_UPDATE, OPP_SCORE_UPDATE, OWN_SCORE_UPDATE } from './messages';
import { crosswordData, crosswordData2 } from './crosswordData';

// Define a structure for team members
interface TeamMember {
    socket: Socket;
    playerName: string;
}

interface Leader {
    socket: Socket;
    teamName: string;
}

export class TeamGame {
    public gameId: string;
    public teamBlue: TeamMember[];
    public teamRed: TeamMember[];
    public loadGamePressed: Leader[];

    constructor(gameId: string) {
        this.gameId = gameId;
        this.loadGamePressed = [];
        this.teamBlue = [];
        this.teamRed = [];
    }

    public gameStarter(socket: Socket, teamName: string) {
        console.log("GAME STARTER");
        const leader: Leader = { socket, teamName };
        if (this.loadGamePressed.length === 0) {
            this.loadGamePressed.push(leader);
        } else if (this.loadGamePressed.length === 1 && this.loadGamePressed[0].teamName !== teamName) {
            this.loadGamePressed.push(leader);
            this.teamBlue.forEach((member) => {
                member.socket.emit('message', {
                    type: INIT_GAME,
                    payload: {
                        data: crosswordData2,
                    },
                });
            });
            this.teamRed.forEach((member) => {
                member.socket.emit('message', {
                    type: INIT_GAME,
                    payload: {
                        data: crosswordData2,
                    },
                });
            });
        }
    }

    public addMembers(socket: Socket, teamName: string, playerName: string) {
        const member: TeamMember = { socket, playerName };
        if (teamName === RED) {
            this.teamRed.push(member);
        } else if (teamName === BLUE) {
            this.teamBlue.push(member);
        }
        this.broadcastTeamInfo();
        console.log("Team Blue", this.teamBlue);
        console.log("Team Red", this.teamRed);
    }

    public statusUpdater(newPlayer: Socket) {
        newPlayer.emit('message', {
            type: STATUS_UPDATE,
            data: {
                teamRed: this.teamRed.map((member) => member.playerName),
                teamBlue: this.teamBlue.map((member) => member.playerName),
            },
        });
    }

    public scoreUpdate(teamName: string, incrementAmount: string, answer: string, direction: string, number: string, row: string, col: string) {
        if (teamName === RED) {
            this.teamBlue.forEach((member) => {
                member.socket.emit('message', {
                    type: OPP_SCORE_UPDATE,
                    payload: {
                        incrementAmount: incrementAmount,
                    },
                });
            });
            this.teamRed.forEach((member) => {
                member.socket.emit('message', {
                    type: OWN_SCORE_UPDATE,
                    payload: {
                        incrementAmount: incrementAmount,
                        answer: answer,
                        direction: direction,
                        number: number,
                        row: row,
                        col: col,
                    },
                });
            });
        } else if (teamName === BLUE) {
            this.teamBlue.forEach((member) => {
                member.socket.emit('message', {
                    type: OWN_SCORE_UPDATE,
                    payload: {
                        incrementAmount: incrementAmount,
                        answer: answer,
                        direction: direction,
                        number: number,
                        row: row,
                        col: col,
                    },
                });
            });
            this.teamRed.forEach((member) => {
                member.socket.emit('message', {
                    type: OPP_SCORE_UPDATE,
                    payload: {
                        incrementAmount: incrementAmount,
                    },
                });
            });
        }
    }

    public endGame(teamName: string) {
        if (teamName === RED) {
            this.teamBlue.forEach((member) => {
                member.socket.emit('message', {
                    type: GAME_OVER,
                });
            });
        } else if (teamName === BLUE) {
            this.teamRed.forEach((member) => {
                member.socket.emit('message', {
                    type: GAME_OVER,
                });
            });
        }
    }

    public broadcastTeamInfo() {
        this.teamBlue.forEach((member) => {
            member.socket.emit('message', {
                type: STATUS_UPDATE,
                data: {
                    teamRed: this.teamRed.map((member) => member.playerName),
                    teamBlue: this.teamBlue.map((member) => member.playerName),
                },
            });
        });
        this.teamRed.forEach((member) => {
            member.socket.emit('message', {
                type: STATUS_UPDATE,
                data: {
                    teamRed: this.teamRed.map((member) => member.playerName),
                    teamBlue: this.teamBlue.map((member) => member.playerName),
                },
            });
        });
    }
}
