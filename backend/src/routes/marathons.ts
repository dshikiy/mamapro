import express from 'express';
import * as marathonController from '../controllers/marathonController';
import { authMiddleware, optionalAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', optionalAuth, marathonController.getMarathons);
router.post('/:id/enroll', authMiddleware, marathonController.enrollMarathon);
router.put('/:id/progress', authMiddleware, marathonController.updateProgress);

export default router;
