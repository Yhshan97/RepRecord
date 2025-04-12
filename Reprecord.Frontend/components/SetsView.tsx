import Card from "./Card";
import { ModalButtons } from "./Modal";
import { IconSymbol } from "./ui/IconSymbol";
import { useEffect, useState } from "react";
import { Log, Set } from "@/controllers/LogController";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export type SetsViewProps = {
	log: Log;
	selectedDate: string;
	onSaveAll: (log: Log) => void;
};

export default function SetView({ log, onSaveAll, selectedDate }: SetsViewProps) {
	const [sets, setSets] = useState<Set[]>([]);
	const [newRepetition, setNewRepetition] = useState("");
	const [newWeight, setNewWeight] = useState<string>("");
	const [hasChanged, setHasChanged] = useState(false);

	useEffect(() => {
		resetState();
	}, [selectedDate]);

	const resetState = () => {
		setSets(log.sets.map((set) => ({ ...set }))); // Deep copy
		setNewRepetition("");
		setNewWeight(log.sets[log.sets.length - 1]?.weight.toString() || "0");
		setHasChanged(false);
	};

	const handleSaveAll = () => {
		const updatedLog = { ...log, sets: sets };
		onSaveAll(updatedLog);
		setHasChanged(false);
	};

	const removeSet = () => {
		const updatedSets = [...sets];
		updatedSets.pop();
		setSets(updatedSets);
		sets.pop();
		setHasChanged(true);
	};

	const addSet = () => {
		const newSet = {
			setNumber: sets.length + 1,
			reps: parseFloat(newRepetition),
			weight: parseFloat(newWeight),
		};
		setSets([...sets, newSet]);
		setNewRepetition("");
		setNewWeight(newSet.weight.toString());
		setHasChanged(true);
	};

	return (
		<View style={styles.container}>
			<Card
				key={log.logID}
				style={{ padding: 0, borderRadius: 10 }}
			>
				<View style={{ padding: 10, paddingBottom: 0 }}>
					{/* Header Row */}
					<View style={styles.row}>
						<Text style={[styles.headerText, styles.rightCol]}>#</Text>
						<Text style={styles.headerText}>Reps</Text>
						<Text style={[styles.headerText, styles.middleCol]}></Text>
						<Text style={styles.headerText}>Weight (lbs)</Text>
						<Text style={[styles.headerText, styles.rightCol]}></Text>
					</View>

					{/* Content Rows */}
					{sets.map((set: Set, index: number) => {
						return (
							<View
								style={styles.row}
								key={index + log.logID!}
							>
								<TextInput
									style={[styles.TextInput, styles.rightCol, { borderWidth: 0 }]}
									value={set.setNumber.toString() + "."}
									editable={false}
								/>
								<TextInput
									style={styles.TextInput}
									value={set.reps.toString()}
									onChangeText={(text) => {
										const updatedSets = [...sets];
										if (text.length == 0 || text.includes("-")) {
											text = "0";
										}
										updatedSets[index].reps = parseInt(text);
										setSets(updatedSets);
										setHasChanged(true);
									}}
								/>
								<IconSymbol
									style={[styles.TextInput, styles.middleCol]}
									name="multiply"
									size={25}
									color="lightgray"
								/>
								<TextInput
									style={styles.TextInput}
									value={set.weight.toString()}
									onChangeText={(text) => {
										const updatedSets = [...sets];
										if (text.length == 0 || text.includes("-")) {
											text = "0";
										} else if (text.endsWith(".")) {
											text = text + "5";
										}
										updatedSets[index].weight = parseFloat(text);
										setSets(updatedSets);
										setHasChanged(true);
									}}
								/>
								{index == sets.length - 1 ? (
									<TouchableOpacity
										style={[styles.button, styles.rightCol, { backgroundColor: "red" }]}
										onPress={() => removeSet()}
									>
										<IconSymbol
											style={{ width: 24, height: 24 }}
											name="trash"
											size={24}
											color="white"
										/>
									</TouchableOpacity>
								) : (
									<Text style={[styles.rightCol]} />
								)}
							</View>
						);
					})}

					{/* Empty Row to Add Content */}
					<View
						style={styles.row}
						key={"newSet"}
					>
						<TextInput
							style={[styles.TextInput, styles.rightCol, { borderWidth: 0 }]}
							editable={false}
							value={(sets.length + 1).toString() + "."}
						/>
						<TextInput
							style={[styles.TextInput]}
							value={newRepetition.toString()}
							onChangeText={(text) => setNewRepetition(text)}
						/>
						<IconSymbol
							style={[styles.TextInput, styles.middleCol]}
							name="multiply"
							size={25}
							color="lightgray"
						/>
						<TextInput
							style={[styles.TextInput, { color: "gray" }]}
							value={newWeight.toString()}
							onChangeText={(text) => setNewWeight(text)}
						/>
						<TouchableOpacity
							style={[
								styles.button,
								styles.rightCol,
								{
									backgroundColor:
										newRepetition.length == 0 || newWeight.toString().length == 0 ? "lightgray" : "green",
								},
							]}
							onPress={() => addSet()}
							disabled={newRepetition.length == 0 || newWeight.toString().length == 0}
						>
							<IconSymbol
								style={{ width: 24, height: 24 }}
								name="checkmark"
								size={24}
								color="white"
							/>
						</TouchableOpacity>
					</View>
				</View>

				{/* Card buttons */}
				<ModalButtons
					onCancel={() => resetState()}
					onConfirm={() => handleSaveAll()}
					isDisabledProp={!hasChanged}
					confirmText="Save Changes"
					cancelText="Reset"
				/>
			</Card>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	TextInput: {
		borderWidth: 1,
		textAlign: "center",
		textAlignVertical: "center",
		borderColor: "lightgray",
		flex: 1,
		padding: 5,
		margin: 5,
		borderRadius: 5,
	},
	button: {
		borderWidth: 0,
		borderRadius: 5,
		borderColor: "lightgray",
		alignItems: "center",
	},
	row: { flexDirection: "row", justifyContent: "space-between" },
	middleCol: {
		flex: 0.2,
		alignItems: "center",
		borderWidth: 0,
	},
	rightCol: {
		flex: 0.2,
		padding: 5,
		margin: 5,
	},
	headerText: {
		flex: 1,
		textAlign: "center",
		padding: 5,
		margin: 5,
		marginBottom: 0,
		fontWeight: "bold",
		fontSize: 16,
	},
});
