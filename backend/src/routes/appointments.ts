import express from 'express';
import * as appointmentController from '../controllers/appointmentController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All appointment routes require authentication
router.get('/', authMiddleware, appointmentController.getAppointments);
router.get('/specialist', authMiddleware, appointmentController.getSpecialistAppointments);
router.post('/', authMiddleware, appointmentController.createAppointment);
router.delete('/:id', authMiddleware, appointmentController.cancelAppointment);
router.get('/slots/:specialistId', appointmentController.getAvailableSlots);

export default router;