<template>
	<div>
		<h1 class="ml-4 mb-2 text-white text-xl">Draw Pile</h1>
		<img
			:class="getClasses()"
			@click="
				() => {
					if (isActive) store.draw();
				}
			"
			src="../assets/cards/Deck.png"
		/>
	</div>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores/GameStore";

function getClasses() {
	return cn(
		`max-w-28 min-w-28 transition-all ease-in ${props.isActive ? "cursor-pointer hover:scale-105 hover:-translate-y-2 " : "opacity-60"}`
	);
}

const store = useGameStore();

const props = defineProps<{
	isActive: boolean;
}>();
</script>
