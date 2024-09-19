import { Request, Response, NextFunction } from "express";
import { dynamoDb } from "../utils/awsConfig";
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { ReturnValue } from "@aws-sdk/client-dynamodb";

const TableName = "Logs";

export const logExercise = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { date, set, reps, weight } = req.body.log;
		const exerciseID = req.params.id;
		const log = { id: uuidv4(), exerciseID, date, set, reps, weight };
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
		const logs: never[] = [];
		res.status(200).json(logs);
	} catch (err) {
		next(err);
	}
};

export const getLogById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const log = { id: req.params.id, date: "2023-01-01" };
		res.status(200).json(log);
	} catch (err) {
		next(err);
	}
};

export const updateLogById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Implement logic to update a log by ID
		const updatedLog = req.body;
		res.status(200).json(updatedLog);
	} catch (err) {
		next(err);
	}
};

export const deleteLogById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Implement logic to delete a log by ID
		res.status(204).send();
	} catch (err) {
		next(err);
	}
};
