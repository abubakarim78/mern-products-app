import express from 'express';
import { cacheMiddleware } from '../middleware/cache.js';
import { getProducts } from '../controllers/products.controllers.js';

const cacheRouter = express.Router();

cacheRouter.get('/', cacheMiddleware(300), getProducts);

export default cacheRouter;