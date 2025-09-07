import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders
} from '../controllers/order.controllers.js';
import { authenticate, authorize } from '../middleware/authenticate.js';

const orderRouter = express.Router();

orderRouter.post('/', authenticate, createOrder);
orderRouter.get('/my-orders', authenticate, getMyOrders);
orderRouter.get('/:id', authenticate, getOrder);
orderRouter.put('/:id/status', authenticate, authorize('admin'), updateOrderStatus);
orderRouter.get('/', authenticate, authorize('admin'), getAllOrders);

export default orderRouter;