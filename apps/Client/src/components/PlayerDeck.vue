<template>
	<ol class="flex items-center gap-4 bg-gray-300/25 p-4 mb-8 w-[80%] overflow-x-auto">
		<li :class="getCardClasses()" v-for="(card, index) in cards">
			<CardComponent :card="card" @click="play(index, card.type)" />
		</li>
		<Button
			size="lg"
			class="first:ml-auto last:mr-auto"
			@click="() => store.sayUno(playerIndex)"
			v-if="cards.length === 1"
			>Say Uno!</Button
		>
	</ol>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import CardComponent from "./CardComponent.vue";
import Button from "./ui/button/Button.vue";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores/GameStore";
import type { Card, CardColor, CardType } from "global-types";

const store = useGameStore();

function getCardClasses() {
	return cn(
		`transition-all ease-in first:ml-auto last:mr-auto ${props.isActive ? "cursor-pointer hover:scale-105 hover:-translate-y-2 " : "opacity-60"}`
	);
}

function play(index: number, cardType: CardType) {
	let chosenColor = undefined;
	if (cardType === "WILD" || cardType === "WILD DRAW") {
		const colorChoice = prompt("Choose a color:\n1. Blue\n2. Green\n3. Red\n4. Yellow");

		const colorMap: Record<string, CardColor> = {
			"1": "BLUE",
			"2": "GREEN",
			"3": "RED",
			"4": "YELLOW",
		};

		chosenColor = colorChoice ? colorMap[colorChoice.trim()] : null;

		if (!chosenColor) {
			alert("Invalid choice. Please enter a number between 1 and 4.");
			return;
		}
	}
	if (props.isActive) store.play(index, chosenColor);
}

const props = defineProps<{
	cards: Array<Card>;
	isActive: boolean;
}>();

// We are always assuming the player (you), is index 0
const playerIndex = 0;
</script>
