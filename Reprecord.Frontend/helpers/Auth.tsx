import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { storage, STORAGE_KEYS } from "@/helpers/Storage";
import { Platform } from "react-native";
import { getUserSelf } from "@/controllers/UserController";

// local routes (temp)
const isWeb = Platform.OS === "web";
const redirectURL = isWeb ? process.env.EXPO_PUBLIC_REDIRECT_URI_WEB : process.env.EXPO_PUBLIC_REDIRECT_URI_MOBILE;
const loginURL = `${process.env.EXPO_PUBLIC_COGNITO_LOGIN_URL}?client_id=${process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${redirectURL}`;
const logoutURL = process.env.EXPO_PUBLIC_COGNITO_LOGOUT_URL!!;
const APIbaseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const validateUserToken = async () => {
	const user = await getUserSelf();
	if (user) {
		await storage.setItem(STORAGE_KEYS.USER_ID, user.id);
		await storage.setItem(STORAGE_KEYS.USER_NAME, user.name);
	} else {
		await storage.clearAllAsync();
	}
};

export const handleLoginPress = async (): Promise<boolean> => {
	try {
		const result = await WebBrowser.openAuthSessionAsync(loginURL, redirectURL);

		if (result.type === "success" && result.url) {
			const authCode = extractAuthCode(result.url);
			return await fetch(`${APIbaseURL}/auth/callback?code=${authCode}`)
				.then((res) => res.json())
				.then(async (data) => {
					await storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
					await storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
					await validateUserToken();
					return true;
				});
		} else {
			console.error("Authentication canceled or failed");
		}
	} catch (error) {
		console.error("Failed to open browser:", error);
	}
	return false;
};

export const handleLogoutPress = async (): Promise<boolean> => {
	return await fetch(logoutURL)
		.then(async (res) => {
			if (res.ok) {
				await storage.clearAllAsync();
				return true;
			} else {
				throw new Error("Failed to logout: " + res.statusText);
			}
		})
		.catch((error) => {
			console.error(error);
			return false;
		});
};

const extractAuthCode = (url: string) => {
	const parsed = Linking.parse(url);
	return parsed.queryParams ? parsed.queryParams["code"] : null;
};
