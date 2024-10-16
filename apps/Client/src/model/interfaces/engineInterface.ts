import type { Card, CardColor, Player, UnoFailure } from "global-types";
import type { Ref } from "vue";

export interface EngineInterface {
	joinGame(username: string): Promise<Array<Player>>; // Done
	getPlayerName(index: number): Promise<string | undefined>; // Darko // DONE
	getPlayerScore(index: number): Promise<number | undefined>; // Done
	getPlayerDeck(index: number): Promise<Card[] | undefined>; // Luka - Done (Ljubitelj Alrhusa)
	getCurrentPlayer(): Promise<Player>; // Darko // DONE
	play(cardIndex: number, nextColor?: CardColor): Promise<Card | undefined>; // Luka - Done (3 nutele)
	get getDiscardPileTopCard(): Promise<Ref<Card | undefined, Card | undefined>>; // Darko
	draw(): void; // Luka - Done (ciganka)
	sayUno(index: number): void; // Darko
	catchUnoFailure(unoFailure: UnoFailure): Promise<boolean>; // Luka - Done (samo se zajebavat i prcit)
	getTargetScore(): Promise<number>; // Darko
	subscribeOnEnd(callback: () => void): void; // Luka - Done (sjebano rame)
	unsubscribeOnEnd(callback: () => void): void; // Darko
}
