import express from 'express';
import { createProduct, getProducts, updateProduct, getProductId, deleteProduct } from '../controllers/products.controllers.js';

const productsRouter = express.Router();

productsRouter.get("/", getProducts)
productsRouter.post("/", createProduct)
productsRouter.get("/:id", getProductId)
productsRouter.put("/:id", updateProduct)
productsRouter.delete("/:id", deleteProduct)

export default productsRouter;