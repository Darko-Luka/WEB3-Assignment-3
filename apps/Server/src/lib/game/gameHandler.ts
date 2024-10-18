import WebSocket from "ws";
import { WebSocketHandler } from "../webSocketHandler";
import { createUnoGame, Game } from "../../model/uno";

export default class GameHandler {
	type: string = "game";

	private static games: Map<string, Map<string, WebSocket | null>> = new Map();
	private unoGames: Map<string, Game> = new Map();

	init() {
		WebSocketHandler.getInstance().subscribeEvent(this.type, "connect", ({ webSocketMessage, ws }) => {
			const { username } = webSocketMessage.data;
			const id = webSocketMessage.id;

			const gameId = this.findGameByUsername(username);
			if (!gameId) return;

			const players = GameHandler.games.get(gameId);
			players?.set(username, ws);

			if (this.checkIfAllPlayersAreConnected(gameId)) {
				const players = this.getAllPlayersFromAGame(gameId) ?? [];
				if (!this.unoGames.has(gameId))
					this.unoGames.set(gameId, createUnoGame({ targetScore: 500, cardsPerPlayer: 7, players }));
				this.broadcastToAllMembersOfTheGame(gameId, {
					type: "gamePlayers",
					id,
					data: players,
				});
			}
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "onClose", ({ ws }) => {
			const username = this.findUsernameByWebSocket(ws);
			if (!username) return;

			const gameId = this.findGameByUsername(username);
			if (!gameId) return;

			GameHandler.games.get(gameId)?.set(username, null);
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "getCurrentPlayer", ({ ws, webSocketMessage }) => {
			const game = this.findGameByWebSocket(ws);
			if (!game) return;

			const id = webSocketMessage.id;

			const playerIndex = game.hand?.playerInTurn() ?? -1;
			const player = { name: game.hand?.player(playerIndex) ?? "", index: playerIndex };

			ws.send(
				JSON.stringify({
					type: "getCurrentPlayer",
					id,
					data: player,
				})
			);
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "getPlayerName", ({ ws, webSocketMessage }) => {
			const game = this.findGameByWebSocket(ws);
			if (!game) return;

			const { index } = webSocketMessage.data;
			const id = webSocketMessage.id;

			ws.send(
				JSON.stringify({
					type: "getPlayerName",
					id,
					data: game.player(index),
				})
			);
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "getPlayerScore", ({ ws, webSocketMessage }) => {
			const game = this.findGameByWebSocket(ws);
			if (!game) return;

			const { index } = webSocketMessage.data;
			const id = webSocketMessage.id;

			ws.send(
				JSON.stringify({
					type: "getPlayerScore",
					id,
					data: game.score(index),
				})
			);
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "getPlayerDeck", ({ ws, webSocketMessage }) => {
			const game = this.findGameByWebSocket(ws);
			if (!game) return;

			const { index } = webSocketMessage.data;
			const id = webSocketMessage.id;

			ws.send(
				JSON.stringify({
					type: "getPlayerDeck",
					id,
					data: [...(game.hand?.playerHand(index) ?? [])],
				})
			);
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "play", ({ ws, webSocketMessage }) => {
			const game = this.findGameByWebSocket(ws);
			if (!game) return;

			const { cardIndex, nextColor } = webSocketMessage.data;
			const id = webSocketMessage.id;

			ws.send(
				JSON.stringify({
					type: "play",
					id,
					data: game.hand?.play(cardIndex, nextColor),
				})
			);

			this.broadcastToAllMembersOfTheGame(this.findGameByUsername(this.findUsernameByWebSocket(ws) ?? "") ?? "", {
				type: "gameUpdate",
			});
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "getDiscardPileTopCard", ({ ws, webSocketMessage }) => {
			const game = this.findGameByWebSocket(ws);
			if (!game) return;

			const id = webSocketMessage.id;

			ws.send(
				JSON.stringify({
					type: "getDiscardPileTopCard",
					id,
					data: game.hand?.discardPile().top(),
				})
			);
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "draw", ({ ws, webSocketMessage }) => {
			const game = this.findGameByWebSocket(ws);
			if (!game) return;

			const id = webSocketMessage.id;

			ws.send(
				JSON.stringify({
					type: "draw",
					id,
					data: game.hand?.draw(),
				})
			);

			this.broadcastToAllMembersOfTheGame(this.findGameByUsername(this.findUsernameByWebSocket(ws) ?? "") ?? "", {
				type: "gameUpdate",
			});
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "sayUno", ({ ws, webSocketMessage }) => {
			const game = this.findGameByWebSocket(ws);
			if (!game) return;

			const { index } = webSocketMessage.data;

			game.hand?.sayUno(index);
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "catchUnoFailure", ({ ws, webSocketMessage }) => {
			const game = this.findGameByWebSocket(ws);
			if (!game) return;

			const { unoFailure } = webSocketMessage.data;
			const id = webSocketMessage.id;

			ws.send(
				JSON.stringify({
					type: "unoFailure",
					id,
					data: game.hand?.catchUnoFailure(unoFailure) ?? false,
				})
			);
		});

		WebSocketHandler.getInstance().subscribeEvent(this.type, "getTargetScore", ({ ws, webSocketMessage }) => {
			const game = this.findGameByWebSocket(ws);
			if (!game) return;

			const id = webSocketMessage.id;

			ws.send(
				JSON.stringify({
					type: "getTargetScore",
					id,
					data: game.targetScore,
				})
			);
		});
	}

	private broadcastToAllMembersOfTheGame(gameId: string, data: any): void {
		const gameMap = GameHandler.games.get(gameId);

		if (!gameMap) return;

		for (const ws of gameMap.values()) {
			if (ws) ws.send(JSON.stringify(data));
		}
	}

	private checkIfAllPlayersAreConnected(gameId: string): boolean {
		const gameMap = GameHandler.games.get(gameId);

		if (!gameMap) return false;

		for (const ws of gameMap.values()) {
			if (ws === null) {
				return false;
			}
		}

		return true;
	}

	private getAllPlayersFromAGame(gameId: string): string[] | null {
		const gameMap = GameHandler.games.get(gameId);

		if (!gameMap) return null;

		return Array.from(gameMap.keys());
	}

	private findUsernameByWebSocket(socket: WebSocket): string | null {
		for (const playersMap of GameHandler.games.values()) {
			for (const [username, playerSocket] of playersMap.entries()) {
				if (playerSocket === socket) {
					return username;
				}
			}
		}
		return null;
	}

	private findGameByUsername(username: string): string | null {
		for (const [gameId, playersMap] of GameHandler.games.entries()) {
			if (playersMap.has(username)) {
				return gameId;
			}
		}
		return null;
	}

	private findGameByWebSocket(webSocket: WebSocket): Game | null {
		const username = this.findUsernameByWebSocket(webSocket);
		if (!username) return null;

		const gameId = this.findGameByUsername(username);
		if (!gameId) return null;

		const game = this.unoGames.get(gameId);
		if (!game) return null;

		return game;
	}

	static addGame(sessionId: string, webSockets: Map<string, null>) {
		this.games.set(sessionId, webSockets);
	}

	static gamesToString(): string {
		let result = "{\n";
		this.games.forEach((playersMap, gameId) => {
			result += `  ${gameId}: {\n`;
			playersMap.forEach((socket, username) => {
				result += `    ${username}: ${socket ? "[WebSocket object]" : "null"},\n`;
			});
			result += "  },\n";
		});
		result += "}";
		return result;
	}
}
