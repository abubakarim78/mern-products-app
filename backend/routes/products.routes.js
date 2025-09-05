import express from 'express';
import { createProduct, getProducts, updateProduct, getProductId, deleteProduct } from '../controllers/products.controllers.js';
import { authenticate, authorize } from '../middleware/authenticate.js';

const productsRouter = express.Router();

productsRouter.get("/", getProducts)
productsRouter.post("/", authenticate, authorize, createProduct)
productsRouter.get("/:id", getProductId)
productsRouter.put("/:id", updateProduct)
productsRouter.delete("/:id", deleteProduct)

export default productsRouter;