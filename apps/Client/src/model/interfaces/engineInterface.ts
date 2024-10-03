import type { Card, CardColor, Deck } from "@/model/deck";
import type { UnoFailure } from "@/model/hand";
import type { Ref } from "vue";

export type Player = {
	index: number;
	name: string;
};

export interface EngineInterface {
	createGame(bots: ("easy" | "medium" | "hard")[]): Array<Player>;
	getPlayerName(index: number): string | undefined;
	getPlayerScore(index: number): number | undefined;
	getPlayerDeck(index: number): Card[] | undefined;
	getCurrentPlayer(): Player;
	play(cardIndex: number, nextColor?: CardColor): Card | undefined;
	decideMove(): void;
	get getDiscardPileTopCard(): Ref<Card | undefined, Card | undefined>;
	draw(): void;
	sayUno(index: number): void;
	catchUnoFailure(unoFailure: UnoFailure): boolean;
	getTargetScore(): number;
}
