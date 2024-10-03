<template>
	<div>
		<h1 class="ml-2 mb-2 text-white text-xl">Discard Pile</h1>
		<CardComponent v-if="store.discardPileTopCard" :card="store.discardPileTopCard" />
		<div
			v-else
			class="min-w-32 max-w-32 bg-gray-400 h-[185.39px] rounded-lg cursor-pointer hover:scale-105 hover:-translate-y-2 transition-all ease-in"
		></div>
	</div>
</template>

<script setup lang="ts">
import { useGameStore } from "@/stores/GameStore";
import CardComponent from "./CardComponent.vue";
const store = useGameStore();
</script>
