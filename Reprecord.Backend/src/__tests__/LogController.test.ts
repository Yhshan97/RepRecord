import request from "supertest";
import { app } from "../server";
import { dynamoDb } from "../utils/awsConfig";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

// Mock AWS DynamoDB's send method
jest.mock("../utils/awsConfig", () => ({
	dynamoDb: {
		send: jest.fn(),
	},
}));

jest.mock("../middleware/auth", () => ({
	authenticateToken: (req: any, _: any, next: any) => {
		req.userID = "mock-user-id";
		next();
	},
}));

afterEach(() => {
	jest.clearAllMocks();
});

describe("Logs Controller", () => {
	const mockExerciseID = uuidv4(); // Mock a UUID for exerciseID
	const mockLogID = uuidv4(); // Mock a UUID for logID

	describe("POST /exercises/logs", () => {
		it("should create a new log entry for an exercise", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({});

			const newLog = {
				date: "2024-09-20",
				sets: [
					{ setNumber: 1, reps: 10, weight: 100 },
					{ setNumber: 2, reps: 8, weight: 105 },
				],
			};

			const res = await request(app).post(`/api/exercises/${mockExerciseID}/logs`).set("Authorization", "Bearer mock-token").send(newLog);

			expect(res.status).toBe(201);
			expect(res.body).toMatchObject({
				logID: expect.any(String),
				exerciseID: mockExerciseID,
				date: "2024-09-20",
				sets: [
					{ setNumber: 1, reps: 10, weight: 100 },
					{ setNumber: 2, reps: 8, weight: 105 },
				],
			});
			expect(uuidValidate(res.body.logID)).toBe(true);
		});
	});

	describe("GET /exercises/:id/logs", () => {
		it("should return all logs for an exercise", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({
				Items: [
					{
						logID: mockLogID,
						exerciseID: mockExerciseID,
						date: "2024-09-20",
						sets: [
							{ reps: 10, weight: 100 },
							{ reps: 8, weight: 105 },
						],
					},
				],
			});

			const res = await request(app).get(`/api/exercises/${mockExerciseID}/logs?limit=3`).set("Authorization", "Bearer mock-token");

			expect(res.status).toBe(200);
			expect(res.body).toEqual([
				{
					logID: mockLogID,
					exerciseID: mockExerciseID,
					date: "2024-09-20",
					sets: [
						{ reps: 10, weight: 100 },
						{ reps: 8, weight: 105 },
					],
				},
			]);
		});
	});

	describe("PUT /logs/:id", () => {
		it("should update a log entry by logID", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({
				Attributes: {
					logID: mockLogID,
					exerciseID: mockExerciseID,
					date: "2024-09-21",
					sets: [{ reps: 12, weight: 110 }],
				},
			});

			const updatedLog = {
				date: "2024-09-21",
				sets: [{ reps: 12, weight: 110 }],
			};

			const res = await request(app).put(`/api/logs/${mockLogID}`).set("Authorization", "Bearer mock-token").send(updatedLog);

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({
				logID: mockLogID,
				exerciseID: mockExerciseID,
				date: "2024-09-21",
				sets: [{ reps: 12, weight: 110 }],
			});
		});
	});

	describe("DELETE /logs/:id", () => {
		it("should delete a log entry by logID", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({});

			const res = await request(app).delete(`/api/logs/${mockLogID}`).set("Authorization", "Bearer mock-token");

			expect(res.status).toBe(204);
		});
	});
});
