import request from "supertest";
import { app } from "../server";
import { dynamoDb } from "../utils/awsConfig";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

jest.mock("../utils/awsConfig", () => ({
	dynamoDb: {
		send: jest.fn(),
	},
	dynamoTables: {
		WorkoutPlan: { name: `local_WorkoutPlans`, GSI: [""] },
		Exercise: { name: `local_Exercises`, GSI: ["workoutIDIndex"] },
		Log: { name: `local_Logs`, GSI: ["exerciseIDIndex"] },
	}
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

describe("Exercise Controller", () => {
	const mockWorkoutID = uuidv4();

	describe("GET /workoutPlans/:id/exercises", () => {
		it("should return exercises for a workout plan", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({
				Item: {},
				Items: [
					{ exerciseID: "exercise1", name: "Push Up", description: "Upper body exercise" },
					{ exerciseID: "exercise2", name: "Squat", description: "Lower body exercise" },
				],
			});

			const res = await request(app).get(`/api/workout-plans/${mockWorkoutID}/exercises`).set("Authorization", "Bearer mock-token");

			expect(res.status).toBe(200);
			expect(res.body).toEqual([
				{ exerciseID: "exercise1", name: "Push Up", description: "Upper body exercise" },
				{ exerciseID: "exercise2", name: "Squat", description: "Lower body exercise" },
			]);
		});

		it("should return 404 from unknown workout plan", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({});

			const res = await request(app).get(`/api/workout-plans/${mockWorkoutID}/exercises`).set("Authorization", "Bearer mock-token");

			expect(res.status).toBe(404);
			expect(res.body).toEqual({ message: "Workout plan not found" });
		});
	});

	describe("POST /workoutPlans/:id/exercises", () => {
		it("should add a new exercise to a workout plan", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({
				Item: {},
			});

			const newExercise = { name: "Pull Up", description: "Upper body exercise" };

			const res = await request(app).post(`/api/workout-plans/${mockWorkoutID}/exercises`).set("Authorization", "Bearer mock-token").send(newExercise);

			expect(res.status).toBe(201);
			expect(res.body).toMatchObject({
				exerciseID: expect.any(String),
				workoutID: mockWorkoutID,
				name: "Pull Up",
				description: "Upper body exercise",
			});
			expect(uuidValidate(res.body.exerciseID)).toBe(true);
		});

		it("should return 404 from unknown workout plan", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({});

			const newExercise = { name: "Pull Up", description: "Upper body exercise" };

			const res = await request(app).post(`/api/workout-plans/${mockWorkoutID}/exercises`).set("Authorization", "Bearer mock-token").send(newExercise);

			expect(res.status).toBe(404);
			expect(res.body).toEqual({ message: "Workout plan not found" });
		});
	});

	describe("PUT /exercises/:id", () => {
		it("should update an exercise by ID", async () => {
			const exerciseID = uuidv4();
			(dynamoDb.send as jest.Mock).mockResolvedValue({
				Attributes: {
					exerciseID,
					name: "Updated Exercise",
					description: "Updated description",
				},
			});

			const updatedExercise = { name: "Updated Exercise", description: "Updated description" };

			const res = await request(app).put(`/api/exercises/${exerciseID}`).set("Authorization", "Bearer mock-token").send(updatedExercise);

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({
				exerciseID,
				name: "Updated Exercise",
				description: "Updated description",
			});
		});
	});

	describe("DELETE /exercises/:id", () => {
		it("should delete an exercise by ID", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({});
			const exerciseID = uuidv4();

			const res = await request(app).delete(`/api/exercises/${exerciseID}`).set("Authorization", "Bearer mock-token");

			expect(res.status).toBe(204);
		});
	});
});
