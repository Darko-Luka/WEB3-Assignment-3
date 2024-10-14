import type { Ref } from "vue";
import type { EngineInterface } from "./interfaces/engineInterface";
import type { Card, CardColor, Player, UnoFailure } from "global-types";

export class EngineService implements EngineInterface {
	play(cardIndex: number, nextColor?: CardColor): Card | undefined {
		throw new Error("Method not implemented.");
	}
	get getDiscardPileTopCard(): Ref<Card | undefined, Card | undefined> {
		throw new Error("Method not implemented.");
	}
	draw(): void {
		throw new Error("Method not implemented.");
	}
	sayUno(index: number): void {
		throw new Error("Method not implemented.");
	}
	catchUnoFailure(unoFailure: UnoFailure): boolean {
		throw new Error("Method not implemented.");
	}
	getTargetScore(): number {
		throw new Error("Method not implemented.");
	}
	createGame(): Array<Player> {
		throw new Error("Method not implemented.");
	}
	getPlayerName(index: number): string | undefined {
		throw new Error("Method not implemented.");
	}
	getPlayerScore(index: number): number | undefined {
		throw new Error("Method not implemented.");
	}
	getPlayerDeck(index: number): Card[] | undefined {
		throw new Error("Method not implemented.");
	}
	getCurrentPlayer(): Player {
		throw new Error("Method not implemented.");
	}
	subscribeOnEnd(callback: () => void): void {
		throw new Error("Method not implemented.");
	}
	unsubscribeOnEnd(callback: () => void): void {
		throw new Error("Method not implemented.");
	}
}
