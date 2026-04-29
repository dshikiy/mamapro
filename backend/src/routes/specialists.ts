import express from 'express';
import * as specialistController from '../controllers/specialistController';
import { authMiddleware, optionalAuth } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, specialistController.createSpecialist);
router.get('/', optionalAuth, specialistController.getSpecialists);
router.get('/:id', optionalAuth, specialistController.getSpecialistById);

export default router;
