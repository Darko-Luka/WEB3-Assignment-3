<template>
	<div>
		<h2 class="pb-8">Login</h2>
		<form @submit.prevent="handleLogin" class="space-y-4 w-64">
			<Input type="text" v-model="username" placeholder="Username" required />
			<Input type="password" v-model="password" placeholder="Password" required />
			<p class="text-xs text-red-500" v-if="authStore.error">{{ authStore.error }}</p>
			<Button type="submit">Login</Button>
		</form>

		<RouterLink to="/register">
			<p class="text-sm underline text-blue-500 pt-8">Create an account</p>
		</RouterLink>
	</div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const username = ref("");
const password = ref("");
const error = ref(authStore.error);

const handleLogin = async () => {
	await authStore.login(username.value, password.value);
};
</script>
