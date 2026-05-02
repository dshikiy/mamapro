import express from 'express';
import * as adminController from '../controllers/adminController';
import { authMiddleware, isAdminOrSpecialist } from '../middleware/auth';

const router = express.Router();

// Shared Course Management (Admin & Specialist)
router.post('/courses', authMiddleware, isAdminOrSpecialist, adminController.createCourse);
router.put('/courses/:id', authMiddleware, isAdminOrSpecialist, adminController.updateCourse);
router.delete('/courses/:id', authMiddleware, isAdminOrSpecialist, adminController.deleteCourse);

router.post('/courses/:courseId/lessons', authMiddleware, isAdminOrSpecialist, adminController.addLesson);
router.put('/lessons/:id', authMiddleware, isAdminOrSpecialist, adminController.updateLesson);
router.delete('/lessons/:id', authMiddleware, isAdminOrSpecialist, adminController.deleteLesson);

export default router;
