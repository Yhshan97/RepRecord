import { TextInput, type TextInputProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
	lightColor?: string;
	darkColor?: string;
	type?: "default" | "rounded" | "underline";
};

export function ThemedTextInput({ style, lightColor, darkColor, type = "default", ...rest }: ThemedTextInputProps) {
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
	const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
	const textColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");

	return (
		<TextInput
			style={[
				{ backgroundColor, color: textColor, borderColor, textAlignVertical: "top" },
				type === "default" ? styles.default : undefined,
				type === "rounded" ? styles.rounded : undefined,
				type === "underline" ? styles.underline : undefined,
				style,
			]}
			placeholderTextColor={textColor}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	default: {
		fontSize: 16,
		padding: 10,
		borderWidth: 0.5,
		borderRadius: 5,
	},
	rounded: {
		fontSize: 16,
		padding: 10,
		borderWidth: 1,
		borderRadius: 25,
	},
	underline: {
		fontSize: 16,
		paddingVertical: 5,
		borderBottomWidth: 1,
		borderRadius: 0,
	},
});
