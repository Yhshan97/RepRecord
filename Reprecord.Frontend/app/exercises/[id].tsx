import Modal from "@/components/Modal";
import { getExerciseLogs, Log, LogRequest } from "@/controllers/LogController";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import SwipeableCard from "@/components/SwipeableCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { getWorkout, updateWorkout, Workout, WorkoutRequest } from "@/controllers/WorkoutController";
import { Exercise, ExerciseRequest, getWorkoutExercises, updateExercise } from "@/controllers/ExerciseController";
import { Pressable } from "react-native-gesture-handler";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";

export default function ExerciseDetailsScreen() {
	const { id, workoutID } = useLocalSearchParams();
	const [exerciseDetails, setExerciseDetails] = useState({} as Exercise);
	const [logs, setLogs] = useState([] as Log[]);
	const [loading, setLoading] = useState(true);
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [selectedLog, setSelectedLog] = useState(null as Log | null);
	const [exerciseName, setExerciseName] = useState("");
	const [exerciseDescription, setExerciseDescription] = useState("");
	const [updateExerciseName, setUpdateExerciseName] = useState(exerciseDetails.name);
	const [updateExerciseDescription, setUpdateExerciseDescription] = useState(exerciseDetails.description || "");
	const [updateWorkoutModalVisible, setUpdateExerciseModalVisible] = useState(false);
	const [lastRefresh, setLastRefresh] = useState(0);

	const fetchExerciseLogs = async () => {
		let data = await getExerciseLogs(id as string);
		data = data?.sort((a, b) => a.date.localeCompare(b.date));
		setLogs(data ?? []);
	};

	useEffect(() => {
		const fetchExerciseDetails = async () => {
			const exercise = await getWorkoutExercises(workoutID as string).then((exercises) =>
				exercises?.find((exercise) => exercise.exerciseID === id)
			);
			setExerciseDetails(exercise ?? ({} as Exercise));
			setUpdateExerciseName(exercise?.name || "");
			setUpdateExerciseDescription(exercise?.description || "");
		};

		const fetchData = async () => {
			await fetchExerciseDetails();
			await fetchExerciseLogs();
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
		await fetchExerciseLogs();
	};

	const handleCreateLog = async () => {
		// setCreateModalVisible(false);
		// const exercise: ExerciseRequest = {
		// 	name: exerciseName,
		// 	description: exerciseDescription,
		// };
		// const newExercise = await createWorkoutExercise(id as string, exercise);
		// if (newExercise) {
		// 	setLogs([...logs, newExercise]);
		// 	setExerciseName("");
		// 	setExerciseDescription("");
		// }
	};

	const handleDeleteLog = async () => {
		// if (!selectedLog || !selectedLog.exerciseID) return;
		// setDeleteModalVisible(false);
		// await deleteExercise(selectedLog.exerciseID);
		// setLogs(logs.filter((exercise) => exercise.exerciseID !== selectedLog.exerciseID));
		// setSelectedLog(null);
	};

	if (loading) {
		return <Text>Loading...</Text>;
	}

	const handleDeleteModalCancel = () => {
		setDeleteModalVisible(false);
		setSelectedLog(null);
	};

	const handleCreateModalCancel = () => {
		setCreateModalVisible(false);
	};

	const handleUpdateModalCancel = () => {
		setUpdateExerciseModalVisible(false);
		setUpdateExerciseName(exerciseDetails.name);
		setUpdateExerciseDescription(exerciseDetails.description || "");
	};

	const handleUpdateExercise = async () => {
		setUpdateExerciseModalVisible(false);
		// const changedWorkout: WorkoutRequest = {
		// 	name: updateExerciseName,
		// 	description: updateExerciseDescription,
		// };
		// const updatedWorkout = await updateWorkout(id as string, changedWorkout);
		// if (updatedWorkout) {
		// 	setWorkoutDetails(updatedWorkout);
		// 	setUpdateExerciseName(updatedWorkout.name);
		// 	setUpdateExerciseDescription(updatedWorkout.description || "");
		// }
	};

	const updateWorkoutModal = (
		<Modal
			visible={updateWorkoutModalVisible}
			presentationStyle="overFullScreen"
			onRequestClose={() => handleUpdateModalCancel()}
			onModalCancel={() => handleUpdateModalCancel()}
			onModalConfirm={() => handleUpdateExercise()}
		>
			<View style={styles.modalContent}>
				<ThemedText style={styles.modalTitle}>Update Workout</ThemedText>
				<ThemedTextInput
					placeholder="Exercise Name"
					style={[styles.input]}
					maxLength={100}
					value={updateExerciseName}
					onChangeText={(text) => setUpdateExerciseName(text)}
				/>
				<ThemedTextInput
					placeholder="Description (optional)"
					style={[styles.input, styles.multilineInput]}
					multiline={true}
					numberOfLines={4}
					value={updateExerciseDescription}
					onChangeText={(text) => setUpdateExerciseDescription(text)}
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
			onModalConfirm={() => handleCreateLog()}
		>
			<View style={styles.modalContent}>
				<ThemedText style={styles.modalTitle}>Create a New Exercise</ThemedText>
				<ThemedTextInput
					placeholder="Exercise Name"
					style={[styles.input]}
					maxLength={100}
					value={exerciseName}
					onChangeText={(text) => setExerciseName(text)}
					onSubmitEditing={() => handleCreateLog()}
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
			onModalConfirm={() => handleDeleteLog()}
		>
			<View style={[styles.modalContent, { alignItems: "center" }]}>
				<ThemedText style={[styles.cardTitle, { textAlign: "center" }]}>
					Are you sure you want to delete this exercise?
				</ThemedText>
				<ThemedText>
					Log done on date: {selectedLog?.date}
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
					<ThemedText style={styles.workoutTitle}>{exerciseDetails.name}</ThemedText>
					<ThemedText style={styles.workoutDescription}>{exerciseDetails.description}</ThemedText>
				</View>
				<Pressable onPress={() => setUpdateExerciseModalVisible(true)}>
					<IconSymbol
						name="pencil"
						color={"grey"}
					/>
				</Pressable>
			</View>

			{/* List of logs */}
			<ScrollView
				style={styles.scrollView}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={() => handleRefresh()}
					/>
				}
			>
				{logs.map((log) => (
					<SwipeableCard
						key={log.logID}
						onPress={() => {}}
						onDelete={() => {
							setDeleteModalVisible(true);
							setSelectedLog(log);
						}}
					>
						<ThemedText style={styles.exerciseTitle}>{log.date}</ThemedText>
						{log.sets.map((set, index) => (
							<ThemedText key={index}>
								Set {set.setNumber}: {set.reps} reps @ {set.weight} kg
							</ThemedText>
						))}
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
