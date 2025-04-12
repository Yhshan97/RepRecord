import Modal from "@/components/Modal";
import Card from "@/components/Card";
import SetView from "@/components/SetsView";
import WeekCalendarComponent from "@/components/WeekCalendar";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "react-native-gesture-handler";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { updateLog } from "@/controllers/LogController";
import { DateToStrLocale, GetDateOffsetFromNow, TodayInStrLocale } from "@/helpers/DateHelper";
import { Exercise, ExerciseRequest, getWorkoutExercises, updateExercise } from "@/controllers/ExerciseController";
import { createExerciseLog, deleteLog, getExerciseLogs, Log, LogRequest } from "@/controllers/LogController";

export default function ExerciseDetailsScreen() {
	const { id, workoutID } = useLocalSearchParams();
	const [lastRefresh, setLastRefresh] = useState(0);
	const [selectedDate, setSelectedDate] = useState(TodayInStrLocale());
	const [exerciseDetails, setExerciseDetails] = useState({} as Exercise);
	const [logsMap, setLogsMap] = useState({} as { [key: string]: any });
	const [updateWorkoutModalVisible, setUpdateExerciseModalVisible] = useState(false);
	const [updateExerciseName, setUpdateExerciseName] = useState(exerciseDetails.name);
	const [updateExerciseDescription, setUpdateExerciseDescription] = useState(exerciseDetails.description || "");
	const [loading, setLoading] = useState(true);

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

	const fetchExerciseLogs = async () => {
		let data = await getExerciseLogs(id as string);
		const logsMap = data?.reduce((acc: { [key: string]: any }, log: Log) => {
			if (!acc[log.date]) {
				acc[log.date] = { ...log, marked: true };
			} else {
				// shouldn't happen but if 2 logs have the same date, merge sets
				acc[log.date].sets.push(...log.sets);
			}
			return acc;
		}, {});
		setLogsMap(logsMap ?? {});
	};

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
		const log: LogRequest = {
			date: new Date(selectedDate).toISOString().split("T")[0],
			sets: [],
		};
		const newLog = await createExerciseLog(id as string, log);

		if (newLog) {
			setLogsMap((prev) => ({ ...prev, [log.date]: { ...newLog, marked: true } }));
		}
	};

	const handleUpdateLogSets = async (log: Log) => {
		// Empty set?, delete the log instead
		if (log.sets.length == 0) {
			await deleteLog(log.logID);
			const items = { ...logsMap };
			delete items[log.date];
			setLogsMap(items);
			return;
		}

		const logReq = {
			date: log.date,
			sets: log.sets,
		};
		const updatedLog = await updateLog(log.logID, logReq);
		if (updatedLog) {
			// change the log only for the replaced logID
			setLogsMap((prev) => ({ ...prev, [log.date]: { ...updatedLog, marked: true } }));
		}
	};

	const updateWorkoutModal = (
		<Modal
			visible={updateWorkoutModalVisible}
			presentationStyle="overFullScreen"
			onRequestClose={() => handleUpdateModalCancel()}
			onModalCancel={() => handleUpdateModalCancel()}
			onModalConfirm={() => handleUpdateConfirm()}
		>
			<View style={styles.modalContent}>
				<ThemedText style={styles.modalTitle}>Update Exercise</ThemedText>
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

	const handleUpdateConfirm = async () => {
		setUpdateExerciseModalVisible(false);
		const changedExercise: ExerciseRequest = {
			name: updateExerciseName,
			description: updateExerciseDescription,
		};

		const updated = await updateExercise(id as string, changedExercise);
		if (updated) {
			setExerciseDetails(updated);
			setUpdateExerciseName(updated.name);
			setUpdateExerciseDescription(updated.description || "");
		}
	};

	const handleUpdateModalCancel = () => {
		setUpdateExerciseModalVisible(false);
		setUpdateExerciseName(exerciseDetails.name);
		setUpdateExerciseDescription(exerciseDetails.description || "");
	};

	if (loading) {
		return <Text>Loading...</Text>;
	}

	return (
		<SafeAreaView
			style={{ flex: 1 }}
			edges={["left", "right", "bottom"]}
		>
			<View style={styles.container}>
				{/* Modals */}
				<View>{updateWorkoutModal}</View>

				{/* Exercise Title and Description */}
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

				{/* List of sets of a single date */}
				<ScrollView
					style={styles.scrollView}
					refreshControl={
						<RefreshControl
							refreshing={loading}
							onRefresh={() => handleRefresh()}
						/>
					}
				>
					<Text style={styles.headerText}>{selectedDate} Logs</Text>

					{logsMap[selectedDate] ? (
						<SetView
							selectedDate={selectedDate}
							log={logsMap[selectedDate]}
							onSaveAll={(updatedLog) => {
								console.log("updated log", updatedLog);
								handleUpdateLogSets(updatedLog);
							}}
						/>
					) : (
						<Text style={styles.noDataText}>No Data Available</Text>
					)}
					{!logsMap[selectedDate] && (
						<TouchableOpacity onPress={() => handleCreateLog()}>
							<Card style={styles.addCard}>
								<IconSymbol
									name="plus"
									size={25}
									color={"white"}
									style={{ height: 25, width: 25, marginRight: 5 }}
								/>
								<ThemedText style={{ color: "white" }}>Add New Log</ThemedText>
							</Card>
						</TouchableOpacity>
					)}
				</ScrollView>

				{/* Calendar Date picker component */}
				<View style={{ flex: 0.2 }}>
					<WeekCalendarComponent
						onDateChanged={(date) => {
							setSelectedDate(date);
						}}
						onDateOutOfRange={(date) => {
							console.log("Date out of range:", date);
						}}
						minDate={DateToStrLocale(GetDateOffsetFromNow(-14))}
						maxDate={TodayInStrLocale()}
						markedDates={logsMap}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 10,
		marginBottom: 10,
		alignContent: "stretch",
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		flexShrink: 1,
		padding: 10,
		borderRadius: 5,
		marginHorizontal: 5,
		marginBottom: 10,
	},
	scrollView: {
		maxHeight: "55%",
		borderTopWidth: 0.5,
		borderBottomWidth: 0.5,
		borderColor: "#818181",
		backgroundColor: "white",
	},
	headerText: {
		flex: 1,
		textAlign: "center",
		padding: 5,
		margin: 5,
		marginBottom: 1,
		fontWeight: "bold",
		fontSize: 20,
		borderBottomWidth: 0.5,
		marginHorizontal: 20,
		borderColor: "gray",
	},
	noDataText: {
		color: "lightgray",
		fontWeight: "ultralight",
		paddingVertical: 30,
		textAlign: "center",
		fontSize: 16,
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
	addCard: {
		padding: 10,
		backgroundColor: "green",
		borderColor: "#818181",
		borderWidth: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
	},
	modalContent: {
		padding: 20,
		paddingBottom: 0,
		marginBottom: 0,
		width: "100%",
		alignItems: "stretch",
		gap: 15,
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
});
