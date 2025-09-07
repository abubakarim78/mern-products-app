import express from 'express';
import { createProduct, getProducts, updateProduct, getProductId, deleteProduct } from '../controllers/products.controllers.js';
import { authenticate, authorize } from '../middleware/authenticate.js';

const productsRouter = express.Router();

productsRouter.get("/", getProducts)
productsRouter.post("/", authenticate, authorize('admin'), createProduct)
productsRouter.get("/:id", authenticate, getProductId)
productsRouter.put("/:id", authenticate, updateProduct)
productsRouter.delete("/:id", authenticate, deleteProduct)

export default productsRouter;