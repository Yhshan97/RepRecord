import {
	getWorkoutExercises,
	Exercise,
	createWorkoutExercise,
	ExerciseRequest,
	deleteExercise,
} from "@/controllers/ExerciseController";
import { getWorkout, Workout } from "@/controllers/WorkoutController";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Modal from "@/components/Modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import SwipeableCard from "@/components/SwipeableCard";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export default function WorkoutDetailsScreen() {
	const { id } = useLocalSearchParams();
	const [workoutDetails, setWorkoutDetails] = useState({} as Workout);
	const [exercises, setExercises] = useState([] as Exercise[]);
	const [loading, setLoading] = useState(true);
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [selectedExercise, setSelectedExercise] = useState(null as Exercise | null);
	const [exerciseName, setExerciseName] = useState("");
	const [exerciseDescription, setExerciseDescription] = useState("");

	useEffect(() => {
		const fetchWorkoutDetails = async () => {
			const workout = await getWorkout(id as string);
			setWorkoutDetails(workout ?? ({} as Workout));
		};

		const fetchWorkoutExercises = async () => {
			const data = await getWorkoutExercises(id as string);
			setExercises(data ?? []);
		};

		const fetchData = async () => {
			await fetchWorkoutDetails();
			await fetchWorkoutExercises();
			setLoading(false);
		};

		fetchData();
	}, [id]);

	const handleCreateExercise = async () => {
		setCreateModalVisible(false);
		const exercise: ExerciseRequest = {
			name: exerciseName,
			description: exerciseDescription,
		};
		const newExercise = await createWorkoutExercise(id as string, exercise);
		if (newExercise) {
			setExercises([...exercises, newExercise]);
			setExerciseName("");
			setExerciseDescription("");
		}
	};

	const handleDeleteExercise = async () => {
		if (!selectedExercise || !selectedExercise.exerciseID) return;
		setDeleteModalVisible(false);
		await deleteExercise(selectedExercise.exerciseID);
		setExercises(exercises.filter((exercise) => exercise.exerciseID !== selectedExercise.exerciseID));
		setSelectedExercise(null);
	};

	if (loading) {
		return <Text>Loading...</Text>;
	}

	const handleDeleteModalCancel = () => {
		setDeleteModalVisible(false);
		setSelectedExercise(null);
	};

	const handleCreateModalCancel = () => {
		setCreateModalVisible(false);
	};

	const createExerciseModal = (
		<Modal
			visible={createModalVisible}
			presentationStyle="overFullScreen"
			onRequestClose={() => handleCreateModalCancel()}
			onModalCancel={() => handleCreateModalCancel()}
			onModalConfirm={() => handleCreateExercise()}
		>
			<View style={styles.modalContent}>
				<ThemedText style={styles.modalTitle}>Create a New Exercise</ThemedText>
				<ThemedTextInput
					placeholder="Exercise Name"
					style={[styles.input]}
					maxLength={100}
					value={exerciseName}
					onChangeText={(text) => setExerciseName(text)}
				/>
				<ThemedTextInput
					placeholder="Description (optional)"
					style={[styles.input, styles.multilineInput]}
					multiline={true}
					numberOfLines={4}
					value={exerciseDescription}
					onChangeText={(text) => setExerciseDescription(text)}
				/>
			</View>
		</Modal>
	);

	const deleteExerciseModal = (
		<Modal
			visible={deleteModalVisible}
			presentationStyle="overFullScreen"
			onRequestClose={() => handleDeleteModalCancel()}
			onModalCancel={() => handleDeleteModalCancel()}
			onModalConfirm={() => handleDeleteExercise()}
		>
			<View style={[styles.modalContent, { alignItems: "center" }]}>
				<ThemedText style={[styles.cardTitle, { textAlign: "center" }]}>
					Are you sure you want to delete this exercise?
				</ThemedText>
				<ThemedText>
					{selectedExercise?.name}: {selectedExercise?.description}
				</ThemedText>
			</View>
		</Modal>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View>
				{createExerciseModal}
				{deleteExerciseModal}
			</View>
			<View style={styles.workoutDetails}>
				<ThemedText style={styles.workoutTitle}>{workoutDetails.name}</ThemedText>
				<ThemedText style={styles.workoutDescription}>{workoutDetails.description}</ThemedText>
				<ThemedText style={styles.workoutMeta}>Created at: {workoutDetails.createdAt}</ThemedText>
				<ThemedText style={styles.workoutMeta}>Updated at: {workoutDetails.updatedAt}</ThemedText>
			</View>
			<ScrollView style={styles.scrollView}>
				<GestureHandlerRootView>
					{exercises.map((exercise) => (
						<SwipeableCard
							key={exercise.exerciseID}
							onPress={() => {}}
							onDelete={() => {
								setDeleteModalVisible(true);
								setSelectedExercise(exercise);
							}}
						>
							<ThemedText style={styles.exerciseTitle}>{exercise.name}</ThemedText>
							<ThemedText style={styles.exerciseDescription}>{exercise.description}</ThemedText>
						</SwipeableCard>
					))}
				</GestureHandlerRootView>
			</ScrollView>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					activeOpacity={0.8}
					style={styles.button}
					onPress={() => setCreateModalVisible(true)}
				>
					<IconSymbol
						name="plus"
						color={"white"}
					/>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 0.9,
	},
	workoutDetails: {
		padding: 20,
		backgroundColor: "#f5f5f5",
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	workoutTitle: {
		fontSize: 24,
		fontWeight: "bold",
	},
	workoutDescription: {
		fontSize: 16,
		marginVertical: 10,
		opacity: 0.8,
	},
	workoutMeta: {
		fontSize: 12,
		color: "gray",
	},
	scrollView: {
		flex: 1,
		padding: 10,
	},
	addCard: {
		backgroundColor: "#dddddd",
		padding: 0,
		margin: 0,
	},
	exerciseTitle: {
		fontSize: 18,
		fontWeight: "bold",
	},
	exerciseDescription: {
		fontSize: 14,
		color: "gray",
		marginTop: 5,
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
