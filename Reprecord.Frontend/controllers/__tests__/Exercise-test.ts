import { getWorkoutExercises, createWorkoutExercise, updateExercise, deleteExercise } from "../ExerciseController";
import ApiClient from "../../services/ApiClient";

jest.mock("../../services/ApiClient");

describe("ExerciseController", () => {
	const mockExercise = {
		id: "2",
		workoutId: "1",
		name: "Test exercise",
		description: "Test description",
	};

	const mockExercises = [mockExercise];
	const mockExerciseRequest = {
		name: "Test exercise",
		description: "Test description",
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should get workout exercises", async () => {
		(ApiClient.get as jest.Mock).mockResolvedValue(mockExercises);

		const res = await getWorkoutExercises("1");

		expect(ApiClient.get).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans/1/exercises`);
		expect(res).toEqual(mockExercises);
	});

	it("should throw error for get workout exercises", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.get as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await getWorkoutExercises("1");

		expect(ApiClient.get).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans/1/exercises`);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});

	it("should create workout exercise", async () => {
		(ApiClient.post as jest.Mock).mockResolvedValue(mockExercise);

		const res = await createWorkoutExercise("1", mockExerciseRequest);

		expect(ApiClient.post).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans/1/exercises`,
			JSON.stringify(mockExerciseRequest)
		);
		expect(res).toEqual(mockExercise);
	});

	it("should throw error for create workout exercise", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.post as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await createWorkoutExercise("1", mockExerciseRequest);

		expect(ApiClient.post).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans/1/exercises`,
			JSON.stringify(mockExerciseRequest)
		);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});

	it("should update exercise", async () => {
		(ApiClient.put as jest.Mock).mockResolvedValue(mockExercise);

		const res = await updateExercise("2", mockExerciseRequest);

		expect(ApiClient.put).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/exercises/2`,
			JSON.stringify(mockExerciseRequest)
		);
		expect(res).toEqual(mockExercise);
	});

	it("should throw error for update exercise", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.put as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await updateExercise("2", mockExerciseRequest);

		expect(ApiClient.put).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/exercises/2`,
			JSON.stringify(mockExerciseRequest)
		);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});

	it("should delete exercise", async () => {
		(ApiClient.delete as jest.Mock).mockResolvedValue({});

		const res = await deleteExercise("2");

		expect(ApiClient.delete).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/exercises/2`);
		expect(res).toEqual({});
	});

	it("should throw error for delete exercise", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.delete as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await deleteExercise("2");

		expect(ApiClient.delete).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/exercises/2`);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});
});
