import { Request, Response } from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// ─── GET /api/marathons ───────────────────────────────────────────────────────
export const getMarathons = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT m.*, 
            s.name as instructor_name, s.avatar as instructor_avatar, s.title as instructor_title
     FROM marathons m
     LEFT JOIN specialists s ON m.instructor_id = s.id
     WHERE m.is_active = true
     ORDER BY m.created_at DESC`
  );

  // If authenticated, include enrollment status
  const userId = req.user?.userId;
  if (userId) {
    const enrollments = await query(
      'SELECT marathon_id, current_day, completed FROM marathon_enrollments WHERE user_id = $1',
      [userId]
    );
    const enrollMap = new Map(enrollments.rows.map((e: any) => [e.marathon_id, e]));
    const marathonsWithStatus = result.rows.map((m: any) => ({
      ...m,
      enrollment: enrollMap.get(m.id) || null
    }));
    return res.status(200).json({ success: true, data: marathonsWithStatus });
  }

  res.status(200).json({ success: true, data: result.rows });
});

// ─── POST /api/marathons/:id/enroll ──────────────────────────────────────────
export const enrollMarathon = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id: marathonId } = req.params;

  // Check marathon exists
  const marathonResult = await query('SELECT * FROM marathons WHERE id = $1', [marathonId]);
  if (marathonResult.rows.length === 0) throw new AppError(404, 'Марафон не найден');
  const marathon = marathonResult.rows[0];

  // Check if already enrolled
  const existingResult = await query(
    'SELECT * FROM marathon_enrollments WHERE user_id = $1 AND marathon_id = $2',
    [userId, marathonId]
  );
  if (existingResult.rows.length > 0) {
    return res.status(200).json({ success: true, data: existingResult.rows[0], message: 'Уже записаны' });
  }

  // Check subscription vs price
  const userResult = await query('SELECT subscription FROM users WHERE id = $1', [userId]);
  const sub: string = userResult.rows[0].subscription;

  const isFree = sub === 'pro' || marathon.price === 0;

  if (!isFree) {
    // For now, assume payment processed externally; just record it
    const paymentId = uuidv4();
    await query(
      `INSERT INTO payments (id, user_id, amount, type, reference_id, status, description, created_at)
       VALUES ($1, $2, $3, 'marathon', $4, 'completed', $5, NOW())`,
      [paymentId, userId, marathon.price, marathonId, `Запись на марафон: ${marathon.title}`]
    );
  }

  // Create enrollment
  const enrollId = uuidv4();
  const result = await query(
    `INSERT INTO marathon_enrollments (id, user_id, marathon_id, current_day, completed)
     VALUES ($1, $2, $3, 1, false)
     RETURNING *`,
    [enrollId, userId, marathonId]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

// ─── PUT /api/marathons/:id/progress ─────────────────────────────────────────
export const updateProgress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id: marathonId } = req.params;
  const { currentDay } = req.body;

  const marathonResult = await query('SELECT duration_days FROM marathons WHERE id = $1', [marathonId]);
  if (marathonResult.rows.length === 0) throw new AppError(404, 'Марафон не найден');
  const totalDays = marathonResult.rows[0].duration_days;

  const completed = currentDay >= totalDays;

  const result = await query(
    `UPDATE marathon_enrollments 
     SET current_day = $1, completed = $2
     WHERE user_id = $3 AND marathon_id = $4
     RETURNING *`,
    [currentDay, completed, userId, marathonId]
  );

  if (result.rows.length === 0) throw new AppError(404, 'Запись на марафон не найдена');

  res.status(200).json({ success: true, data: result.rows[0] });
});
