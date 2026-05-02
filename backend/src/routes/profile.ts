import express from 'express';
import * as profileController from '../controllers/profileController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, profileController.getProfile);
router.put('/', authMiddleware, profileController.updateProfile);
router.get('/diary', authMiddleware, profileController.getDiaryEntries);
router.post('/diary', authMiddleware, profileController.createDiaryEntry);
router.put('/diary/:id', authMiddleware, profileController.updateDiaryEntry);
router.delete('/diary/:id', authMiddleware, profileController.deleteDiaryEntry);
router.post('/subscribe', authMiddleware, profileController.subscribe);

export default router;
