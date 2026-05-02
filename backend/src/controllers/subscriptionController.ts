import { Request, Response } from 'express';
import { query } from '../config/database';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const upgradeSubscription = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { plan = 'pro' } = req.body;

  if (plan !== 'pro') throw new AppError(400, 'Invalid plan');

  const result = await query(
    `UPDATE users SET subscription = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, name, subscription`,
    [plan, userId]
  );

  if (result.rows.length === 0) throw new AppError(404, 'User not found');

  res.status(200).json({ success: true, data: result.rows[0], message: 'Вы успешно перешли на PRO план!' });
});
