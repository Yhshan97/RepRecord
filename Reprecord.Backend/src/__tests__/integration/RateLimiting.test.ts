import request from "supertest";
import express, { Express } from "express";
import rateLimit from "express-rate-limit";

describe("Rate Limiter Middleware", () => {
	let app: Express;

	beforeEach(() => {
		app = express();
		const limiter = rateLimit({
			windowMs: 60 * 1000,
			max: 2,
			message: "Too many requests, please try again later.",
		});
		app.use(limiter);
		app.get("/", (_, res) => res.send("Test route"));
	});

	it("should allow requests under the rate limit", async () => {
		const res = await request(app).get("/");
		expect(res.statusCode).toBe(200);
	});

	it("should block requests over the rate limit", async () => {
		await request(app).get("/");
		await request(app).get("/");
		const res = await request(app).get("/");

		expect(res.statusCode).toBe(429);
		expect(res.text).toBe("Too many requests, please try again later.");
	});
});
