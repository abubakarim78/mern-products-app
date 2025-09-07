import express from 'express';
import { getDashboardAnalytics } from '../controllers/analytics.controllers.js';

const analyticsRouter = express.Router();

// Example analytics route
analyticsRouter.get('/', getDashboardAnalytics);

export default analyticsRouter;