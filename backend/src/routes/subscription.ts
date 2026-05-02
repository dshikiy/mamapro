import express from 'express';
import * as subscriptionController from '../controllers/subscriptionController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/upgrade', authMiddleware, subscriptionController.upgradeSubscription);

export default router;
