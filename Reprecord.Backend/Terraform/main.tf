terraform {
  backend "remote" {}
}

provider "aws" {
  region = "us-east-2"
}

resource "aws_cognito_user_pool" "reprecord_pool" {
  name = var.user_pool_name
}

resource "aws_cognito_user_pool_domain" "up_domain" {
  domain       = var.domain_name
  user_pool_id = aws_cognito_user_pool.reprecord_pool.id
}

resource "aws_cognito_user_pool_client" "reprecord_client" {
  name            = var.client_name
  user_pool_id    = aws_cognito_user_pool.reprecord_pool.id
  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  callback_urls = [var.callback_url]
  logout_urls   = [var.logout_url]

  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  allowed_oauth_flows_user_pool_client = true
  supported_identity_providers         = ["Google"]
}

resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.reprecord_pool.id
  provider_name = "Google"
  provider_type = "Google"
  provider_details = {
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
    authorize_scopes = "openid email profile"
  }
  attribute_mapping = {
    email = "email"
    sub   = "sub"
  }
}

