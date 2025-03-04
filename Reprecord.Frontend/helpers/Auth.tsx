import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { storage, STORAGE_KEYS } from "@/helpers/Storage";
import { Platform } from "react-native";

// local routes (temp)
const isWeb = Platform.OS === "web";
const redirectUri = isWeb ? "http://localhost:8081" : "exp://192.168.0.107:8081";
const loginUrl = `https://reprecordd.auth.us-east-2.amazoncognito.com/login?client_id=57k2fpjir2h2qn8dphaddehicf&response_type=code&scope=email+openid+profile&redirect_uri=${redirectUri}`;
const logoutUrl = "https://www.google.com/accounts/Logout";
const API_BASE_URL = "http://192.168.0.107:3001/api";

export const validateUserToken = async () => {
	const storedToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
	const response = await fetch(`${API_BASE_URL}/users/me`, {
		headers: { Authorization: `Bearer ${storedToken}` },
	});

	if (response.status === 200) {
		const data = await response.json();
		storage.setItem(STORAGE_KEYS.USER_ID, data.id);
		storage.setItem(STORAGE_KEYS.USER_NAME, data.name);
	} else {
		await storage.clearAllAsync();
	}
};

export const handleLoginPress = async (): Promise<boolean> => {
	try {
		const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri);

		if (result.type === "success" && result.url) {
			const authCode = extractAuthCode(result.url);
			const response = await fetch(`${API_BASE_URL}/auth/callback?code=${authCode}`);
			const data = await response.json();

			storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
			storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
			await validateUserToken();
			return true;
		} else {
			console.log("Authentication canceled or failed");
		}
	} catch (error) {
		console.error("Failed to open browser:", error);
	}
	return false;
};

export const handleLogoutPress = async (): Promise<boolean> => {
	try {
		const response = await fetch(logoutUrl);

		if (response.ok) {
			await storage.clearAllAsync();
		} else {
			throw new Error("Failed to logout from Google: " + response.statusText);
		}
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};

const extractAuthCode = (url: string) => {
	const parsed = Linking.parse(url);
	return parsed.queryParams ? parsed.queryParams["code"] : null;
};
