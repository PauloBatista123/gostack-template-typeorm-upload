import { Router } from 'express';
import CreateCategoryService from '../services/CreateCategoryService';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const categorysRouter = Router();

categorysRouter.get('/', async (request, response) => {
  // TODO
});

categorysRouter.post('/', async (request, response) => {
    
    try {
        const {title} = request.body;

        const createCategory = new CreateCategoryService();
    
        const category = await createCategory.execute({
            title
        });
    
        return response.json(category);

    } catch (error) {
        return response.status(401).json({
            status: 'error',
            message: error.message,
          });
    }

});

categorysRouter.delete('/:id', async (request, response) => {
  // TODO
});

export default categorysRouter;
