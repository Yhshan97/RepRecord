import { getExerciseLogs, createExerciseLog, updateLog, deleteLog } from "../LogController";
import ApiClient from "../../services/ApiClient";

jest.mock("../../services/ApiClient");

describe("LogController", () => {
	const mockSet = {
		setNumber: 1,
		reps: 10,
		weight: 50,
	};

	const mockLog = {
		id: "3",
		exerciseId: "2",
		date: "2025-01-01",
		sets: [mockSet],
	};

	const mockLogs = [mockLog];
	const mockLogRequest = {
		date: "2025-01-01",
		sets: [mockSet],
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should get exercise logs", async () => {
		(ApiClient.get as jest.Mock).mockResolvedValue(mockLogs);

		const res = await getExerciseLogs("1");

		expect(ApiClient.get).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/exercises/1/logs`);
		expect(res).toEqual(mockLogs);
	});

	it("should throw error for get exercise logs", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.get as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await getExerciseLogs("1");

		expect(ApiClient.get).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/exercises/1/logs`);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});

	it("should create exercise log", async () => {
		(ApiClient.post as jest.Mock).mockResolvedValue(mockLog);

		const res = await createExerciseLog("1", mockLogRequest);

		expect(ApiClient.post).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/exercises/1/logs`,
			JSON.stringify(mockLogRequest)
		);
		expect(res).toEqual(mockLog);
	});

	it("should throw error for create exercise log", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.post as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await createExerciseLog("1", mockLogRequest);

		expect(ApiClient.post).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/exercises/1/logs`,
			JSON.stringify(mockLogRequest)
		);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});

	it("should update log", async () => {
		(ApiClient.put as jest.Mock).mockResolvedValue(mockLog);

		const res = await updateLog("1", mockLogRequest);

		expect(ApiClient.put).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/logs/1`,
			JSON.stringify(mockLogRequest)
		);
		expect(res).toEqual(mockLog);
	});

	it("should throw error for update log", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.put as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await updateLog("1", mockLogRequest);

		expect(ApiClient.put).toHaveBeenCalledWith(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/logs/1`,
			JSON.stringify(mockLogRequest)
		);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});

	it("should delete log", async () => {
		(ApiClient.delete as jest.Mock).mockResolvedValue({});

		const res = await deleteLog("1");

		expect(ApiClient.delete).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/logs/1`);
		expect(res).toEqual({});
	});

	it("should throw error for delete log", async () => {
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		(ApiClient.delete as jest.Mock).mockRejectedValue(new Error("test error"));

		const res = await deleteLog("1");

		expect(ApiClient.delete).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_BASE_URL}/logs/1`);
		expect(spy).toHaveBeenCalledWith(new Error("test error"));
		expect(res).toBeUndefined();

		spy.mockRestore();
	});
});
