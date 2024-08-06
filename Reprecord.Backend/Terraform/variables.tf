variable "google_client_id" {
  description = "Google app client ID"
}

variable "google_client_secret" {
  description = "Google app client secret"
}

variable "aws_region" {
  description = "AWS region"
}

variable "user_pool_name" {
  description = "Cognito User Pool name"
}

variable "domain_name" {
  description = "Cognito domain name"
}

variable "client_name" {
  description = "Cognito client name"
}

variable "callback_url" {
  description = "Cognito callback URL"
}

variable "logout_url" {
  description = "Cognito logout URL"
}

variable "google_project_id" {
  description = "Google project ID"
  default     = "reprecord-gcp"
}
