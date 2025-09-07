import express from 'express';
import { authenticate, authorize } from '../middleware/authenticate.js';
import { createProduct } from '../controllers/products.controllers.js';
import { validateProduct } from '../middleware/validation.js';

const validationRouter = express.Router();

validationRouter.post('/', authenticate, authorize('admin'), validateProduct, createProduct);

export default validationRouter;