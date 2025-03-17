import { View, Text, Pressable, Button } from "react-native";

import { useEffect, useState } from "react";
import { createWorkout, getUserWorkouts, Workout, WorkoutRequest } from "@/controllers/WorkoutController";

export default function WorkoutScreen() {
	const [workouts, setWorkouts] = useState([] as Workout[]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchWorkouts = async () => {
			const data = await getUserWorkouts();
			setWorkouts(data ?? []);
			setLoading(false);
		};

		fetchWorkouts();
	}, []);

	const addWorkout = async () => {
		const workout: WorkoutRequest = {
			name: "Test Workout",
			description: "test description",
		};
		const newWorkout = await createWorkout(workout);
		if (newWorkout) {
			setWorkouts([...workouts, newWorkout]);
		}
	};

	return (
		<View>
			<Text>Workout Screen</Text>
			{loading ? (
				<Text>Loading...</Text>
			) : (
				<View>
					<Pressable>
						<Button
							onPress={addWorkout}
							title="Add Workout"
						/>
					</Pressable>
					{workouts.map((workout) => (
						<Text key={workout.workoutID}>
							{workout.name}, {workout.description}
						</Text>
					))}
				</View>
			)}
		</View>
	);
}
