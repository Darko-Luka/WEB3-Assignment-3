import { ref, type Ref } from "vue";
import { decideMove } from "./botAI";
import type { Deck, CardColor, Card } from "./deck";
import type { UnoFailure } from "./hand";
import type { EngineInterface, Player } from "./interfaces/engineInterface";
import { createUnoGame, type Game } from "./uno";

export class EngineService implements EngineInterface {
	game: Game = createUnoGame({ players: ["a", "b"] });
	discardPileTopCardRef = ref<Card | undefined>();
	bots: ("easy" | "medium" | "hard")[] = [];
	public onEnd: () => void = () => {};

	createGame(bots: ("easy" | "medium" | "hard")[]): Array<Player> {
		const players = Array.from({ length: bots.length + 1 }, (_, index) => {
			if (index === 0) return "player";
			return `bot ${index}`;
		});
		this.bots = bots;

		this.game = createUnoGame({ players, targetScore: 500, cardsPerPlayer: 7 });

		this.game.onGameEnd = (winner: number) => {
			Array.from({ length: this.game.hand?.playerCount ?? 0 }).forEach((_, index) => {
				if (this.game.score(index) >= this.game.targetScore) {
					alert(`${this.game.player(index)} has won the game!`);
					this.onEnd();
					return;
				}
			});

			alert(`Round has ended, winner is ${this.game.player(winner)}!`);
		};

		this.discardPileTopCardRef.value = this.game.hand?.discardPile().top();
		return players.map((player, index) => {
			return { name: player, index };
		});
	}

	getPlayerName(index: number): string | undefined {
		return this.game.player(index);
	}

	getPlayerScore(index: number): number | undefined {
		return this.game.score(index);
	}

	getPlayerDeck(index: number): Card[] | undefined {
		return [...(this.game.hand?.playerHand(index) ?? [])];
	}

	getCurrentPlayer(): Player {
		const playerIndex = this.game.hand?.playerInTurn() ?? -1;
		return { name: this.game.hand?.player(playerIndex) ?? "", index: playerIndex };
	}

	play(cardIndex: number, nextColor?: CardColor): Card | undefined {
		const card = this.game.hand?.play(cardIndex, nextColor);
		this.discardPileTopCardRef.value = this.game.hand?.discardPile().top();
		return card;
	}

	decideMove(): void {
		const hand = this.game.hand;
		if (!hand) return;

		const move = decideMove(hand, this.bots[(this.game.hand?.playerInTurn() ?? 0) - 1]);

		if (move === "draw") {
			this.game.hand?.draw();
			return;
		}

		if (move.nextColor) alert("Next Color is: " + move.nextColor);
		this.play(move.cardIndex, move.nextColor);
	}

	draw(): void {
		this.game.hand?.draw();
		if (!this.game.hand?.canPlayAny()) this.game.hand?.nextPlayer();
	}

	sayUno(index: number): void {
		this.game.hand?.sayUno(index);
	}

	catchUnoFailure(unoFailure: UnoFailure): boolean {
		return this.game.hand?.catchUnoFailure(unoFailure) ?? false;
	}

	getTargetScore(): number {
		return this.game.targetScore;
	}

	get getDiscardPileTopCard(): Ref<Card | undefined, Card | undefined> {
		return this.discardPileTopCardRef;
	}
}
