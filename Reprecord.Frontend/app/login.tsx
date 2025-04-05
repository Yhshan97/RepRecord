import { Stack } from "expo-router";
import { StyleSheet, Image, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function LoginScreen() {
	const authContext = useContext(AuthContext);

	if (!authContext) {
		return null;
	}

	return (
		<>
			{/* <Stack.Screen options={{ title: "Login" }} /> */}
			<ParallaxScrollView
				headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
				headerImage={<></>}
			>
				<ThemedView style={styles.container}>
					<ThemedText type="title">Log In / Register</ThemedText>
					<ThemedText type="defaultSemiBold">
						Welcome to the Reprecord app! {"\n\n"}
						Link an account to save your workout data and track your progress.
					</ThemedText>
					<ThemedText></ThemedText>
					<TouchableOpacity
						style={styles.loginButton}
						onPress={() => authContext.login()}
					>
						<ThemedText style={styles.buttonText}>Sign Up / Sign In</ThemedText>
					</TouchableOpacity>
				</ThemedView>
			</ParallaxScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 60,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: "absolute",
	},
	loginButton: {
		backgroundColor: "#007bff",
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
