

module "naming" {
  aws_region     = "us-east-2"
  user_pool_name = "reprecord-pool-DEV"
  domain_name    = "reprecorddev"
  client_name    = "reprecord-client-dev"
  callback_url   = "https://localhost:3000/logged_in"
  logout_url     = "https://localhost:3000/logged_out"
}
