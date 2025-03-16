import ApiClient from "@/services/ApiClient";

type Exercise = {
	id?: string;
	workoutID: string;
	name: string;
	description?: string;
};
type ExerciseRequest = {
	name: string;
	description: string;
};

const endpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/exercises`;
const workoutEndpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans`;

export const getWorkoutExercises = async (workoutId: string) => {
	try {
		return await ApiClient.get<Array<Exercise>>(`${workoutEndpoint}/${workoutId}/exercises`);
	} catch (error) {
		console.error(error);
	}
};

export const createWorkoutExercise = async (workoutId: string, exercise: ExerciseRequest) => {
	try {
		return await ApiClient.post<Exercise>(`${workoutEndpoint}/${workoutId}/exercises`, {
			body: JSON.stringify(exercise),
		});
	} catch (error) {
		console.error(error);
	}
};

export const updateExercise = async (exerciseId: string, exercise: ExerciseRequest) => {
	try {
		return await ApiClient.put<Exercise>(`${endpoint}/${exerciseId}`, { body: JSON.stringify(exercise) });
	} catch (error) {
		console.error(error);
	}
};

export const deleteExercise = async (exerciseId: string) => {
	try {
		return await ApiClient.delete<any>(`${endpoint}/${exerciseId}`);
	} catch (error) {
		console.error(error);
	}
};
