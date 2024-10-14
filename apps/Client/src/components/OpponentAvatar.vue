<template>
	<div class="flex items-start">
		<div :class="getClass()">
			<Label class="text-black text-2xl">{{ name }}</Label>
		</div>
		<div class="flex flex-col pl-2 space-y-2">
			<Score :score="store.getPlayerScore(id)" />
			<Label class="text-white">{{ cards.length }} cards</Label>
			<Button
				v-if="cards.length === 1"
				@click="
					() => {
						// Assuming the accuser (you) is of index 0
						store.catchUnoFailure({ accuser: 0, accused: id });
						store.updateAllPlayerDecks();
					}
				"
				size="xs"
				>Cancel</Button
			>
		</div>
	</div>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";
import Label from "./ui/label/Label.vue";
import { defineProps } from "vue";
import Score from "./Score.vue";
import { useGameStore } from "@/stores/GameStore";
import type { Card } from "@/model/deck";
import Button from "./ui/button/Button.vue";

const store = useGameStore();

const props = defineProps<{
	cards: Array<Card>;
	isActive: boolean;
	name: string;
	id: number;
}>();

function getClass() {
	return cn(
		`w-24 h-24 rounded-full bg-white flex justify-center items-center ${props.isActive && "border-8 border-yellow-500"}
	`
	);
}
</script>
