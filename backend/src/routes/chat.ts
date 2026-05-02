import express from 'express';
import * as chatController from '../controllers/chatController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/conversations', chatController.getConversations);
router.get('/messages/:conversationId', chatController.getMessages);
router.get('/users/search', chatController.searchUsers);

router.post('/start', chatController.startConversation);
router.post('/message', chatController.sendMessage);

router.patch('/request/:conversationId', chatController.handleRequest);

export default router;
