import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, RED, BLUE, STATUS_UPDATE } from "./messages";
import { crosswordData, crosswordData2 } from "./crosswordData";

// Define a structure for team members
interface TeamMember {
    socket: WebSocket;
    playerName: string;
}

interface Leader {
    socket: WebSocket;
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

    public gameStarter(socket: WebSocket, teamName: string) {
        const leader: Leader = {socket, teamName};
        if (this.loadGamePressed.length === 0) {
            this.loadGamePressed.push(leader);
        } else if (this.loadGamePressed.length === 1) {
            this.loadGamePressed.push(leader);
            this.teamBlue.forEach(member => {
                member.socket.send(JSON.stringify({
                    type: INIT_GAME,
                    data: crosswordData
                }));
            });
            this.teamRed.forEach(member => {
                member.socket.send(JSON.stringify({
                    type: INIT_GAME,
                    data: crosswordData2
                }));
            });
        }
    }

    public addMembers(socket: WebSocket, teamName: string, playerName: string) {
        const member: TeamMember = { socket, playerName };
        if (teamName === RED) {
            this.teamRed.push(member);
        } else if (teamName === BLUE) {
            this.teamBlue.push(member);
        }
    }

    public statusUpdater(newPlayer: WebSocket){
        newPlayer.send(JSON.stringify({
            type: STATUS_UPDATE, 
            data: {
                teamRed: this.teamRed.map(member => member.playerName),
                teamBlue: this.teamBlue.map(member => member.playerName)
            }
        }))
    }
}
