<template>
	<img class="min-w-28 max-w-28" :src="getImgUrl()" :alt="getCardName()" />
</template>

<script setup lang="ts">
import type { Card } from "global-types";
import { defineProps } from "vue";

const props = defineProps<{
	card: Card;
}>();

function getImgUrl() {
	return `/src/assets/cards/${getCardName()}.png`;
}

function getCardName() {
	const typeMapping: Record<string, string> = {
		DECK: "Deck",
		WILD: "Wild",
		"WILD DRAW": "Wild_Draw",
		SKIP: "Skip",
		REVERSE: "Reverse",
		DRAW: "Draw",
	};

	const formattedType = typeMapping[props.card.type] || props.card.type;

	if (formattedType === "Wild" || formattedType === "Wild_Draw" || formattedType === "Deck") {
		return formattedType;
	}

	if (formattedType === "Skip" || formattedType === "Reverse" || formattedType === "Draw") {
		return `${props.card.color}_${formattedType}`;
	}

	return `${props.card.color}_${props.card.number}`;
}
</script>
