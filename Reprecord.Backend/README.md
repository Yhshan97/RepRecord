
### Local setup for API development

1. Install Docker and Docker Compose
2. Run `docker-compose up --build`
3. Install aws-cli and configure it with your aws account `aws configure`
4. Run scripts in `scripts/` to setup the database `./scripts/create_tables.sh`
5. Can use NoSQL Workbench to connect/view the mock database

.env must be filled out according to the environment you are running in.
