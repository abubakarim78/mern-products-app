import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controllers.js';
import { authenticate, authorize } from '../middleware/authenticate.js';

const categoryRouter = express.Router();

categoryRouter.post('/', authenticate, authorize('admin'), createCategory);
categoryRouter.get('/', getCategories);
categoryRouter.get('/:id', authenticate, getCategory);
categoryRouter.put('/:id', authenticate, authorize('admin'), updateCategory);
categoryRouter.delete('/:id', authenticate, authorize('admin'), deleteCategory);


export default categoryRouter;