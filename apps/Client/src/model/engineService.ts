import uuid4 from "uuid4";
import type { EngineInterface } from "./interfaces/engineInterface";
import type { Card, CardColor, Player, UnoFailure } from "global-types";

export class EngineService implements EngineInterface {
	ws: WebSocket | null = null;
	isConnected: boolean = false;
	onMessage: Array<(data: any) => void> = [];
	onGameUpdateCB?: () => void;

	async joinGame(username: string): Promise<Array<Player>> {
		return new Promise((resolve) => {
			this.ws = new WebSocket("ws://localhost:3001?serverType=game&token=" + localStorage.getItem("token"));

			const messageId = uuid4();

			this.ws.onopen = () => {
				this.isConnected = true;
				this.sendMessage({ type: "connect", id: messageId, data: { username } });
			};

			this.ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				this.onMessage.forEach((callback) => callback(data));
			};

			this.subscribeOnMessage((event) => {
				if (event.type !== "gameUpdate") return;

				if (this.onGameUpdateCB) this.onGameUpdateCB();
			});

			const onMessage = (event: any) => {
				if (event.type !== "gamePlayers" || event.id !== messageId) return;

				const players: string[] = event.data;

				resolve(
					players.map((player, index) => {
						return { name: player, index };
					})
				);
				this.unsubscribeOnMessage(onMessage);
			};

			this.subscribeOnMessage(onMessage);
		});
	}

	async getPlayerName(index: number): Promise<string | undefined> {
		return new Promise((resolve) => {
			const messageId = uuid4();
			this.sendMessage({ type: "getPlayerName", id: messageId, data: { index } });

			const onMessage = (event: any) => {
				if (event.type !== "getPlayerName" || event.id !== messageId) return;

				resolve(event.data);
				this.unsubscribeOnMessage(onMessage);
			};

			this.subscribeOnMessage(onMessage);
		});
	}

	async getPlayerScore(index: number): Promise<number | undefined> {
		return new Promise((resolve) => {
			const messageId = uuid4();

			this.sendMessage({ type: "getPlayerScore", id: messageId, data: { index } });

			const onMessage = (event: any) => {
				if (event.type !== "getPlayerScore" || event.id !== messageId) return;
				resolve(event.data);
				this.unsubscribeOnMessage(onMessage);
			};
			this.subscribeOnMessage(onMessage);
		});
	}

	async getPlayerDeck(index: number): Promise<Card[] | undefined> {
		return new Promise((resolve) => {
			const messageId = uuid4();

			this.sendMessage({ type: "getPlayerDeck", id: messageId, data: { index } });

			const onMessage = (event: any) => {
				if (event.type !== "getPlayerDeck" || event.id !== messageId) return;

				resolve(event.data);
				this.unsubscribeOnMessage(onMessage);
			};

			this.subscribeOnMessage(onMessage);
		});
	}

	async getCurrentPlayer(): Promise<Player> {
		return new Promise((resolve) => {
			const messageId = uuid4();
			this.sendMessage({ type: "getCurrentPlayer", id: messageId });

			const onMessage = (event: any) => {
				if (event.type !== "getCurrentPlayer" || event.id !== messageId) return;

				resolve(event.data);
				this.unsubscribeOnMessage(onMessage);
			};

			this.subscribeOnMessage(onMessage);
		});
	}

	async play(cardIndex: number, nextColor?: CardColor): Promise<Card | undefined> {
		return new Promise((resolve) => {
			const messageId = uuid4();

			this.sendMessage({ type: "play", id: messageId, data: { cardIndex, nextColor } });

			const onMessage = (event: any) => {
				if (event.type !== "play" || event.id !== messageId) return;

				resolve(event.data);
				this.unsubscribeOnMessage(onMessage);
			};

			this.subscribeOnMessage(onMessage);
		});
	}
	async getDiscardPileTopCard(): Promise<Card | undefined> {
		return new Promise((resolve) => {
			const messageId = uuid4();

			this.sendMessage({ type: "getDiscardPileTopCard", id: messageId });

			const onMessage = (event: any) => {
				if (event.type !== "getDiscardPileTopCard" || event.id !== messageId) return;

				resolve(event.data);
				this.unsubscribeOnMessage(onMessage);
			};
			this.subscribeOnMessage(onMessage);
		});
	}

	draw(): void {
		const messageId = uuid4();
		this.sendMessage({ type: "draw", id: messageId });

		const onMessage = (event: any) => {
			if (event.type !== "draw" || event.id !== messageId) return;
			this.unsubscribeOnMessage(onMessage);
		};

		this.subscribeOnMessage(onMessage);
	}

	sayUno(index: number): void {
		this.sendMessage({ type: "sayUno", data: { index } });
	}

	async catchUnoFailure(unoFailure: UnoFailure): Promise<boolean> {
		return new Promise((resolve) => {
			const messageId = uuid4();
			this.sendMessage({ type: "catchUnoFailure", id: messageId, data: { unoFailure } });

			const onMessage = (event: any) => {
				if (event.type !== "catchUnoFailure" || event.id !== messageId) return;

				resolve(event.data);
				this.unsubscribeOnMessage(onMessage);
			};

			this.subscribeOnMessage(onMessage);
		});
	}

	async getTargetScore(): Promise<number> {
		return new Promise((resolve) => {
			const messageId = uuid4();
			this.sendMessage({ type: "getTargetScore", id: messageId });

			const onMessage = (event: any) => {
				if (event.type !== "getTargetScore" || event.id !== messageId) return;

				resolve(event.data);
				this.unsubscribeOnMessage(onMessage);
			};

			this.subscribeOnMessage(onMessage);
		});
	}

	subscribeOnEnd(callback: () => void): void {
		this.subscribeOnMessage((event) => {
			if (event.type !== "subscribeOnEnd") {
				callback();
			}
		});
	}

	unsubscribeOnEnd(callback: () => void): void {
		throw new Error("Method not implemented.");
	}

	onGameUpdate(callback: () => void): void {
		this.onGameUpdateCB = callback;
	}

	private subscribeOnMessage(callback: (data: any) => void) {
		this.onMessage.push(callback);
	}

	private unsubscribeOnMessage(callback: (data: any) => void) {
		this.onMessage = this.onMessage.filter((sub) => sub !== callback);
	}

	private sendMessage(object: any) {
		if (this.isConnected) this.ws?.send(JSON.stringify(object));
	}
}
