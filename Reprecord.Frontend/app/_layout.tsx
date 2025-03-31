import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<SafeAreaProvider>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<GestureHandlerRootView>
					<AuthProvider>
						<Stack>
							<Stack.Screen
								name="login"
								options={{ title: "Login", headerShown: false }}
							/>
							<Stack.Screen
								name="(tabs)"
								options={{ headerLeft: () => null, headerTitle: "Main menu" }}
							/>
							<Stack.Screen name="+not-found" />
							<Stack.Screen
								name="workout/index"
								options={{ title: "Workouts", headerTitle: "My Workouts" }}
							/>
							<Stack.Screen
								name="workout/[id]"
								options={{ title: "Single Workout", headerTitle: "Exercises" }}
							/>
						</Stack>
						<StatusBar style="auto" />
					</AuthProvider>
				</GestureHandlerRootView>
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
