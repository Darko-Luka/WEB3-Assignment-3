<template>
	<div class="flex justify-center items-center flex-col">
		<h1 class="text-4xl">{{ winner }} has won!</h1>
		<ol class="my-4 text-lg">
			<li class="" v-for="player in players" :key="player.name">
				<span class="font-bold">{{ player.name }}</span> - {{ player.score }}
			</li>
		</ol>
		<RouterLink to="/">
			<Button size="lg" class="my-4"> Play again </Button>
		</RouterLink>
	</div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { computed, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const players = ref<Array<{ name: string; score: number }>>([]);

for (const [name, score] of Object.entries(route.query)) {
	if (typeof score === "string") {
		players.value.push({
			name,
			score: parseInt(score, 10),
		});
	}
}

const winner = computed(() => {
	if (players.value.length === 0) return "No one";

	const topPlayer = players.value.reduce((prev, current) => {
		return current.score > prev.score ? current : prev;
	});
	return topPlayer.name;
});

players.value.sort((a, b) => b.score - a.score);
</script>
