import ApiClient from "@/services/ApiClient";

export type Workout = {
	id?: string;
	userId: string;
	name: string;
	description?: string;
	createdAt?: string;
	updatedAt?: string;
};
export type WorkoutRequest = {
	name: string;
	description: string;
};

const endpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans`;

export const getUserWorkouts = async () => {
	try {
		return await ApiClient.get<Array<Workout>>(endpoint);
	} catch (error) {
		console.error(error);
	}
};

export const getWorkout = async (id: string) => {
	try {
		return await ApiClient.get<Workout>(`${endpoint}/${id}`);
	} catch (error) {
		console.error(error);
	}
};

export const createWorkout = async (workout: WorkoutRequest) => {
	try {
		return await ApiClient.post<Workout>(endpoint, { body: JSON.stringify(workout) });
	} catch (error) {
		console.error(error);
	}
};

export const updateWorkout = async (workoutId: string, workout: WorkoutRequest) => {
	try {
		return await ApiClient.put<Workout>(`${endpoint}/${workoutId}`, { body: JSON.stringify(workout) });
	} catch (error) {
		console.error(error);
	}
};

export const deleteWorkout = async (workoutId: string) => {
	try {
		return await ApiClient.delete<Workout>(`${endpoint}/${workoutId}`);
	} catch (error) {
		console.error(error);
	}
};
