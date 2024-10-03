import request from "supertest";
import express, { Express } from "express";
import helmet from "helmet";

describe("Helmet Middleware", () => {
	let app: Express;

	beforeEach(() => {
		app = express();

		app.use(helmet());
		app.get("/", (_, res) => res.send("Test route"));
	});

	it("should include security headers", async () => {
		const res = await request(app).get("/");

		expect(res.headers["x-dns-prefetch-control"]).toBe("off");
		expect(res.headers["x-frame-options"]).toBe("SAMEORIGIN");
		expect(res.headers["x-xss-protection"]).toBe("0");
		expect(res.headers["content-security-policy"]).toBeDefined();
	});
});
