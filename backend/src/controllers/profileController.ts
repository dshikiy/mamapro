import { Request, Response } from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// ─── GET /api/profile ─────────────────────────────────────────────────────────
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const [userResult, subResult, appointmentsResult, paymentsResult] = await Promise.all([
    query('SELECT id, email, name, role, avatar, bio, subscription, created_at FROM users WHERE id = $1', [userId]),
    query(
      `SELECT * FROM subscriptions WHERE user_id = $1 AND active = true ORDER BY start_date DESC LIMIT 1`,
      [userId]
    ),
    query(
      `SELECT a.*, s.name as specialist_name, s.avatar as specialist_avatar
       FROM appointments a JOIN specialists s ON a.specialist_id = s.id
       WHERE a.user_id = $1 ORDER BY a.date_time DESC LIMIT 5`,
      [userId]
    ),
    query(
      `SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
      [userId]
    )
  ]);

  if (userResult.rows.length === 0) throw new AppError(404, 'Пользователь не найден');

  res.status(200).json({
    success: true,
    data: {
      user: userResult.rows[0],
      subscription: subResult.rows[0] || null,
      recentAppointments: appointmentsResult.rows,
      recentPayments: paymentsResult.rows
    }
  });
});

// ─── PUT /api/profile ─────────────────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { name, bio, avatar } = req.body;

  // Update user record
  const result = await query(
    `UPDATE users SET name = COALESCE($1, name), bio = COALESCE($2, bio), avatar = COALESCE($3, avatar), updated_at = NOW()
     WHERE id = $4 RETURNING id, email, name, role, avatar, bio, subscription`,
    [name, bio, avatar, userId]
  );

  // If user is a specialist, sync name and avatar to specialists table
  if (result.rows[0].role === 'specialist') {
    await query(
      `UPDATE specialists SET name = COALESCE($1, name), avatar = COALESCE($2, avatar) WHERE user_id = $3`,
      [name, avatar, userId]
    );
  }

  res.status(200).json({ success: true, data: result.rows[0] });
});

// ─── GET /api/profile/diary ──────────────────────────────────────────────────
export const getDiaryEntries = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const result = await query(
    'SELECT * FROM diary_entries WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );

  res.status(200).json({ success: true, data: result.rows });
});

// ─── POST /api/profile/diary ─────────────────────────────────────────────────
export const createDiaryEntry = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { text, mood } = req.body;

  if (!text?.trim()) throw new AppError(400, 'Текст записи обязателен');

  const id = uuidv4();
  const result = await query(
    `INSERT INTO diary_entries (id, user_id, text, mood, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
    [id, userId, text.trim(), mood || null]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

export const updateDiaryEntry = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { text, mood } = req.body;

  if (!text?.trim()) throw new AppError(400, 'Текст записи обязателен');

  const result = await query(
    `UPDATE diary_entries SET text = $1, mood = $2 WHERE id = $3 AND user_id = $4 RETURNING *`,
    [text.trim(), mood || null, id, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, 'Запись не найдена');
  }

  res.status(200).json({ success: true, data: result.rows[0] });
});

export const deleteDiaryEntry = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const result = await query(
    'DELETE FROM diary_entries WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, 'Запись не найдена');
  }

  res.status(200).json({ success: true, message: 'Запись удалена' });
});

// ─── POST /api/profile/subscribe ─────────────────────────────────────────────
export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { plan } = req.body; // 'basic' | 'pro'

  if (!['basic', 'pro'].includes(plan)) throw new AppError(400, 'Недействительный план подписки');

  const planPrices: Record<string, number> = { basic: 10000, pro: 25000 };
  const appointmentLimits: Record<string, number | null> = { basic: 3, pro: null };
  const price = planPrices[plan];

  // Deactivate existing subscriptions
  await query('UPDATE subscriptions SET active = false WHERE user_id = $1', [userId]);

  // Create new subscription
  const subId = uuidv4();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  await query(
    `INSERT INTO subscriptions (id, user_id, plan, start_date, end_date, active, appointments_used, appointments_limit)
     VALUES ($1, $2, $3, NOW(), $4, true, 0, $5)`,
    [subId, userId, plan, endDate, appointmentLimits[plan]]
  );

  // Update user's subscription field
  await query(`UPDATE users SET subscription = $1, updated_at = NOW() WHERE id = $2`, [plan, userId]);

  // Record payment
  const paymentId = uuidv4();
  await query(
    `INSERT INTO payments (id, user_id, amount, type, reference_id, status, description, created_at)
     VALUES ($1, $2, $3, 'subscription', $4, 'completed', $5, NOW())`,
    [paymentId, userId, price, subId, `Подписка ${plan === 'pro' ? 'Pro' : 'Стандарт'}`]
  );

  res.status(201).json({
    success: true,
    message: `Подписка ${plan} активирована до ${endDate.toLocaleDateString('ru')}!`,
    data: { plan, endDate, price }
  });
});
