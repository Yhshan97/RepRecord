import { Request, Response, NextFunction } from "express";
import { dynamoDb, dynamoTables } from "../utils/awsConfig";
import { PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { ReturnValue } from "@aws-sdk/client-dynamodb";

const TableName = dynamoTables.Log.name;
const IndexName = dynamoTables.Log.GSI[0];

export const logExercise = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { date, sets } = req.body;
		const exerciseID = req.params.id;
		const log = { logID: uuidv4(), exerciseID, date, sets };
		const params = { TableName, Item: log };

		const command = new PutCommand(params);
		await dynamoDb.send(command);

		res.status(201).json(log);
	} catch (err) {
		next(err);
	}
};

export const getAllLogs = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const exerciseID = req.params.id;
		const limit = req.query.limit || 3;

		const params = {
			TableName,
			IndexName,
			KeyConditionExpression: "#exerciseID = :exerciseID",
			ExpressionAttributeNames: {
				"#exerciseID": "exerciseID",
			},
			ExpressionAttributeValues: {
				":exerciseID": exerciseID,
			},
			Limit: limit as number,
			ScanIndexForward: false, // Get latest logs first
		};

		const command = new QueryCommand(params);
		const result = await dynamoDb.send(command);

		res.status(200).json(result.Items);
	} catch (err) {
		next(err);
	}
};

export const updateLogById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const logID = req.params.id;
		const { date, sets } = req.body;
		const params = {
			TableName,
			Key: { logID },
			UpdateExpression: "SET #date = :date, #sets = :sets",
			ExpressionAttributeNames: {
				"#date": "date",
				"#sets": "sets",
			},
			ExpressionAttributeValues: {
				":date": date,
				":sets": sets,
			},
			ReturnValues: ReturnValue.ALL_NEW,
		};

		const command = new UpdateCommand(params);
		const updatedLog = await dynamoDb.send(command);

		res.status(200).send(updatedLog.Attributes);
	} catch (err) {
		next(err);
	}
};

export const deleteLogById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const logID = req.params.id;
		const params = { TableName, Key: { logID } };
		const command = new DeleteCommand(params);
		await dynamoDb.send(command);
		res.status(204).send();
	} catch (err) {
		next(err);
	}
};
