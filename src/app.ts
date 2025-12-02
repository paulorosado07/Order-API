import express from 'express';
import orderRouter from './routers/order.router';
import { errorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger';

const app = express();

app.use(express.json());

// Swagger em /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Versão da API
app.use('/order', orderRouter);

// Middleware global de erros
app.use(errorHandler);

export default app;
