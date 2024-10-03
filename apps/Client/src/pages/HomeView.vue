<template>
	<div class="flex items-end space-x-4">
		<NumberField :min="1" :max="3" v-model:model-value="botsCount">
			<Label>Number of players (Bots)</Label>
			<NumberFieldContent>
				<NumberFieldDecrement />
				<NumberFieldInput />
				<NumberFieldIncrement />
			</NumberFieldContent>
		</NumberField>
	</div>

	<ul class="space-y-2 mt-12">
		<li v-for="(_, index) in new Array(botsCount)">
			<div class="flex items-center space-x-4">
				<p>Bot({{ index + 1 }})</p>
				<Select v-model:model-value="difficulty[index]">
					<SelectTrigger class="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Level</SelectLabel>
							<SelectItem value="easy"> Easy </SelectItem>
							<SelectItem value="medium"> Medium </SelectItem>
							<SelectItem value="hard"> Hard </SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</li>
	</ul>

	<Button class="mt-12" @click="() => createGame()"> Play </Button>
</template>

<script setup lang="ts">
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from "@/components/ui/number-field";
import { Label } from "@/components/ui/label";
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/stores/GameStore";
import { useRouter } from "vue-router";

const botsCount = ref(1);
const difficulty = ref<("easy" | "medium" | "hard")[]>(["medium", "medium", "medium"]);
const store = useGameStore();
const router = useRouter();

function createGame() {
	store.createGame(difficulty.value.slice(0, botsCount.value));

	router.push("/game");
}
</script>
