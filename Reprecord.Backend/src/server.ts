import express from "express";
import workoutPlansRoutes from "./routes/workoutPlansRoutes";
import exercisesRoutes from "./routes/exercisesRoutes";

import { swaggerUi, swaggerDocument } from "./middleware/swagger";

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/workout-plans", workoutPlansRoutes);
app.use("/api", exercisesRoutes);

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
