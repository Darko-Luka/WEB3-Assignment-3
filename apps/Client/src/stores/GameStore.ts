import { EngineService } from "@/model/engineService";
import type { EngineInterface } from "@/model/interfaces/engineInterface";
import type { Card, CardColor, Player, UnoFailure } from "global-types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useGameStore = defineStore("game", () => {
	const players = ref<(Player & { deck: Card[] })[]>([]);
	const engineService: EngineInterface = new EngineService();
	const currentPlayerIndex = ref(0);
	const router = useRouter();

	function createGame() {
		const _players = engineService.createGame();

		players.value = _players.map((player, index) => {
			const isBot = player.name.includes("bot");
			return {
				...player,
				isBot,
				deck: engineService.getPlayerDeck(player.index) ?? [],
			};
		});

		engineService.subscribeOnEnd(() => {
			const query: Record<string, string | number> = {};

			players.value.forEach((player) => {
				const name = player.name;
				const score = engineService.getPlayerScore(player.index);
				query[name] = score ?? 0;
			});
			router.push({ path: "/over", query });
		});
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

	function nextTurn() {
		currentPlayerIndex.value = engineService.getCurrentPlayer().index;
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
	};
});
