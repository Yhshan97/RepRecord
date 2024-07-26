import express from 'express';
import workoutPlansRoutes from './routes/workoutPlansRoutes';
import exercisesRoutes from './routes/exercisesRoutes';
import config from 'config';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { swaggerUi, swaggerDocument } from './middleware/swagger';

// Load the .env file 
const env = process.env.NODE_ENV || 'localdevelopment';
const envPath = path.resolve(__dirname, `../env/.env.${env}`);
dotenv.config({ path: envPath });

const app = express();
const port = config.get<number>('app.port');

// Middleware for parsing JSON bodies
app.use(express.json());

// Enable Swagger and logging in development mode
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'localdevelopment') {
    // Request logging middleware
    app.use((req, _, next) => {
        console.log(`\n${req.method} ${req.path}\nBody: ${JSON.stringify(req.body, null, 2)}`);
        next();
    });

    // Swagger documentation route
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Route handlers
app.use('/api/workout-plans', workoutPlansRoutes);
app.use('/api', exercisesRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
