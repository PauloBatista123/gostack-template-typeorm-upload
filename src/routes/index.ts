import { Router } from 'express';
import categorysRouter from './categorys.routes';

import transactionsRouter from './transactions.routes';

const routes = Router();

routes.use('/transactions', transactionsRouter);
routes.use('/categorys', categorysRouter);

export default routes;
