import { Image, StyleSheet, Platform, TouchableOpacity } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

export default function HomeScreen() {
	// Construct your login URL with the redirect URI
	const loginUrl = "";
	const handleLoginPress = async () => {
		// Create a redirect URI using Linking
		const redirectUri = "";

		try {
			// Open the authentication session
			const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri);
			console.log(result);
			if (result.type === "success" && result.url) {
				// Handle the redirect and extract the authorization code from the URL
				const authCode = extractAuthCode(result.url);
				console.log(authCode);
			} else {
				// Handle cancellation or errors
				console.log("Authentication canceled or failed");
			}
		} catch (error) {
			console.error("Failed to open browser:", error);
		}
	};

	const extractAuthCode = (url: string) => {
		const parsed = Linking.parse(url);
		return parsed.queryParams ? parsed.queryParams["code"] : null;
	};

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
			headerImage={
				<Image
					source={require("@/assets/images/partial-react-logo.png")}
					style={styles.reactLogo}
				/>
			}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">Welcome!</ThemedText>
				<HelloWave />
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 1: Try it </ThemedText>
				<ThemedText>
					Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes. Press{" "}
					<ThemedText type="defaultSemiBold">
						{Platform.select({
							ios: "cmd + d",
							android: "cmd + m",
							web: "F12",
						})}
					</ThemedText>{" "}
					to open developer tools.
				</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 2: Explore</ThemedText>
				<ThemedText>{loginUrl}</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
				<ThemedText>
					When you're ready, run <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{" "}
					<ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{" "}
					<ThemedText type="defaultSemiBold">app</ThemedText> to <ThemedText type="defaultSemiBold">app-example</ThemedText>.
				</ThemedText>
			</ThemedView>

			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Login</ThemedText>
				<TouchableOpacity
					style={styles.loginButton}
					onPress={handleLoginPress}
				>
					<ThemedText style={styles.buttonText}>Sign in with Cognito</ThemedText>
				</TouchableOpacity>
			</ThemedView>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: "absolute",
	},
	loginButton: {
		backgroundColor: "#007bff", // Use your theme color
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 10,
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
});
