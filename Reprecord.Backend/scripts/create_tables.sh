#!/bin/bash

ENDPOINT_URL="http://localhost:8000"
ENV="localdevelopment"
export AWS_PAGER=""

# Confirmation prompt
read -p "Do you want to delete existing tables and recreate them? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Skipping table deletion."
else
    echo "Deleting and recreating tables..."

    aws dynamodb delete-table --table-name ${ENV}_WorkoutPlans --endpoint-url $ENDPOINT_URL --output table
    aws dynamodb delete-table --table-name ${ENV}_Exercises --endpoint-url $ENDPOINT_URL --output table
    aws dynamodb delete-table --table-name ${ENV}_Logs --endpoint-url $ENDPOINT_URL --output table
fi

aws dynamodb create-table \
    --table-name ${ENV}_WorkoutPlans \
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
    --table-name ${ENV}_Exercises \
    --attribute-definitions \
        AttributeName=exerciseID,AttributeType=S \
        AttributeName=workoutID,AttributeType=S \
    --key-schema \
        AttributeName=exerciseID,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --global-secondary-indexes \
        IndexName=workoutIDIndex,KeySchema=["{AttributeName=workoutID,KeyType=HASH}"],Projection="{ProjectionType=ALL}",ProvisionedThroughput="{ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    --output table \
    --endpoint-url $ENDPOINT_URL

aws dynamodb create-table \
    --table-name ${ENV}_Logs \
    --attribute-definitions \
        AttributeName=logID,AttributeType=S \
        AttributeName=exerciseID,AttributeType=S \
        AttributeName=date,AttributeType=S \
    --key-schema \
        AttributeName=logID,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --global-secondary-indexes \
        IndexName=exerciseIDIndex,KeySchema=["{AttributeName=exerciseID,KeyType=HASH},{AttributeName=date, KeyType=RANGE}"],Projection="{ProjectionType=ALL}",ProvisionedThroughput="{ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    --output table \
    --endpoint-url $ENDPOINT_URL

echo "Tables created."