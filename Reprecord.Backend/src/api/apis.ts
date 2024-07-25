export * from './authenticationApi';
import { AuthenticationApi } from './authenticationApi';
export * from './exercisesApi';
import { ExercisesApi } from './exercisesApi';
export * from './logsApi';
import { LogsApi } from './logsApi';
export * from './usersApi';
import { UsersApi } from './usersApi';
export * from './workoutPlansApi';
import { WorkoutPlansApi } from './workoutPlansApi';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export { RequestFile } from '../model/models';

export const APIS = [AuthenticationApi, ExercisesApi, LogsApi, UsersApi, WorkoutPlansApi];
