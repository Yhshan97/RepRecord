import * as dotenv from "dotenv";
import * as path from "path";
// Load the .env file
const env = process.env.NODE_ENV || "localdevelopment";
const envPath = path.resolve(__dirname, `../env/.env.${env}`);
dotenv.config({ path: envPath });

import config from "config";
import cors from "cors";
import express from "express";
import * as OpenApiValidator from "express-openapi-validator";
import { swaggerUi, swaggerDocument } from "./middleware/swagger";
import { authenticateToken } from "./middleware/auth";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

const app = express();
const port = config.get<number>("app.port");

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for adding security headers
app.use(helmet());

// Rate limiting middleware
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		limit: 100,
		standardHeaders: "draft-7",
		legacyHeaders: false,
		message: "Too many requests, please try again later.",
	})
);

app.set("trust proxy", 1);

// Enable Swagger and logging in development mode
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "localdevelopment") {
	// Enable CORS for all routes
	app.use(cors());
	app.options("*", cors());

	// Request logging middleware
	app.use((req, _, next) => {
		console.log(`\n${req.method} ${req.path}\nBody: ${JSON.stringify(req.body, null, 2)}`);
		next();
	});

	// Swagger documentation route
	app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
}

// Authenticate token for all other routes
app.use((req, res, next) => {
	if (req.path.startsWith("/api/auth/")) {
		return next(); // Bypass authentication for these routes
	}
	authenticateToken(req, res, next);
});

app.use(
	OpenApiValidator.middleware({
		apiSpec: swaggerDocument,
		operationHandlers: path.join(__dirname), // route handlers
		validateResponses: true, // default false
		validateApiSpec: true, // default false
	})
);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
	console.error(err);
	res.status((err as any).status || 500).send(err.message);
});

// Export the app instance for testing
export { app };

// Start the server only if not in a test environment
if (process.env.NODE_ENV !== "test") {
	app.listen(port, () => {
		console.log(`Server running at http://localhost:${port}`);
	});
}
