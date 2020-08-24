import * as dotenv from 'dotenv'

dotenv.config();

const config = require('config');
import 'reflect-metadata'; // this shim is required
import { createExpressServer } from 'routing-controllers';
import * as swaggerUiExpress from 'swagger-ui-express';
import generateOpenAPISpec from './openapi';


const routingControllersOptions = {
  controllers: [`${__dirname}/controllers/*.ts`, `${__dirname}/controllers/*.js`],
  middlewares: [`${__dirname}/controllers/middlewares/*.ts`, `${__dirname}/controllers/middlewares/*.js`],
  defaultErrorHandler: false
};

const app = createExpressServer(routingControllersOptions);

// openapi
app.use(
  '/docs',
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(generateOpenAPISpec(routingControllersOptions)),
);

app.listen(config.get('app.port'));
