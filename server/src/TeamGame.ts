import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME } from "./messages";
import { crosswordData, crosswordData2 } from "./crosswordData";

export class TeamGame{
    public gameId: string;
    public teamBlue: WebSocket[];
    public teamRed: WebSocket[];
    public pendingStart: WebSocket[];

    constructor(gameId: string){
       this.gameId = gameId;
       this.pendingStart = [];
       this.teamBlue = [];
       this.teamRed = [];
    }

    addPendingStart(socket: WebSocket){
        
    }

}