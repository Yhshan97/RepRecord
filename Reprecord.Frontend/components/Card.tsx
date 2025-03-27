import { StyleSheet, ViewStyle } from "react-native";
import { ThemedView } from "./ThemedView";

type CardProps = {
	children: React.ReactNode;
	style?: ViewStyle | ViewStyle[];
};

export default function Card({ children, style }: CardProps) {
	return <ThemedView style={[styles.card, style]}>{children}</ThemedView>;
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#fff",
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
		borderRadius: 5,
		boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)",
	},
});
