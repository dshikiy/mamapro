import express from 'express';
import * as courseController from '../controllers/courseController';
import { authMiddleware, optionalAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', optionalAuth, courseController.getCourses);
router.get('/:id', optionalAuth, courseController.getCourseById);
router.put('/:courseId/lessons/:lessonId/complete', authMiddleware, courseController.completeLesson);

export default router;
