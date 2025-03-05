import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { storage, STORAGE_KEYS } from "@/helpers/Storage";
import { Platform } from "react-native";

// local routes (temp)
const isWeb = Platform.OS === "web";
const redirectURL = isWeb ? process.env.EXPO_PUBLIC_REDIRECT_URI_WEB : process.env.EXPO_PUBLIC_REDIRECT_URI_MOBILE;
const loginURL = `${process.env.EXPO_PUBLIC_COGNITO_LOGIN_URL}?client_id=${process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${redirectURL}`;
const logoutURL = process.env.EXPO_PUBLIC_COGNITO_LOGOUT_URL!!;
const APIbaseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const validateUserToken = async () => {
	const storedToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
	const response = await fetch(`${APIbaseURL}/users/me`, {
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
		const result = await WebBrowser.openAuthSessionAsync(loginURL, redirectURL);

		if (result.type === "success" && result.url) {
			const authCode = extractAuthCode(result.url);
			const response = await fetch(`${APIbaseURL}/auth/callback?code=${authCode}`);
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
		const response = await fetch(logoutURL);

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
