import type { Difficulty } from "@/model/botAI";
import type { Card, CardColor } from "@/model/deck";
import { EngineService } from "@/model/engineService";
import type { UnoFailure } from "@/model/hand";
import type { EngineInterface, Player } from "@/model/interfaces/engineInterface";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

export const useGameStore = defineStore("game", () => {
	const players = ref<(Player & { isBot: boolean; deck: Card[]; difficulty?: Difficulty })[]>([]);
	const bots = computed(() => players.value.filter((player) => player.isBot));
	const engineService: EngineService = new EngineService();
	const currentPlayerIndex = ref(0);
	const router = useRouter();

	function createGame(bots: ("easy" | "medium" | "hard")[]) {
		const _players = engineService.createGame(bots);

		players.value = _players.map((player, index) => {
			const isBot = player.name.includes("bot");
			const difficulty = isBot ? bots[index - 1] : undefined;
			return {
				...player,
				isBot,
				deck: engineService.getPlayerDeck(player.index) ?? [],
				difficulty,
			};
		});
		engineService.onEnd = () => {
			const query: Record<string, string | number> = {};

			players.value.forEach((player) => {
				const name = player.name;
				const score = engineService.getPlayerScore(player.index);
				query[name] = score ?? 0;
			});
			router.push({ path: "/over", query });
		};
		nextTurn();
	}

	function play(cardIndex: number, nextColor?: CardColor) {
		try {
			engineService.play(cardIndex, nextColor);
			updateAllPlayerDecks();
			nextTurn();
		} catch {
			alert("Illegal card play");
		}
	}

	function draw() {
		engineService.draw();
		updateAllPlayerDecks();
		nextTurn();
	}

	function getPlayerScore(index: number): number {
		return engineService.getPlayerScore(index) ?? 0;
	}

	function isPlayerInTurn(index: number): boolean {
		return index === currentPlayerIndex.value;
	}

	function sayUno(index: number) {
		engineService.sayUno(index);
		updateAllPlayerDecks();
	}

	function catchUnoFailure(unoFailure: UnoFailure) {
		engineService.catchUnoFailure(unoFailure);
	}

	function getTargetScore() {
		return engineService.getTargetScore();
	}

	function makeBotMove() {
		setTimeout(() => {
			engineService.decideMove();
			updateAllPlayerDecks();
			nextTurn();
		}, 2500);
	}

	function nextTurn() {
		currentPlayerIndex.value = engineService.getCurrentPlayer().index;
		const currentPlayer = players.value[currentPlayerIndex.value];

		checkForUnoFailure().then(() => {
			if (currentPlayer?.isBot) {
				makeBotMove();
			}
		});
	}

	async function checkForUnoFailure() {
		const delayBetweenChecks = 500;
		for (const bot of players.value) {
			if (!bot.isBot) continue;

			for (const otherPlayer of players.value) {
				if (bot === otherPlayer || otherPlayer.deck.length !== 1) continue;

				let catchProbability = 0;
				let delay = 0;

				switch (bot.difficulty) {
					case "easy":
						catchProbability = 0.2; // 20% chance to catch failure
						delay = Math.random() * 2000 + 2000; // 2 to 4 seconds delay
						break;

					case "medium":
						catchProbability = 0.5; // 50% chance to catch failure
						delay = Math.random() * 1500 + 1000; // 1 to 2.5 seconds delay
						break;

					case "hard":
						catchProbability = 0.8; // 80% chance to catch failure
						delay = Math.random() * 1000 + 500; // 0.5 to 1.5 seconds delay
						break;
				}

				if (Math.random() < catchProbability) {
					await new Promise((resolve) => setTimeout(resolve, delay));
					const isCaught = engineService.catchUnoFailure({ accused: otherPlayer.index, accuser: bot.index });
					if (isCaught) {
						alert(`Bot ${bot.index} caught ${otherPlayer.name} ${otherPlayer.index} for not saying Uno!`);
						updateAllPlayerDecks();
					}
				}
			}

			// Introduce a small delay between bots checking to simulate realistic behavior
			await new Promise((resolve) => setTimeout(resolve, delayBetweenChecks));
		}
	}

	function updateAllPlayerDecks() {
		players.value.forEach((player) => {
			player.deck = engineService.getPlayerDeck(player.index) ?? [];
		});
	}

	return {
		createGame,
		getPlayerScore,
		isPlayerInTurn,
		play,
		draw,
		sayUno,
		catchUnoFailure,
		updateAllPlayerDecks,
		getTargetScore,
		discardPileTopCard: engineService.getDiscardPileTopCard,
		players,
		bots,
	};
});
