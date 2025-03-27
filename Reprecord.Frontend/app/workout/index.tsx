import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import {
	createWorkout,
	deleteWorkout,
	getUserWorkouts,
	Workout,
	WorkoutRequest,
} from "@/controllers/WorkoutController";
import Modal from "@/components/Modal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import SwipeableCard from "@/components/SwipeableCard";

export default function WorkoutScreen() {
	const [workouts, setWorkouts] = useState([] as Workout[]);
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [selectedWorkout, setSelectedWorkout] = useState(null as Workout | null);
	const [loading, setLoading] = useState(true);
	const [workoutName, setWorkoutName] = useState("");
	const [workoutDescription, setWorkoutDescription] = useState("");

	useEffect(() => {
		const fetchWorkouts = async () => {
			const data = await getUserWorkouts();
			setWorkouts(data ?? []);
			setLoading(false);
		};

		fetchWorkouts();
	}, []);

	const handleModalCancel = () => {
		setWorkoutName("");
		setWorkoutDescription("");
		setCreateModalVisible(false);
	};

	const handleModalConfirm = async () => {
		setCreateModalVisible(false);
		const workout: WorkoutRequest = {
			name: workoutName,
			description: workoutDescription,
		};
		const newWorkout = await createWorkout(workout);
		if (newWorkout) {
			setWorkouts([...workouts, newWorkout]);
		}
		setWorkoutName("");
		setWorkoutDescription("");
	};

	const handleDeleteWorkout = async () => {
		if (!selectedWorkout || !selectedWorkout.workoutID) return;
		setDeleteModalVisible(false);
		const success = await deleteWorkout(selectedWorkout.workoutID);
		if (success) {
			setWorkouts(workouts.filter((workout) => workout.workoutID !== selectedWorkout.workoutID));
		}
	};

	const handleDeleteModalCancel = () => {
		setSelectedWorkout(null);
		setDeleteModalVisible(false);
	};

	if (loading) {
		return <Text>Loading...</Text>;
	}

	const createWorkoutModal = (
		<Modal
			visible={createModalVisible}
			presentationStyle="overFullScreen"
			onRequestClose={() => handleModalCancel()}
			onModalCancel={() => handleModalCancel()}
			onModalConfirm={() => handleModalConfirm()}
		>
			<View style={styles.modalContent}>
				<ThemedText style={styles.modalTitle}>Create a New Workout</ThemedText>
				<ThemedTextInput
					placeholder="Workout Name"
					style={[styles.input]}
					maxLength={100}
					value={workoutName}
					onChangeText={(text) => setWorkoutName(text)}
				/>
				<ThemedTextInput
					placeholder="Description (optional)"
					style={[styles.input, styles.multilineInput]}
					multiline={true}
					numberOfLines={4}
					value={workoutDescription}
					onChangeText={(text) => setWorkoutDescription(text)}
				/>
			</View>
		</Modal>
	);

	const deleteWorkoutModal = (
		<Modal
			visible={deleteModalVisible}
			presentationStyle="overFullScreen"
			onRequestClose={() => handleDeleteModalCancel()}
			onModalCancel={() => handleDeleteModalCancel()}
			onModalConfirm={() => handleDeleteWorkout()}
		>
			<View style={[styles.modalContent, { alignItems: "center" }]}>
				<ThemedText style={[styles.cardTitle, { textAlign: "center" }]}>
					Are you sure you want to delete this workout?
				</ThemedText>
				<ThemedText>
					{selectedWorkout?.name}: {selectedWorkout?.description}
				</ThemedText>
			</View>
		</Modal>
	);

	return (
		<View style={styles.container}>
			<View>{createWorkoutModal}</View>
			<View>{deleteWorkoutModal}</View>
			<ScrollView style={styles.scrollView}>
				{workouts.map((workout) => (
					<SwipeableCard
						key={workout.workoutID}
						onPress={() => {}}
						onDelete={() => {
							console.log("delete");
							setDeleteModalVisible(true);
							setSelectedWorkout(workout);
						}}
					>
						<ThemedText style={styles.cardTitle}>{workout.name}</ThemedText>
						<ThemedText style={styles.descriptionText}>{workout.description}</ThemedText>
					</SwipeableCard>
				))}
			</ScrollView>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					activeOpacity={0.5}
					style={styles.button}
					onPress={() => setCreateModalVisible(true)}
				>
					<Text style={{ color: "white" }}>ADD</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 0.9,
		// height: "100%",
	},
	scrollView: {
		flex: 1,
		// marginTop: 20,
	},
	buttonContainer: {
		position: "absolute",
		bottom: 0,
		right: 0,
		alignItems: "flex-end",
		padding: 20,
	},
	button: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#f4511e",
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},
	cardTitle: {
		fontSize: 24,
		fontWeight: "bold",
	},
	modalContent: {
		padding: 20,
		paddingBottom: 0,
		marginBottom: 0,
		width: "100%",
		alignItems: "stretch",
		gap: 15,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
	},
	input: {
		minWidth: "100%",
		borderWidth: 0.5,
		borderColor: "gray",
		padding: 10,
		borderRadius: 3,
	},
	multilineInput: {
		height: 100,
		textAlignVertical: "top",
	},
	descriptionText: {
		opacity: 0.7,
		fontSize: 12,
		lineHeight: 16,
		maxHeight: 75,
	},
});
