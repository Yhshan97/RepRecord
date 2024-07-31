import config from "config";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import * as path from "path";
import * as OpenApiValidator from "express-openapi-validator";
import { swaggerUi, swaggerDocument } from "./middleware/swagger";

// Load the .env file
const env = process.env.NODE_ENV || "localdevelopment";
const envPath = path.resolve(__dirname, `../env/.env.${env}`);
dotenv.config({ path: envPath });

const app = express();
const port = config.get<number>("app.port");

// Middleware for parsing JSON bodies
app.use(express.json());

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
}

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

// Start the server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
