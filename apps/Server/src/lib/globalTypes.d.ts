import "./socketMessageTypes";
import { Request } from "express";
import WebSocket from "ws";

export interface AuthenticatedRequest extends Request {
	authData?: AuthData;
}

export type GameSession = {
	id: string;
	name: string;
	players: Set<WebSocket>;
	maxPlayers: number;
};
