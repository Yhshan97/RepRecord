import { createWorkout, getWorkout, getUserWorkouts, updateWorkout, deleteWorkout } from "../WorkoutController";
import ApiClient from "../../services/ApiClient";

jest.mock("../../services/ApiClient");

describe("WorkoutController", () => {
	const mockWorkout = {
		id: 1,
		userId: 1,
		name: "Test workout",
		description: "Test description",
		createdAt: "2025-01-01",
		updatedAt: "2025-01-01",
	};

	const mockWorkouts = [mockWorkout];
	const mockWorkoutRequest = { name: "Test workout", description: "Test description" };

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should get user workouts", async () => {
		(ApiClient.get as jest.Mock).mockResolvedValue(mockWorkouts);

		const res = await getUserWorkouts();

		expect(ApiClient.get).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans`);
		expect(res).toEqual(mockWorkouts);
	});

	it("should throw error for get user workouts", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.get as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await getUserWorkouts();

		expect(ApiClient.get).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans`);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});

	it("should get a workout plan", async () => {
		(ApiClient.get as jest.Mock).mockResolvedValue(mockWorkout);

		const res = await getWorkout("1");

		expect(ApiClient.get).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans/1`);
		expect(res).toEqual(mockWorkout);
	});

	it("should throw error for get workout plan", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.get as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await getWorkout("1");

		expect(ApiClient.get).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans/1`);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});

	it("should create workout plan", async () => {
		(ApiClient.post as jest.Mock).mockResolvedValue(mockWorkout);

		const res = await createWorkout(mockWorkoutRequest);

		expect(ApiClient.post).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans`,
			JSON.stringify(mockWorkoutRequest)
		);
		expect(res).toEqual(mockWorkout);
	});

	it("should throw error for create workout plan", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.post as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await createWorkout(mockWorkoutRequest);

		expect(ApiClient.post).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans`,
			JSON.stringify(mockWorkoutRequest)
		);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});

	it("should update workout plan", async () => {
		(ApiClient.put as jest.Mock).mockResolvedValue(mockWorkout);

		const res = await updateWorkout("1", mockWorkoutRequest);

		expect(ApiClient.put).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans/1`,
			JSON.stringify(mockWorkoutRequest)
		);
		expect(res).toEqual(mockWorkout);
	});

	it("should throw error for update workout plan", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.put as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await updateWorkout("1", mockWorkoutRequest);

		expect(ApiClient.put).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans/1`,
			JSON.stringify(mockWorkoutRequest)
		);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});

	it("should delete workout plan", async () => {
		(ApiClient.delete as jest.Mock).mockResolvedValue({});

		const res = await deleteWorkout("1");

		expect(ApiClient.delete).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans/1`);
		expect(res).toEqual({});
	});

	it("should throw error for delete workout plan", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.delete as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await deleteWorkout("1");

		expect(ApiClient.delete).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/workout-plans/1`);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});
});
