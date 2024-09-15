import request from "supertest";
import { app, server } from "../server";
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

afterAll((done) => {
	server.close(done);
});

describe("WorkoutPlans Controller", () => {
	const mockWorkoutID = uuidv4(); // Mock a UUID for workoutID

	describe("GET /workoutPlans", () => {
		it("should return all workout plans for a user", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({
				Items: [{ workoutID: mockWorkoutID, name: "Plan A" }],
			});

			const res = await request(app).get("/api/workout-plans").set("Authorization", "Bearer mock-token");

			expect(res.status).toBe(200);
			expect(res.body).toEqual([{ workoutID: mockWorkoutID, name: "Plan A" }]);
		});
	});

	describe("POST /workoutPlans", () => {
		it("should create a new workout plan", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({});

			const newPlan = { name: "Test Plan Title", description: "Test plan description" };

			const res = await request(app).post("/api/workout-plans").set("Authorization", "Bearer mock-token").send(newPlan);

			expect(res.status).toBe(201);
			expect(res.body).toMatchObject({
				workoutID: expect.any(String),
				userID: "mock-user-id",
				name: "Test Plan Title",
				description: "Test plan description",
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			});
			expect(uuidValidate(res.body.workoutID)).toBe(true);
		});
	});

	describe("GET /workoutPlans/:id", () => {
		it("should return a workout plan by ID", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({
				Item: { workoutID: mockWorkoutID, name: "Test Plan Title", userID: "mock-user-id" },
			});

			const res = await request(app).get(`/api/workout-plans/${mockWorkoutID}`).set("Authorization", "Bearer mock-token");

			expect(res.status).toBe(200);
			expect(res.body).toEqual({ workoutID: mockWorkoutID, name: "Test Plan Title", userID: "mock-user-id" });
		});

		it("should return 404 if workout plan not found", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({});

			const nonExistentID = uuidv4();
			const res = await request(app).get(`/api/workout-plans/${nonExistentID}`).set("Authorization", "Bearer mock-token");

			expect(res.status).toBe(404);
			expect(res.body).toEqual({ message: "Workout plan not found" });
		});
	});

	describe("PUT /workoutPlans/:id", () => {
		it("should update a workout plan by ID", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({
				Attributes: {
					workoutID: mockWorkoutID,
					name: "Updated Test Plan",
					description: "Updated Test description",
					updatedAt: "2024-01-01T12:00:00Z",
				},
			});
			const updatedPlan = { name: "Updated Test Plan", description: "Updated Test description" };

			const res = await request(app).put(`/api/workout-plans/${mockWorkoutID}`).set("Authorization", "Bearer mock-token").send(updatedPlan);

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({
				workoutID: mockWorkoutID,
				name: "Updated Test Plan",
				description: "Updated Test description",
				updatedAt: "2024-01-01T12:00:00Z",
			});
		});
	});

	describe("DELETE /workoutPlans/:id", () => {
		it("should delete a workout plan by ID", async () => {
			(dynamoDb.send as jest.Mock).mockResolvedValue({});

			const res = await request(app).delete(`/api/workout-plans/${mockWorkoutID}`).set("Authorization", "Bearer mock-token");

			expect(res.status).toBe(204);
		});
	});
});
