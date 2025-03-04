import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const isWeb = Platform.OS === "web";

export const STORAGE_KEYS = {
	ACCESS_TOKEN: "accessToken",
	REFRESH_TOKEN: "refreshToken",
	USER_ID: "userId",
	USER_NAME: "userName",
};

export const storage = {
	async getItem(key: string): Promise<string | null> {
		return isWeb ? localStorage.getItem(key) : await SecureStore.getItemAsync(key);
	},

	async setItem(key: string, value: string): Promise<void> {
		isWeb ? localStorage.setItem(key, value) : await SecureStore.setItemAsync(key, value);
	},

	async deleteItemAsync(key: string): Promise<void> {
		isWeb ? localStorage.removeItem(key) : await SecureStore.deleteItemAsync(key);
	},

	async clearAllAsync(): Promise<void> {
		if (isWeb) {
			localStorage.clear();
		} else {
			const keys = Object.values(STORAGE_KEYS);
			for (const key of keys) {
				await SecureStore.deleteItemAsync(key);
			}
		}
	},
};
