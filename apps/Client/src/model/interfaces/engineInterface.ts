import type { Card, CardColor, Player, UnoFailure } from "global-types";
import type { Ref } from "vue";

export interface EngineInterface {
	joinGame(username: string): Promise<Array<Player>>; // Done
	getPlayerName(index: number): Promise<string | undefined>; // Darko // DONE
	getPlayerScore(index: number): Promise<number | undefined>; // Done
	getPlayerDeck(index: number): Promise<Card[] | undefined>; // Luka
	getCurrentPlayer(): Promise<Player>; // Darko
	play(cardIndex: number, nextColor?: CardColor): Promise<Card | undefined>; // Luka
	get getDiscardPileTopCard(): Promise<Ref<Card | undefined, Card | undefined>>; // Darko
	draw(): void; // Luka
	sayUno(index: number): void; // Darko
	catchUnoFailure(unoFailure: UnoFailure): Promise<boolean>; // Luka
	getTargetScore(): Promise<number>; // Darko
	subscribeOnEnd(callback: () => void): void; // Luka
	unsubscribeOnEnd(callback: () => void): void; // Darko
}
