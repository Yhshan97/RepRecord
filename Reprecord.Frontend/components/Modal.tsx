import { PropsWithChildren, useState } from "react";
import {
	Modal as NativeModal,
	ModalProps,
	Pressable,
	TouchableWithoutFeedback,
	View,
	StyleSheet,
	Text,
	PressableAndroidRippleConfig,
} from "react-native";

interface CustomModalProps extends ModalProps {
	onModalCancel: () => void;
	onModalConfirm: () => void;
}

type ModalButtonProps = {
	onCancel: () => void;
	onConfirm: () => void;
	isDisabledProp?: boolean;
	cancelText?: string;
	confirmText?: string;
};

export const ModalButtons = ({
	onCancel,
	onConfirm,
	isDisabledProp = false,
	cancelText = "Cancel",
	confirmText = "Confirm",
}: ModalButtonProps) => {
	const rippleStyle: PressableAndroidRippleConfig = {
		color: "rgba(0,0,0,0.1)",
		foreground: true,
	};

	const [isDisabled, setIsDisabled] = useState(false);

	const handleCancelClick = () => {
		setIsDisabled(true);
		onCancel();
		setIsDisabled(false);
	};

	const handleConfirmClick = () => {
		setIsDisabled(true);
		onConfirm();
		setIsDisabled(false);
	};

	return (
		<View style={styles.buttonContainer}>
			<Pressable
				style={[styles.button, styles.buttonCancel, (isDisabled || isDisabledProp) && styles.buttonDisabled]}
				disabled={isDisabled || isDisabledProp}
				android_ripple={rippleStyle}
				onPress={handleCancelClick}
				accessibilityLabel="Cancel button"
				accessible={true}
			>
				<Text style={[styles.cancelText, styles.textStyle]}>{cancelText}</Text>
			</Pressable>
			<Pressable
				style={[styles.button, styles.buttonConfirm, (isDisabled || isDisabledProp) && styles.buttonDisabled]}
				disabled={isDisabled || isDisabledProp}
				android_ripple={rippleStyle}
				onPress={handleConfirmClick}
				accessibilityLabel="Confirm button"
				accessible={true}
			>
				<Text style={[styles.confirmText, styles.textStyle]}>{confirmText}</Text>
			</Pressable>
		</View>
	);
};

export default function Modal({
	children,
	visible,
	onModalCancel,
	onModalConfirm,
}: PropsWithChildren<CustomModalProps>) {
	return (
		<NativeModal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onModalCancel}
		>
			<TouchableWithoutFeedback onPress={onModalCancel}>
				<View style={styles.centeredView}>
					<TouchableWithoutFeedback onPress={() => {}}>
						<View style={styles.modalView}>
							{children}
							<ModalButtons
								onCancel={onModalCancel}
								onConfirm={onModalConfirm}
							/>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</NativeModal>
	);
}

const BORDER_RADIUS = 10;

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.65)",
	},
	modalView: {
		backgroundColor: "white",
		borderRadius: BORDER_RADIUS,
		margin: 15,
		alignItems: "center",
		elevation: 15,
	},
	buttonContainer: {
		flexDirection: "row",
		alignItems: "stretch",
		marginTop: 20,
	},
	button: {
		flex: 0.5,
		padding: 10,
		margin: -0.5,
		borderWidth: 0.5,
		borderColor: "gray",
		overflow: "hidden",
	},
	buttonDisabled: {
		opacity: 0.3,
	},
	buttonCancel: {
		borderBottomLeftRadius: BORDER_RADIUS,
	},
	buttonConfirm: {
		borderBottomRightRadius: BORDER_RADIUS,
		borderLeftWidth: 0,
	},
	cancelText: {
		color: "red",
	},
	confirmText: {
		color: "green",
	},
	textStyle: {
		textAlign: "center",
	},
});
