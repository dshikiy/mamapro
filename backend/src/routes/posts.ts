import express from 'express';
import * as postController from '../controllers/postController';
import { authMiddleware, optionalAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', optionalAuth, postController.getPosts);
router.post('/', authMiddleware, postController.createPost);

router.post('/:postId/like', authMiddleware, postController.toggleLike);
router.get('/:postId/comments', optionalAuth, postController.getComments);
router.post('/:postId/comments', authMiddleware, postController.addComment);

export default router;
