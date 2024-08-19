#!/bin/bash

ENDPOINT_URL="http://localhost:8000"

# Setting AWS_PAGER="" to silently create tables

# Workouts Table
AWS_PAGER="" aws dynamodb create-table \
    --table-name Workouts \
    --attribute-definitions \
        AttributeName=WorkoutID,AttributeType=S \
        AttributeName=UserID,AttributeType=S \
    --key-schema \
        AttributeName=WorkoutID,KeyType=HASH \
        AttributeName=UserID,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --no-paginate \
    --endpoint-url $ENDPOINT_URL

# Exercises Table
AWS_PAGER="" aws dynamodb create-table \
    --table-name Exercises \
    --attribute-definitions \
        AttributeName=ExerciseID,AttributeType=S \
    --key-schema \
        AttributeName=ExerciseID,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --no-paginate \
    --endpoint-url $ENDPOINT_URL

# Logs Table
AWS_PAGER="" aws dynamodb create-table \
    --table-name Logs \
    --attribute-definitions \
        AttributeName=LogID,AttributeType=S \
        AttributeName=UserID,AttributeType=S \
    --key-schema \
        AttributeName=LogID,KeyType=HASH \
        AttributeName=UserID,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --no-paginate \
    --endpoint-url $ENDPOINT_URL