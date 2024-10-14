import { GameSession } from "../globalTypes";
import { WebSocketHandler } from "../webSocketHandler";
import WebSocket from "ws";
import uuid4 from "uuid4";

export default class GameSessionsHandler {
	type: string = "gameSession";

	// Map to store active game sessions
	private sessions: Map<string, GameSession> = new Map();
	private connections: Map<WebSocket, string> = new Map();

	init() {
		WebSocketHandler.getInstance().subscribeEvent(this.type, "onConnection", ({ ws, webSocketMessage }) => {
			const { username } = webSocketMessage.data;
			this.connections.set(ws, username);
			this.notifyAll();
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "createSession", ({ webSocketMessage, ws }) => {
			const sessionId = uuid4();
			const { maxPlayers, name, hostUsername } = webSocketMessage.data;
			const players = new Set<WebSocket>();
			players.add(ws);
			this.sessions.set(sessionId, {
				id: sessionId,
				name,
				hostUsername,
				maxPlayers,
				players,
			});
			this.notifyAll();

			ws.send(
				JSON.stringify({
					type: "sessionCreated",
					data: { sessionId },
				})
			);
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "joinSession", ({ webSocketMessage, ws }) => {
			const { sessionId } = webSocketMessage.data;
			console.log(webSocketMessage.data);
			const session = this.sessions.get(sessionId);
			if (session && session.players.size < session.maxPlayers) {
				if (!session.players.has(ws)) {
					session.players.add(ws);
					console.log(`[game session]: Player joined session ${sessionId}`);
				}
			}
			this.notifyAll();
			this.notifySessionUsers(sessionId);
		});

		WebSocketHandler.getInstance().subscribeEvent(
			this.type,
			"checkGameSessionPrivileges",
			({ webSocketMessage, ws }) => {
				const { sessionId, username } = webSocketMessage.data;
				const session = this.sessions.get(sessionId);
				if (!session) return;

				const isHost = session.hostUsername === username;
				ws.send(
					JSON.stringify({
						type: "checkGameSessionPrivileges",
						data: {
							isHost,
						},
					})
				);
			}
		);

		WebSocketHandler.getInstance().subscribeEvent(this.type, "getAllPlayersFromSession", ({ webSocketMessage, ws }) => {
			const { sessionId } = webSocketMessage.data;
			this.notifySessionUsers(sessionId);
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "leave", ({ ws, webSocketMessage }) => {
			const { sessionId } = webSocketMessage.data;
			const session = this.sessions.get(sessionId);
			if (!session) return;

			session.players.delete(ws);

			this.notifySessionUsers(sessionId);
			this.notifyAll();
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "cancel", ({ ws, webSocketMessage }) => {
			const { sessionId } = webSocketMessage.data;
			const session = this.sessions.get(sessionId);
			if (!session) return;

			session.players.forEach((player) => {
				if (player !== ws)
					player.send(
						JSON.stringify({
							type: "sessionDeleted",
						})
					);
			});

			this.sessions.delete(sessionId);

			this.notifySessionUsers(sessionId);
			this.notifyAll();
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "onClose", ({ ws }) => {
			this.sessions.forEach((session) => {
				if (session.players.has(ws)) {
					session.players.delete(ws);
				}

				if (session.hostUsername === this.connections.get(ws)) this.sessions.delete(session.id);

				if (session.players.size === 0) {
					console.log(`[game session]: Session ${session.id} has no players, deleting session`);
					this.sessions.delete(session.id);
				}
				this.notifySessionUsers(session.id);
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
				hostUsername: undefined,
			};
		});

		Array.from(this.connections.keys()).forEach((connection) => {
			connection.send(
				JSON.stringify({
					type: "notify",
					data: sessionData,
				})
			);
		});
	}

	notifySessionUsers(sessionId: string) {
		const session = this.sessions.get(sessionId);
		if (!session) return;

		const objectToSend = Array.from(session.players).map((playerWs) => {
			const username = this.connections.get(playerWs);
			return {
				username,
				isHost: username === session.hostUsername,
			};
		});

		session.players.forEach((ws) => {
			ws.send(
				JSON.stringify({
					type: "getAllPlayersFromSession",
					data: objectToSend,
				})
			);
		});
	}
}
