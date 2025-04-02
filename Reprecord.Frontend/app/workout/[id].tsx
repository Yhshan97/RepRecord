import {
	getWorkoutExercises,
	Exercise,
	createWorkoutExercise,
	ExerciseRequest,
	deleteExercise,
} from "@/controllers/ExerciseController";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import SwipeableCard from "@/components/SwipeableCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { getWorkout, updateWorkout, Workout, WorkoutRequest } from "@/controllers/WorkoutController";
import { Pressable } from "react-native-gesture-handler";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";

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
	const [updateWorkoutName, setUpdateWorkoutName] = useState(workoutDetails.name);
	const [updateWorkoutDescription, setUpdateWorkoutDescription] = useState(workoutDetails.description || "");
	const [updateWorkoutModalVisible, setUpdateWorkoutModalVisible] = useState(false);
	const [lastRefresh, setLastRefresh] = useState(0);

	const fetchWorkoutExercises = async () => {
		let data = await getWorkoutExercises(id as string);
		data = data?.sort((a, b) => a.name.localeCompare(b.name));
		setExercises(data ?? []);
	};

	useEffect(() => {
		const fetchWorkoutDetails = async () => {
			const workout = await getWorkout(id as string);
			setWorkoutDetails(workout ?? ({} as Workout));
			setUpdateWorkoutName(workout?.name || "");
			setUpdateWorkoutDescription(workout?.description || "");
		};

		const fetchData = async () => {
			await fetchWorkoutDetails();
			await fetchWorkoutExercises();
			setLoading(false);
		};

		fetchData();
	}, [id]);

	const handleRefresh = async () => {
		const timestamp = new Date().getTime();
		if (timestamp - lastRefresh < 30000) {
			console.warn(`Please wait ${Math.round((30000 - (timestamp - lastRefresh)) / 1000)} more seconds.`);
			return;
		}
		setLastRefresh(timestamp);
		await fetchWorkoutExercises();
	};

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

	const handleUpdateModalCancel = () => {
		setUpdateWorkoutModalVisible(false);
		setUpdateWorkoutName(workoutDetails.name);
		setUpdateWorkoutDescription(workoutDetails.description || "");
	};

	const handleUpdateWorkout = async () => {
		setUpdateWorkoutModalVisible(false);
		const changedWorkout: WorkoutRequest = {
			name: updateWorkoutName,
			description: updateWorkoutDescription,
		};
		const updatedWorkout = await updateWorkout(id as string, changedWorkout);
		if (updatedWorkout) {
			setWorkoutDetails(updatedWorkout);
			setUpdateWorkoutName(updatedWorkout.name);
			setUpdateWorkoutDescription(updatedWorkout.description || "");
		}
	};

	const updateWorkoutModal = (
		<Modal
			visible={updateWorkoutModalVisible}
			presentationStyle="overFullScreen"
			onRequestClose={() => handleUpdateModalCancel()}
			onModalCancel={() => handleUpdateModalCancel()}
			onModalConfirm={() => handleUpdateWorkout()}
		>
			<View style={styles.modalContent}>
				<ThemedText style={styles.modalTitle}>Update Workout</ThemedText>
				<ThemedTextInput
					placeholder="Exercise Name"
					style={[styles.input]}
					maxLength={100}
					value={updateWorkoutName}
					onChangeText={(text) => setUpdateWorkoutName(text)}
				/>
				<ThemedTextInput
					placeholder="Description (optional)"
					style={[styles.input, styles.multilineInput]}
					multiline={true}
					numberOfLines={4}
					value={updateWorkoutDescription}
					onChangeText={(text) => setUpdateWorkoutDescription(text)}
				/>
			</View>
		</Modal>
	);

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
					onSubmitEditing={() => handleCreateExercise()}
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
		<SafeAreaView
			style={styles.container}
			edges={["left", "right"]}
		>
			<View>
				{createExerciseModal}
				{deleteExerciseModal}
				{updateWorkoutModal}
			</View>
			<View style={styles.titleContainer}>
				<View style={{ flex: 0.9 }}>
					<ThemedText style={styles.workoutTitle}>{workoutDetails.name}</ThemedText>
					<ThemedText style={styles.workoutDescription}>{workoutDetails.description}</ThemedText>
					<ThemedText style={styles.workoutMeta}>Last Updated: {workoutDetails.updatedAt?.split("T")[0]}</ThemedText>
				</View>
				<Pressable onPress={() => setUpdateWorkoutModalVisible(true)}>
					<IconSymbol
						name="pencil"
						color={"grey"}
					/>
				</Pressable>
			</View>

			{/* List of exercises*/}
			<ScrollView
				style={styles.scrollView}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={() => handleRefresh()}
					/>
				}
			>
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
		paddingVertical: 10,
	},
	workoutDetails: {
		paddingHorizontal: 20,
		paddingBottom: 20,
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
		borderTopWidth: 0.5,
		borderTopColor: "#aca9a9",
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
	titleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		padding: 10,
		borderRadius: 5,
		marginHorizontal: 5,
		marginBottom: 10,
	},
});
