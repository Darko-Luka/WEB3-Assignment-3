<template>
	<div class="w-64 space-y-4">
		<h1>Game session</h1>
		<Input type="text" placeholder="Session name..." v-model="sessionName" />
		<div class="flex items-end space-x-4">
			<NumberField :min="2" :max="4" v-model:model-value="playerCount">
				<Label>Number of players</Label>
				<NumberFieldContent>
					<NumberFieldDecrement />
					<NumberFieldInput />
					<NumberFieldIncrement />
				</NumberFieldContent>
			</NumberField>
		</div>
		<Button :disabled="sessionName.length === 0" @click="createSession()">Create</Button>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "./ui/button/Button.vue";
import Input from "./ui/input/Input.vue";
import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from "@/components/ui/number-field";
import { useSessionStore } from "@/stores/SessionStore";
import { useAuthStore } from "@/stores/AuthStore";

const playerCount = ref(2);
const sessionName = ref("");
const sessionStore = useSessionStore();
const authStore = useAuthStore();

const handleCreatedSessionCallback = (data: any) => {
	if (data.type !== "sessionCreated") return;

	const { sessionId } = data.data;
	sessionStore.currentSessionId = sessionId;
};

sessionStore.onMessageSubscribe(handleCreatedSessionCallback);

function createSession() {
	sessionStore.sendMessage({
		type: "createSession",
		data: {
			maxPlayers: playerCount.value,
			name: sessionName.value,
			hostUsername: authStore.user?.username,
		},
	});

	sessionName.value = "";
	playerCount.value = 2;
}
</script>
