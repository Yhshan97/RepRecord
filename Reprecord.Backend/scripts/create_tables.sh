#!/bin/bash

ENDPOINT_URL="http://localhost:8000"
export AWS_PAGER=""

# Confirmation prompt
read -p "Do you want to delete existing tables and recreate them? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Skipping table deletion."
else
    echo "Deleting and recreating tables..."

    aws dynamodb delete-table --table-name WorkoutPlans --endpoint-url $ENDPOINT_URL --output table
    aws dynamodb delete-table --table-name Exercises --endpoint-url $ENDPOINT_URL --output table
    aws dynamodb delete-table --table-name Logs --endpoint-url $ENDPOINT_URL --output table
fi

aws dynamodb create-table \
    --table-name WorkoutPlans \
    --attribute-definitions \
        AttributeName=userID,AttributeType=S \
        AttributeName=workoutID,AttributeType=S \
    --key-schema \
        AttributeName=userID,KeyType=HASH \
        AttributeName=workoutID,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --output table \
    --endpoint-url $ENDPOINT_URL

aws dynamodb create-table \
    --table-name Exercises \
    --attribute-definitions \
        AttributeName=workoutID,AttributeType=S \
        AttributeName=exerciseID,AttributeType=S \
    --key-schema \
        AttributeName=workoutID,KeyType=HASH \
        AttributeName=exerciseID,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --output table \
    --endpoint-url $ENDPOINT_URL

aws dynamodb create-table \
    --table-name Logs \
    --attribute-definitions \
        AttributeName=exerciseID,AttributeType=S \
        AttributeName=logID,AttributeType=S \
    --key-schema \
        AttributeName=exerciseID,KeyType=HASH \
        AttributeName=logID,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --output table \
    --endpoint-url $ENDPOINT_URL

echo "Tables created."