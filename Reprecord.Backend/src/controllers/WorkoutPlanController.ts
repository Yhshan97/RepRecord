import { Request, Response, NextFunction } from "express";
import { dynamoDb } from "../utils/awsConfig";
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, GetCommandInput } from "@aws-sdk/lib-dynamodb";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

const TableName = "WorkoutPlans";

export const getAllWorkoutPlans = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userID = req.userID;
		const params = {
			TableName,
			KeyConditionExpression: "#userID = :userID",
			ExpressionAttributeNames: {
				"#userID": "userID",
			},
			ExpressionAttributeValues: {
				":userID": userID,
			},
		};

		const command = new QueryCommand(params);
		const result = await dynamoDb.send(command);

		res.status(200).json(result.Items);
	} catch (err) {
		next(err);
	}
};

export const createWorkoutPlan = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, description } = req.body;
		const userID = req.userID;

		const workoutPlan = {
			workoutID: uuidv4(),
			userID,
			name,
			description,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		const params = {
			TableName,
			Item: workoutPlan,
		};

		const command = new PutCommand(params);
		await dynamoDb.send(command);

		res.status(201).json(workoutPlan);
	} catch (err) {
		next(err);
	}
};

export const getWorkoutPlanById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const params: GetCommandInput = {
			TableName,
			Key: { workoutID: req.params.id, userID: req.userID },
		};

		const command = new GetCommand(params);
		const result = await dynamoDb.send(command);

		if (!result.Item) {
			return res.status(404).json({ message: "Workout plan not found" });
		}

		res.status(200).json(result.Item);
	} catch (err) {
		next(err);
	}
};

export const updateWorkoutPlanById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Assume that the old values are passed
		// if unchanged as well as the new values
		const { name, description } = req.body;

		const params = {
			TableName,
			Key: { workoutID: req.params.id, userID: req.userID },
			UpdateExpression: "set #name = :name, #description = :description, #updatedAt = :updatedAt",
			ConditionExpression: "attribute_exists(workoutID)", // Item exists or throw
			ExpressionAttributeNames: {
				"#name": "name",
				"#description": "description",
				"#updatedAt": "updatedAt",
			},
			ExpressionAttributeValues: {
				":name": name,
				":description": description,
				":updatedAt": new Date().toISOString(),
			},
			ReturnValues: ReturnValue.ALL_NEW,
		};

		const command = new UpdateCommand(params);
		const result = await dynamoDb.send(command);

		res.status(200).json(result.Attributes);
	} catch (err) {
		next(err);
	}
};

export const deleteWorkoutPlanById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const params = {
			TableName,
			Key: { workoutID: req.params.id, userID: req.userID },
		};

		const command = new DeleteCommand(params);
		await dynamoDb.send(command);

		res.status(204).send();
	} catch (err) {
		next(err);
	}
};
