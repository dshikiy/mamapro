import express from 'express';
import * as adminController from '../controllers/adminController';
import { authMiddleware, isAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/users', authMiddleware, isAdmin, adminController.getAllUsers);
router.put('/users/:id/role', authMiddleware, isAdmin, adminController.updateUserRole);
router.delete('/users/:id', authMiddleware, isAdmin, adminController.deleteUser);

router.get('/stats', authMiddleware, isAdmin, adminController.getAdminStats);

router.get('/listings', authMiddleware, isAdmin, adminController.getAllListings);
router.delete('/listings/:id', authMiddleware, isAdmin, adminController.deleteListing);

router.post('/courses', authMiddleware, isAdmin, adminController.createCourse);
router.put('/courses/:id', authMiddleware, isAdmin, adminController.updateCourse);
router.delete('/courses/:id', authMiddleware, isAdmin, adminController.deleteCourse);
router.post('/courses/:courseId/lessons', authMiddleware, isAdmin, adminController.addLesson);
router.put('/lessons/:id', authMiddleware, isAdmin, adminController.updateLesson);
router.delete('/lessons/:id', authMiddleware, isAdmin, adminController.deleteLesson);

router.patch('/specialists/:id/verify', authMiddleware, isAdmin, adminController.toggleSpecialistVerification);
router.post('/specialists', authMiddleware, isAdmin, adminController.createSpecialist);
router.get('/specialists', authMiddleware, isAdmin, adminController.getAllSpecialists);

router.get('/appointments', authMiddleware, isAdmin, adminController.getAllAppointments);
router.get('/marathons', authMiddleware, isAdmin, adminController.getAllMarathons);
router.post('/marathons', authMiddleware, isAdmin, adminController.createMarathon);
router.delete('/marathons/:id', authMiddleware, isAdmin, adminController.deleteMarathon);

export default router;
