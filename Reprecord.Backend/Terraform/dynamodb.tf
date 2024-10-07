resource "aws_dynamodb_table" "workout_plans" {
  name           = "${var.environment}_WorkoutPlans"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "userID"
  range_key      = "workoutID"

  attribute {
    name = "userID"
    type = "S"
  }

  attribute {
    name = "workoutID"
    type = "S"
  }
}

resource "aws_dynamodb_table" "exercises" {
  name           = "${var.environment}_Exercises"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "exerciseID"

  attribute {
    name = "exerciseID"
    type = "S"
  }

  global_secondary_index {
    name               = "workoutIDIndex"
    hash_key           = "workoutID"
    projection_type    = "ALL"
    read_capacity      = 5
    write_capacity     = 5
  }
}

resource "aws_dynamodb_table" "logs" {
  name           = "${var.environment}_Logs"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "logID"

  attribute {
    name = "logID"
    type = "S"
  }

  global_secondary_index {
    name               = "exerciseIDIndex"
    hash_key           = "exerciseID"
    range_key          = "date"
    projection_type    = "ALL"
    read_capacity      = 5
    write_capacity     = 5
  }
}