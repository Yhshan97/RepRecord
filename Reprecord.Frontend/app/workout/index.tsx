import { View, Text } from "react-native";

import { useEffect, useState } from "react";
import { getUserWorkouts, Workout, WorkoutRequest } from "@/controllers/WorkoutController";

export default function WorkoutScreen() {
	const [workouts, setWorkouts] = useState([] as Workout[]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchWorkouts = async () => {
			const data = await getUserWorkouts();
			setWorkouts(data ?? []);
			setLoading(false);
		};
		console.log("fetching workouts");

		fetchWorkouts();

		console.log(workouts);
	}, []);

	return (
		<View>
			<Text>Workout Screen</Text>
			{loading ? (
				<Text>Loading...</Text>
			) : (
				<View>
					{workouts.map((workout) => (
						<Text key={workout.id}>{workout.name}</Text>
					))}
				</View>
			)}
		</View>
	);
}
