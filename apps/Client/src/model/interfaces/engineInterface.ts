import type { Card, CardColor, Player, UnoFailure } from "global-types";
import type { Ref } from "vue";

export interface EngineInterface {
	createGame(): Array<Player>;
	getPlayerName(index: number): string | undefined;
	getPlayerScore(index: number): number | undefined;
	getPlayerDeck(index: number): Card[] | undefined;
	getCurrentPlayer(): Player;
	play(cardIndex: number, nextColor?: CardColor): Card | undefined;
	get getDiscardPileTopCard(): Ref<Card | undefined, Card | undefined>;
	draw(): void;
	sayUno(index: number): void;
	catchUnoFailure(unoFailure: UnoFailure): boolean;
	getTargetScore(): number;
	subscribeOnEnd(callback: () => void): void;
	unsubscribeOnEnd(callback: () => void): void;
}
