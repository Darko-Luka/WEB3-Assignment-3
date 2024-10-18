import type { Card, CardColor, Player, UnoFailure } from "global-types";

export interface EngineInterface {
	joinGame(username: string): Promise<Array<Player>>;
	getPlayerName(index: number): Promise<string | undefined>;
	getPlayerScore(index: number): Promise<number | undefined>;
	getPlayerDeck(index: number): Promise<Card[] | undefined>;
	getCurrentPlayer(): Promise<Player>;
	play(cardIndex: number, nextColor?: CardColor): Promise<Card | undefined>;
	getDiscardPileTopCard(): Promise<Card | undefined>;
	draw(): void;
	sayUno(index: number): void;
	catchUnoFailure(unoFailure: UnoFailure): Promise<boolean>;
	getTargetScore(): Promise<number>;
	subscribeOnEnd(callback: () => void): void;
	onGameUpdate: (callback: () => void) => void;
}
