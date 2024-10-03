<template>
	<Label class="text-white text-xl absolute pl-20">Target: {{ targetScore }}</Label>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{ targetScore: Number }>();
</script>
