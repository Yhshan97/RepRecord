import { StyleSheet, Platform, TouchableOpacity } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { router } from "expo-router";

export default function HomeScreen() {
	const authContext = useContext(AuthContext);

	if (!authContext) {
		return null;
	}

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: "#A1CEDC", dark: "#11242a" }}
			headerImage={<></>}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">Welcome, you are logged in!</ThemedText>
				<HelloWave />
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 1: Try it </ThemedText>
				<TouchableOpacity
					style={styles.workoutButton}
					onPress={() => {
						router.navigate("/workouts");
					}}
				>
					<ThemedText style={styles.buttonText}>Workouts page</ThemedText>
				</TouchableOpacity>
				<ThemedText>
					Edit <ThemedText type="defaultSemiBold">app/(tabs)/HomeScreen.tsx</ThemedText> to see changes. Press{" "}
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
				<ThemedText>{}</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
				<ThemedText>
					When you're ready, run <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{" "}
					<ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{" "}
					<ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
					<ThemedText type="defaultSemiBold">app-example</ThemedText>.
				</ThemedText>
			</ThemedView>
			<TouchableOpacity
				style={styles.logoutButton}
				onPress={() => authContext.logout()}
			>
				<ThemedText style={styles.buttonText}>Log Out</ThemedText>
			</TouchableOpacity>
			<ThemedView style={styles.stepContainer}></ThemedView>
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
	logoutButton: {
		backgroundColor: "red",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 10,
	},
	workoutButton: {
		backgroundColor: "green",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 10,
	},
});
