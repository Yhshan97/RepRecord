import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

// Load the OpenAPI specification from a YAML file
const swaggerDocument = YAML.load(path.join(__dirname, "../../openApi/openapi.yaml"));

export { swaggerUi, swaggerDocument };
