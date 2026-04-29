import express from 'express';
import * as courseController from '../controllers/courseController';
import { optionalAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', optionalAuth, courseController.getCourses);
router.get('/:id', optionalAuth, courseController.getCourseById);

export default router;
