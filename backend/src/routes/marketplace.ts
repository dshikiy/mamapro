import express from 'express';
import * as marketplaceController from '../controllers/marketplaceController';
import { authMiddleware, optionalAuth } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, marketplaceController.createListing);
router.get('/', optionalAuth, marketplaceController.getListings);
router.get('/:id', optionalAuth, marketplaceController.getListingById);
router.put('/:id', authMiddleware, marketplaceController.updateListing);
router.delete('/:id', authMiddleware, marketplaceController.deleteListing);

export default router;
