import { Request, Response, NextFunction } from "express";
import { dynamoDb } from "../utils/awsConfig";
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { ReturnValue } from "@aws-sdk/client-dynamodb";

const TableName = "Exercises";
const IndexName = "workoutIDIndex";

export const getPlanExercises = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const workoutID = req.params.id;
		const userID = req.userID;
		
		// Validate workout plan exists
		const workoutPlanParams = {
			TableName: "WorkoutPlans",
			Key: { userID, workoutID },
		};

		const getWorkoutPlanCommand = new GetCommand(workoutPlanParams);
		const workoutPlan = await dynamoDb.send(getWorkoutPlanCommand);
		if (!workoutPlan.Item) {
			return res.status(404).json({ message: "Workout plan not found" });
		}
		const params = {
			TableName,
			IndexName,
			KeyConditionExpression: "#workoutID = :workoutID",
			ExpressionAttributeNames: {
				"#workoutID": "workoutID",
			},
			ExpressionAttributeValues: {
				":workoutID": workoutID,
			},
		};

		const command = new QueryCommand(params);
		const result = await dynamoDb.send(command);

		res.status(200).json(result.Items);
	} catch (err) {
		next(err);
	}
};

export const addExerciseToWorkoutPlan = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { name, description } = req.body;
		const workoutID = req.params.id;
		const userID = req.userID;

		// Validate workout plan exists
		const workoutPlanParams = {
			TableName: "WorkoutPlans",
			Key: { userID, workoutID },
		};

		const getWorkoutPlanCommand = new GetCommand(workoutPlanParams);
		const workoutPlan = await dynamoDb.send(getWorkoutPlanCommand);
		if (!workoutPlan.Item) {
			return res.status(404).json({ message: "Workout plan not found" });
		}

		const exerciseItem = {
			exerciseID: uuidv4(),
			workoutID,
			name,
			description,
		};
		const params = {
			TableName,
			Item: exerciseItem,
			returnValues: "ALL_NEW",
		};

		const command = new PutCommand(params);
		await dynamoDb.send(command);

		res.status(201).json(exerciseItem);
	} catch (err) {
		next(err);
	}
};

export const updateExerciseById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const exercise = req.body;
		const params = {
			TableName,
			Key: { exerciseID: req.params.id },
			ConditionExpression: "attribute_exists(exerciseID)", // Item exists or throw
			UpdateExpression: "SET #name = :name, #description = :description",
			ExpressionAttributeNames: {
				"#name": "name",
				"#description": "description",
			},
			ExpressionAttributeValues: {
				":name": exercise.name,
				":description": exercise.description,
			},
			ReturnValues: ReturnValue.ALL_NEW,
		};

		const command = new UpdateCommand(params);
		const updatedExercise = await dynamoDb.send(command);

		res.status(200).send(updatedExercise.Attributes);
	} catch (err) {
		next(err);
	}
};

export const deleteExerciseById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const params = {
			TableName,
			Key: { exerciseID: req.params.id },
			ConditionExpression: "attribute_exists(exerciseID)",
		};

		const command = new DeleteCommand(params);
		await dynamoDb.send(command);

		res.status(204).send();
	} catch (err) {
		next(err);
	}
};
