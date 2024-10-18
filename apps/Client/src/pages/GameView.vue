<template>
	<div v-if="connected" class="w-full h-[720px] flex flex-col justify-between table-image">
		<div class="flex justify-between items-center">
			<ScoreTarget :targetScore="targetScore" />
			<div class="flex items-center justify-between w-1/2 mx-auto p-6">
				<OpponentAvatar
					v-for="player in store.players"
					:cards="store.players[player.index].deck"
					:key="player.index"
					:isActive="store.isPlayerInTurn(player.index)"
					:name="player.name"
					:id="player.index"
				/>
			</div>
		</div>

		<div class="flex flex-row gap-64 justify-center">
			<DrawPile :isActive="isPlayerInTurn" />
			<DiscardPile />
		</div>

		<div class="flex items-center justify-center space-x-2">
			<PlayerDeck v-if="currentPlayer?.deck" :cards="currentPlayer.deck" :isActive="isPlayerInTurn" />
			<Score :score="score" />
		</div>
	</div>
</template>

<script setup lang="ts">
import DiscardPile from "@/components/DiscardPile.vue";
import DrawPile from "@/components/DrawPile.vue";
import OpponentAvatar from "@/components/OpponentAvatar.vue";
import PlayerDeck from "@/components/PlayerDeck.vue";
import Score from "@/components/Score.vue";
import ScoreTarget from "@/components/ScoreTarget.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useGameStore } from "@/stores/GameStore";
import type { Card, Player } from "global-types";
import { onMounted, ref, watch } from "vue";

const store = useGameStore();

const targetScore = ref(0);
const score = ref(0);
const authStore = useAuthStore();
const currentPlayer = ref<(Player & { deck: Card[] }) | undefined>(undefined);
const connected = ref(false);
const isPlayerInTurn = ref(false);

onMounted(async () => {
	await store.joinGame();
	currentPlayer.value = getPlayerByUsername(authStore.user?.username ?? "");
	targetScore.value = await store.getTargetScore();
	score.value = await store.getPlayerScore(currentPlayer.value?.index ?? -1);
	isPlayerInTurn.value = currentPlayer.value?.index === store.currentPlayerIndex;
	connected.value = true;
});

watch(
	() => store.players,
	() => (currentPlayer.value = getPlayerByUsername(authStore.user?.username ?? ""))
);

watch(
	() => store.currentPlayerIndex,
	() => (isPlayerInTurn.value = currentPlayer.value?.index === store.currentPlayerIndex)
);

function getPlayerByUsername(username: string): (Player & { deck: Card[] }) | undefined {
	for (let index = 0; index < store.players.length; index++) {
		const player = store.players[index];
		if (player.name === username) return player;
	}

	return undefined;
}
</script>

<style scoped>
.table-image {
	background-image: url("../assets/cards/Table_3.png");
}
</style>
