import express from 'express';
import * as specialistController from '../controllers/specialistController';
import { authMiddleware, optionalAuth, isSpecialist } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, specialistController.createSpecialist);
router.get('/', optionalAuth, specialistController.getSpecialists);
router.get('/me', authMiddleware, specialistController.getMyProfile);
router.put('/me', authMiddleware, specialistController.updateMyProfile);
router.get('/me/slots', authMiddleware, specialistController.getMySlots);
router.post('/me/slots', authMiddleware, specialistController.createMySlot);
router.delete('/me/slots/:slotId', authMiddleware, specialistController.deleteMySlot);
router.get('/:id', optionalAuth, specialistController.getSpecialistById);

export default router;
