import { useAuthStore } from "@/stores/AuthStore";
import axios from "axios";

const authStore = useAuthStore();

axios.defaults.baseURL = "http://localhost:3001";
axios.interceptors.request.use((config) => {
	if (authStore.token) {
		config.headers.Authorization = `Bearer ${authStore.token}`;
	}
	return config;
});

export default axios;
