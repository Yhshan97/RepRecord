import ApiClient from "@/services/ApiClient";

type Set = {
	setNumber: number;
	reps: number;
	weight: number;
};

type Log = {
	id?: string;
	exerciseId: string;
	date: string;
	sets: Array<Set>;
};

type LogRequest = {
	date: string;
	sets: Array<Set>;
};

const endpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/logs`;
const exerciseEndpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/exercises`;

export const getExerciseLogs = async (exerciseId: string) => {
	try {
		return await ApiClient.get<Array<Log>>(`${exerciseEndpoint}/${exerciseId}/logs`);
	} catch (error) {
		console.error(error);
	}
};

export const createExerciseLog = async (exerciseId: string, log: LogRequest) => {
	try {
		return await ApiClient.post<Log>(`${exerciseEndpoint}/${exerciseId}/logs`, JSON.stringify(log));
	} catch (error) {
		console.error(error);
	}
};

export const updateLog = async (logId: string, log: LogRequest) => {
	try {
		return await ApiClient.put<Log>(`${endpoint}/${logId}`, JSON.stringify(log));
	} catch (error) {
		console.error(error);
	}
};

export const deleteLog = async (logId: string) => {
	try {
		return await ApiClient.delete<any>(`${endpoint}/${logId}`);
	} catch (error) {
		console.error(error);
	}
};
