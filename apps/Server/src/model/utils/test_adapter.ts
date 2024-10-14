import { type Shuffler, standardShuffler } from "./random_utils";
import * as deck from "../deck";
import * as hand from "../hand";
import * as uno from "../uno";
import { Card } from "global-types";

export function createInitialDeck(): deck.Deck {
	return deck.createInitialDeck();
}

export type HandProps = {
	players: string[];
	dealer: number;
	shuffler?: Shuffler<Card>;
	cardsPerPlayer?: number;
};

export function createHand({ players, dealer, shuffler = standardShuffler, cardsPerPlayer = 7 }: HandProps): hand.Hand {
	return hand.createHand(players, dealer, shuffler, cardsPerPlayer);
}

export function createGame(props: Partial<uno.Props>): uno.Game {
	return uno.createUnoGame(props);
}
