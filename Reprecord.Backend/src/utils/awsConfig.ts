import config from "config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

// Export DynamoDB DocumentClient
export const dynamoDb = new DynamoDBClient({
	// region: process.env.AWS_REGION,
	endpoint: config.get<string>("db.host"),
});

// Export Cognito Identity Service Provider
export const cognito = new CognitoIdentityClient({
	// region: process.env.AWS_REGION,
});

const env = process.env.NODE_ENV;

export const dynamoTables = {
	WorkoutPlan: { name: `${env}_WorkoutPlans`, GSI: [""] },
	Exercise: { name: `${env}_Exercises`, GSI: ["workoutIDIndex"] },
	Log: { name: `${env}_Logs`, GSI: ["exerciseIDIndex"] },
};
