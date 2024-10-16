import { EngineService } from "@/model/engineService";
import type { EngineInterface } from "@/model/interfaces/engineInterface";
import type { Card, CardColor, Player, UnoFailure } from "global-types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./AuthStore";

export const useGameStore = defineStore("game", () => {
	const players = ref<(Player & { deck: Card[] })[]>([]);
	const discardPileTopCard = ref<Card | undefined>(undefined);
	const engineService: EngineInterface = new EngineService();
	const currentPlayerIndex = ref(0);
	const authStore = useAuthStore();

	async function joinGame() {
		const _players = await engineService.joinGame(authStore.user?.username ?? "");

		players.value = await Promise.all(
			_players.map(async (player) => {
				const deck = (await engineService.getPlayerDeck(player.index)) ?? [];
				return {
					...player,
					deck,
				};
			})
		);

		engineService.subscribeOnEnd(async () => {
			const query: Record<string, string | number> = {};

			await Promise.all(
				players.value.map(async (player) => {
					//const score = await engineService.getPlayerScore(player.index);
					query[player.name] = 0;
				})
			);

			//router.push({ path: "/over", query });
		});

		discardPileTopCard.value = await engineService.getDiscardPileTopCard();

		engineService.onGameUpdate(async () => {
			players.value = await Promise.all(
				_players.map(async (player) => {
					const deck = (await engineService.getPlayerDeck(player.index)) ?? [];
					return {
						...player,
						deck,
					};
				})
			);

			discardPileTopCard.value = await engineService.getDiscardPileTopCard();
			nextTurn();
		});

		nextTurn();
	}

	function draw() {
		engineService.draw();
		updateAllPlayerDecks();
	}

	async function play(cardIndex: number, nextColor?: CardColor) {
		try {
			await engineService.play(cardIndex, nextColor);
			updateAllPlayerDecks();
		} catch {
			alert("Illegal card play");
		}
	}

	async function getPlayerScore(index: number): Promise<number> {
		return (await engineService.getPlayerScore(index)) ?? 0;
	}

	async function getPlayerDeck(index: number): Promise<Card[]> {
		return (await engineService.getPlayerDeck(index)) ?? [];
	}

	function isPlayerInTurn(index: number): boolean {
		return index === currentPlayerIndex.value;
	}

	function sayUno(index: number) {
		engineService.sayUno(index);
		updateAllPlayerDecks();
	}

	async function catchUnoFailure(unoFailure: UnoFailure) {
		await engineService.catchUnoFailure(unoFailure);
	}

	function getTargetScore() {
		return engineService.getTargetScore();
	}

	async function nextTurn() {
		currentPlayerIndex.value = (await engineService.getCurrentPlayer()).index;
	}

	function updateAllPlayerDecks() {
		players.value.forEach(async (player) => {
			player.deck = (await engineService.getPlayerDeck(player.index)) ?? [];
		});
	}

	return {
		joinGame,
		getPlayerScore,
		getPlayerDeck,
		isPlayerInTurn,
		play,
		draw,
		sayUno,
		catchUnoFailure,
		updateAllPlayerDecks,
		getTargetScore,
		players,
		discardPileTopCard,
		currentPlayerIndex,
	};
});
