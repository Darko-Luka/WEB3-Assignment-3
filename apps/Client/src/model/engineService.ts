import { type Ref } from "vue";
import type { EngineInterface } from "./interfaces/engineInterface";
import type { Card, CardColor, Player, UnoFailure } from "global-types";
import { resolve } from "node:path";

export class EngineService implements EngineInterface {
	ws: WebSocket | null = null;
	isConnected: boolean = false;
	onMessage: Array<(data: any) => void> = [];

	async joinGame(username: string): Promise<Array<Player>> {
		return new Promise((resolve) => {
			this.ws = new WebSocket("ws://localhost:3001?serverType=game&token=" + localStorage.getItem("token"));

			this.ws.onopen = () => {
				this.isConnected = true;
				this.sendMessage({ type: "connect", data: { username } });
			};

			this.ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				this.onMessage.forEach((callback) => callback(data));
			};

			this.subscribeOnMessage((event) => {
				if (event.type !== "gamePlayers") return;
				resolve(event.data);
			});
		});
	}

	async getPlayerName(index: number): Promise<string | undefined> {
		throw new Error("Method not implemented.");
	}

	async getPlayerScore(index: number): Promise<number | undefined> {
		return new Promise((resolve) => {
			this.sendMessage({ type: "getPlayerScore", data: { index } });

			this.subscribeOnMessage((event) => {
				if (event.type !== "getPlayerScore") return;

				resolve(event.data);
			});
		});
	}

	async getPlayerDeck(index: number): Promise<Card[] | undefined> {
		return new Promise((resolve) => {
			this.sendMessage({ type: "getPlayerDeck", data: { index } });

			this.subscribeOnMessage((event) => {
				if (event.type !== "getPlayerDeck") return;

				resolve(event.data);
			});
		});
	}

	async getCurrentPlayer(): Promise<Player> {
		throw new Error("Method not implemented.");
	}
	async play(cardIndex: number, nextColor?: CardColor): Promise<Card | undefined> {
		throw new Error("Method not implemented.");
	}
	get getDiscardPileTopCard(): Promise<Ref<Card | undefined, Card | undefined>> {
		throw new Error("Method not implemented.");
	}
	draw(): void {
		throw new Error("Method not implemented.");
	}
	sayUno(index: number): void {
		throw new Error("Method not implemented.");
	}
	async catchUnoFailure(unoFailure: UnoFailure): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	async getTargetScore(): Promise<number> {
		throw new Error("Method not implemented.");
	}
	subscribeOnEnd(callback: () => void): void {
		throw new Error("Method not implemented.");
	}
	unsubscribeOnEnd(callback: () => void): void {
		throw new Error("Method not implemented.");
	}

	private subscribeOnMessage(callback: (data: any) => void) {
		this.onMessage.push(callback);
	}

	private unsubscribeOnMessage(callback: (data: any) => void) {
		this.onMessage = this.onMessage.filter((sub) => sub !== callback);
	}

	private sendMessage(object: any) {
		this.ws?.send(JSON.stringify(object));
	}
}
