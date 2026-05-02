import { Request, Response } from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// ─── GET /api/appointments (My appointments) ────────────────────────────────
export const getAppointments = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const result = await query(
    `SELECT a.*, 
            s.name as specialist_name, s.title as specialist_title,
            s.avatar as specialist_avatar, s.specialty as specialist_specialty,
            s.rating as specialist_rating, s.price as specialist_price
     FROM appointments a
     JOIN specialists s ON a.specialist_id = s.id
     WHERE a.user_id = $1
     ORDER BY a.date_time DESC`,
    [userId]
  );

  const appointments = result.rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    specialistId: row.specialist_id,
    specialist: {
      id: row.specialist_id,
      name: row.specialist_name,
      title: row.specialist_title,
      avatar: row.specialist_avatar,
      specialty: row.specialist_specialty,
      rating: row.specialist_rating,
      price: row.specialist_price,
      availability: []
    },
    dateTime: row.date_time,
    duration: row.duration,
    status: row.status,
    notes: row.notes,
    meetingLink: row.meeting_link,
    price: row.price
  }));

  res.status(200).json({ success: true, data: appointments });
});

// ─── GET /api/appointments/slots/:specialistId ───────────────────────────────
export const getAvailableSlots = asyncHandler(async (req: Request, res: Response) => {
  const { specialistId } = req.params;
  const { date } = req.query; // YYYY-MM-DD

  let sql = `
    SELECT * FROM time_slots 
    WHERE specialist_id = $1 AND is_booked = false
  `;
  const params: any[] = [specialistId];

  if (date) {
    sql += ` AND slot_date = $2`;
    params.push(date as string);
  } else {
    sql += ` AND slot_date >= CURRENT_DATE`;
  }

  sql += ` ORDER BY slot_date, slot_time LIMIT 50`;

  const result = await query(sql, params);
  res.status(200).json({ success: true, data: result.rows });
});

// ─── POST /api/appointments ──────────────────────────────────────────────────
export const createAppointment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { specialistId, slotId, notes } = req.body;

  // 1. Get user subscription
  const userResult = await query('SELECT subscription FROM users WHERE id = $1', [userId]);
  if (userResult.rows.length === 0) throw new AppError(404, 'Пользователь не найден');
  const userSubscription: string = userResult.rows[0].subscription;

  // 2. Check booking quota by subscription level
  if (userSubscription === 'free') {
    // Free users: only one trial session (5000 ₸) — allow but record payment
  } else if (userSubscription === 'basic') {
    // Basic (10 000 ₸ plan): up to 3 sessions
    const subResult = await query(
      `SELECT appointments_used, appointments_limit FROM subscriptions 
       WHERE user_id = $1 AND active = true ORDER BY start_date DESC LIMIT 1`,
      [userId]
    );
    if (subResult.rows.length > 0) {
      const { appointments_used, appointments_limit } = subResult.rows[0];
      if (appointments_limit !== null && appointments_used >= appointments_limit) {
        throw new AppError(403, 'Лимит встреч исчерпан. Улучшите подписку до Pro для безлимита.');
      }
    }
  }
  // Pro: unlimited — no quota check needed

  // 3. Get specialist and slot details
  const specialistResult = await query('SELECT * FROM specialists WHERE id = $1', [specialistId]);
  if (specialistResult.rows.length === 0) throw new AppError(404, 'Специалист не найден');
  const specialist = specialistResult.rows[0];

  let dateTime: Date;
  let slotDate: string | null = null;
  let slotTime: string | null = null;

  if (slotId) {
    const slotResult = await query(
      'SELECT * FROM time_slots WHERE id = $1 AND is_booked = false AND specialist_id = $2',
      [slotId, specialistId]
    );
    if (slotResult.rows.length === 0) {
      throw new AppError(409, 'Слот занят или не существует. Выберите другое время.');
    }
    const slot = slotResult.rows[0];
    slotDate = slot.slot_date;
    slotTime = slot.slot_time;
    dateTime = new Date(`${slot.slot_date}T${slot.slot_time}`);

    // Mark slot as booked
    await query('UPDATE time_slots SET is_booked = true WHERE id = $1', [slotId]);
  } else {
    // Fallback: use current date+1h (for testing)
    dateTime = new Date(Date.now() + 3600000);
  }

  // 4. Determine price
  let price = specialist.price;
  if (userSubscription === 'pro') price = 0;
  else if (userSubscription === 'basic') price = specialist.price; // covered by subscription

  // 5. Create appointment
  const id = uuidv4();
  const meetingLink = `https://meet.mampro.kz/room/${id.split('-')[0]}`;

  const result = await query(
    `INSERT INTO appointments 
     (id, user_id, specialist_id, date_time, duration, status, notes, time_slot_id, meeting_link, price, created_at)
     VALUES ($1, $2, $3, $4, 60, 'scheduled', $5, $6, $7, $8, NOW())
     RETURNING *`,
    [id, userId, specialistId, dateTime, notes || null, slotId || null, meetingLink, price]
  );

  // 6. Update appointments_used for basic subscribers
  if (userSubscription === 'basic') {
    await query(
      `UPDATE subscriptions SET appointments_used = appointments_used + 1 
       WHERE user_id = $1 AND active = true`,
      [userId]
    );
  }

  // 7. Record payment (simplified — no real payment gateway)
  if (price > 0) {
    const paymentId = uuidv4();
    await query(
      `INSERT INTO payments (id, user_id, amount, type, reference_id, status, description, created_at)
       VALUES ($1, $2, $3, 'appointment', $4, 'completed', $5, NOW())`,
      [paymentId, userId, price, id, `Запись к специалисту: ${specialist.name}`]
    );
    await query('UPDATE appointments SET payment_id = $1 WHERE id = $2', [paymentId, id]);
  }

  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: `Вы успешно записаны! Ссылка на встречу: ${meetingLink}`
  });
});

// ─── DELETE /api/appointments/:id (Cancel) ───────────────────────────────────
export const cancelAppointment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  // Release the time slot if linked
  const apptResult = await query(
    'SELECT * FROM appointments WHERE id = $1 AND user_id = $2',
    [id, userId]
  );

  if (apptResult.rows.length === 0) {
    throw new AppError(404, 'Запись не найдена');
  }

  const appt = apptResult.rows[0];
  if (appt.time_slot_id) {
    await query('UPDATE time_slots SET is_booked = false WHERE id = $1', [appt.time_slot_id]);
  }

  // Restore appointment quota for basic user if applicable
  const userResult = await query('SELECT subscription FROM users WHERE id = $1', [userId]);
  if (userResult.rows[0].subscription === 'basic') {
    await query(
      `UPDATE subscriptions SET appointments_used = GREATEST(0, appointments_used - 1)
       WHERE user_id = $1 AND active = true`,
      [userId]
    );
  }

  await query(
    `UPDATE appointments SET status = 'cancelled' WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  res.status(200).json({ success: true, message: 'Запись отменена' });
});

export const getSpecialistAppointments = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  
  // Find specialist ID first
  const specResult = await query('SELECT id FROM specialists WHERE user_id = $1', [userId]);
  if (specResult.rows.length === 0) {
    throw new AppError(403, 'Доступ запрещен: вы не являетесь специалистом');
  }
  const specialistId = specResult.rows[0].id;

  const result = await query(
    `SELECT a.*, u.name as client_name, u.email as client_email, u.avatar as client_avatar
     FROM appointments a
     JOIN users u ON a.user_id = u.id
     WHERE a.specialist_id = $1
     ORDER BY a.date_time DESC`,
    [specialistId]
  );

  res.status(200).json({ success: true, data: result.rows });
});