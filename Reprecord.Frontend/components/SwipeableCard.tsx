import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Card from "./Card";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

type Props = {
	children: React.ReactNode;
	onPress?: () => void;
	onLongPress?: () => void;
	onDelete?: () => void;
};

export default function SwipeableCard({ children, onPress, onLongPress, onDelete }: Props) {
	const renderRightActions = (progress: SharedValue<number>) => {
		// const animatedStyle = useAnimatedStyle(() => ({
		// 	opacity: interpolate(progress.value, [0, 1], [0, 1]),
		// }));

		return (
			<Animated.View style={[styles.deleteButton]}>
				<TouchableOpacity
					onPress={onDelete}
					style={styles.deleteContainer}
				>
					<Text style={styles.deleteText}>X</Text>
				</TouchableOpacity>
			</Animated.View>
		);
	};

	return (
		<Swipeable
			renderRightActions={renderRightActions}
			overshootRight={false}
			friction={2}
		>
			<TouchableOpacity
				activeOpacity={0.75}
				onPress={onPress}
				onLongPress={onLongPress}
			>
				<Card>{children}</Card>
			</TouchableOpacity>
		</Swipeable>
	);
}

const styles = StyleSheet.create({
	deleteButton: {
		backgroundColor: "red",
		justifyContent: "center",
		alignItems: "center",
		width: 60,
		marginVertical: 8,
		marginRight: 16,
		marginLeft: -16,
		borderTopEndRadius: 5,
		borderBottomEndRadius: 5,
	},
	deleteContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	deleteText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
});
