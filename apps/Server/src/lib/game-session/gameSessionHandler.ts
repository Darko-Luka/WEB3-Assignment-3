import { GameSession } from "../globalTypes";
import { WebSocketHandler } from "../webSocketHandler";
import WebSocket from "ws";
import uuid4 from "uuid4";

export default class GameSessionsHandler {
	type: string = "gameSession";

	// Map to store active game sessions
	private sessions: Map<string, GameSession> = new Map();
	private connections: Set<WebSocket> = new Set();

	init() {
		// On connect
		WebSocketHandler.getInstance().subscribeEvent(this.type, "onConnection", ({ ws }) => {
			this.connections.add(ws);
			this.notifyAll();
		});

		// Create
		WebSocketHandler.getInstance().subscribeEvent(this.type, "createSession", ({ webSocketMessage, ws }) => {
			const sessionId = uuid4();
			const { maxPlayers, name } = webSocketMessage.data;
			const players = new Set<WebSocket>();
			players.add(ws);
			this.sessions.set(sessionId, {
				id: sessionId,
				name,
				maxPlayers,
				players,
			});
			this.notifyAll();
		});

		// Join
		WebSocketHandler.getInstance().subscribeEvent(this.type, "joinSession", ({ webSocketMessage, ws }) => {
			const { sessionId } = webSocketMessage.data;
			console.log(webSocketMessage.data);
			const session = this.sessions.get(sessionId);
			if (session && session.players.size < session.maxPlayers) {
				session.players.add(ws);
				console.log(`[game session]: Player joined session ${sessionId}`);
			}
			this.notifyAll();
		});

		// OnClose
		WebSocketHandler.getInstance().subscribeEvent(this.type, "onClose", ({ webSocketMessage, ws }) => {
			this.sessions.forEach((session) => {
				if (session.players.has(ws)) {
					session.players.delete(ws);
				}

				if (session.players.size === 0) {
					console.log(`[game session]: Session ${session.id} has no players, deleting session`);
					this.sessions.delete(session.id);
				}
			});

			this.connections.delete(ws);
			this.notifyAll();
		});
	}

	notifyAll() {
		const sessionData = Array.from(this.sessions.values()).map((session) => {
			return {
				...session,
				players: session.players.size,
			};
		});

		this.connections.forEach((connection) => {
			connection.send(
				JSON.stringify({
					type: "notify",
					data: sessionData,
				})
			);
		});
	}
}
