import type { Card, CardColor } from "./deck";
import type { Hand } from "./hand";

export type Difficulty = "easy" | "medium" | "hard";
type CardToPlay = { cardIndex: number; nextColor?: CardColor };
type PlayableCard = { card: Card; index: number };

export function decideMove(hand: Hand, difficulty: Difficulty): "draw" | CardToPlay {
	const playableCards = getPlayableCards(hand);

	if (playableCards.length === 0) {
		return "draw";
	}

	handleUnoCall(hand, difficulty);

	switch (difficulty) {
		case "easy":
			return chooseRandomCard(playableCards);

		case "medium":
			return prioritizeSpecialCards(playableCards);

		case "hard":
			const playerInTurn = hand.playerInTurn();
			if (playerInTurn) {
				const playerDeck = hand.playerHand(playerInTurn);
				return playStrategically(playableCards, hand.discardPile().top(), playerDeck);
			}

		default:
			return "draw";
	}
}

async function handleUnoCall(hand: Hand, difficulty: Difficulty) {
	const playerInTurn = hand.playerInTurn();
	if (!playerInTurn) return;

	const playerDeck = hand.playerHand(playerInTurn);
	if (playerDeck.length === 2) {
		let sayUnoProbability = 0;
		let delay = 0;

		switch (difficulty) {
			case "easy":
				sayUnoProbability = 0.5; // 50% chance to say "Uno"
				delay = Math.random() * 2000 + 2000; // 2 to 4 seconds delay
				break;

			case "medium":
				sayUnoProbability = 0.8; // 80% chance to say "Uno"
				delay = Math.random() * 1000 + 1000; // 1 to 2 seconds delay
				break;

			case "hard":
				sayUnoProbability = 1.0; // Always says "Uno"
				delay = Math.random() * 500 + 500; // 0.5 to 1 second delay
				break;
		}

		// Determine whether the bot says "Uno"
		if (Math.random() < sayUnoProbability) {
			await new Promise((resolve) => setTimeout(resolve, delay));
			if (!hand.wasPenalized(playerInTurn)) {
				hand.sayUno(playerInTurn);
				alert(`Bot ${playerInTurn} said uno`);
			}
		}
	}
}

function chooseRandomCard(playableCards: PlayableCard[]): CardToPlay {
	const randomIndex = Math.floor(Math.random() * playableCards.length);
	const cardToPlay = playableCards[randomIndex];

	const wildCard = checkIfWildCard(cardToPlay);
	if (wildCard) return wildCard;

	return { cardIndex: cardToPlay.index };
}

function prioritizeSpecialCards(playableCards: PlayableCard[]): CardToPlay {
	const cardToPlay = playableCards.sort((a, b) => {
		const specialCardPriority = getCardPriority(a.card) - getCardPriority(b.card);
		return specialCardPriority || Math.random() - 0.5;
	})[0];

	const wildCard = checkIfWildCard(cardToPlay);
	if (wildCard) return wildCard;

	return { cardIndex: cardToPlay.index };
}

function playStrategically(playableCards: PlayableCard[], topCard: Card, playerDeck: Card[]): CardToPlay {
	// 1. If close to winning, play cards that minimize hand size
	if (playerDeck.length <= 3) {
		const cardToPlay = prioritizeLowValueCards(playableCards);
		const wildCard = checkIfWildCard(cardToPlay);
		if (wildCard) return wildCard;
		return { cardIndex: cardToPlay.index };
	}

	// 2. Try to make opponents draw if possible
	const drawCards = playableCards.filter((card) => card.card.type === "DRAW" || card.card.type === "WILD DRAW");
	if (drawCards.length > 0) {
		return prioritizeSpecialCards(drawCards); // Prioritize Draw cards
	}

	// 3. Play special cards like Skip/Reverse if it benefits the bot
	const skipOrReverseCards = playableCards.filter((card) => card.card.type === "SKIP" || card.card.type === "REVERSE");
	if (skipOrReverseCards.length > 0) {
		return prioritizeSpecialCards(skipOrReverseCards);
	}

	// 4. Hold Wild cards for flexibility unless it’s the only option
	const nonWildCards = playableCards.filter((card) => !(card.card.type === "WILD" || card.card.type === "WILD DRAW"));
	if (nonWildCards.length > 0) {
		const cardToPlay = prioritizeLowValueCards(nonWildCards);
		const wildCard = checkIfWildCard(cardToPlay);
		if (wildCard) return wildCard;
		return { cardIndex: cardToPlay.index };
	}

	// 5. Finally, play a Wild card if no other option
	return prioritizeSpecialCards(playableCards);
}

/* --- UTILS FUNCTIONS --- */

function getCardPriority(card: Card): number {
	if (card.type === "WILD" || card.type === "WILD DRAW") return 1;
	if (card.type === "DRAW") return 2;
	if (card.type === "SKIP" || card.type === "REVERSE") return 3;
	return 4;
}

function getRandomColor(): CardColor {
	const colors: CardColor[] = ["BLUE", "GREEN", "RED", "YELLOW"];
	return colors[Math.floor(Math.random() * colors.length)];
}

function checkIfWildCard(cardToPlay: PlayableCard): CardToPlay | null {
	if (cardToPlay && (cardToPlay.card.type === "WILD" || cardToPlay.card.type === "WILD DRAW")) {
		return { cardIndex: cardToPlay.index, nextColor: getRandomColor() };
	}

	return null;
}

function getPlayableCards(hand: Hand): PlayableCard[] {
	const playerInTurn = hand.playerInTurn();
	if (!playerInTurn) return [];

	return hand
		.playerHand(playerInTurn)
		.map((card, index) => ({ card, index })) // Create an object with the card and its index, so it can be accessed later with a correct index
		.filter(({ index }) => hand.canPlay(index));
}

function prioritizeLowValueCards(playableCards: PlayableCard[]): PlayableCard {
	return playableCards.sort((a, b) => {
		const valueA = getCardPriority(a.card);
		const valueB = getCardPriority(b.card);
		return valueA - valueB;
	})[0];
}
