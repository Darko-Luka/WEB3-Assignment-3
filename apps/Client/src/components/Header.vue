<template>
	<div class="py-4 w-full flex justify-between px-2" v-if="authStore.user">
		<Label>Logged in as {{ authStore.user.username }}</Label>
		<Button @click="authStore.logout()">log out</Button>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/AuthStore";
import Button from "./ui/button/Button.vue";
import Label from "./ui/label/Label.vue";
const authStore = useAuthStore();
</script>
