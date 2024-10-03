<template>
	<div class="w-full h-[720px] flex flex-col justify-between table-image">
		<div class="flex justify-between items-center">
			<ScoreTarget :targetScore="store.getTargetScore()" />
			<div class="flex items-center justify-between w-1/2 mx-auto p-6">
				<OpponentAvatar
					v-for="bot in store.bots"
					:cards="store.players[bot.index].deck"
					:key="bot.index"
					:isActive="store.isPlayerInTurn(bot.index)"
					:name="bot.name"
					:id="bot.index"
				/>
			</div>
		</div>

		<div class="flex flex-row gap-64 justify-center">
			<DrawPile :isActive="store.isPlayerInTurn(playerIndex)" />
			<DiscardPile />
		</div>

		<div class="flex items-center justify-center space-x-2">
			<PlayerDeck :cards="store.players[playerIndex].deck" :isActive="store.isPlayerInTurn(playerIndex)" />
			<Score :score="store.getPlayerScore(playerIndex)" />
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
import { useGameStore } from "@/stores/GameStore";
import { useRouter } from "vue-router";

const store = useGameStore();
const router = useRouter();

// We are always assuming the player (you), is index 0
const playerIndex = 0;

try {
	store.players[playerIndex].deck;
} catch {
	// check if the game was initialized properly, if no go back to the home view
	router.push("/").then(() => location.reload());
}
</script>

<style scoped>
.table-image {
	background-image: url("../assets/cards/Table_3.png");
}
</style>
