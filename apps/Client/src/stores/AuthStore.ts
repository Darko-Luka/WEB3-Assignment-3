import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
	const user = ref<{ username: string } | null>(null);
	const token = ref(localStorage.getItem("token") || null);
	const error = ref(null);
	const router = useRouter();

	const initialize = async () => {
		if (token.value) {
			try {
				const response = await axios.get("http://localhost:3001/v1/auth/me", {
					headers: { Authorization: `${token.value}` },
				});
				user.value = response.data.user;
			} catch (err: any) {
				console.error("Failed to load user on mount", err);
				logout();
			}
		}
	};

	const register = async (username: string, password: string) => {
		try {
			const response = await axios.post("http://localhost:3001/v1/auth/register", { username, password });
			token.value = response.data.token;
			localStorage.setItem("token", response.data.token);
			user.value = response.data.user;
			router.push("/");
		} catch (err: any) {
			error.value = err.message;
		}
	};

	const login = async (username: string, password: string) => {
		try {
			const response = await axios.post("http://localhost:3001/v1/auth/login", {
				username,
				password,
			});
			token.value = response.data.token;
			localStorage.setItem("token", response.data.token);
			user.value = response.data.user;
			router.push("/");
		} catch (err: any) {
			error.value = err.message;
		}
	};

	const logout = () => {
		user.value = null;
		token.value = null;
		localStorage.removeItem("token");
		router.push("/login");
	};

	return { user, token, error, register, login, logout, initialize };
});
