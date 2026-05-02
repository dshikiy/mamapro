import { Request, Response } from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const fetchSpecialistByUser = async (userId: string) => {
  const result = await query('SELECT id FROM specialists WHERE user_id = $1', [userId]);
  if (result.rows.length === 0) {
    throw new AppError(403, 'Только специалисты могут управлять расписанием.');
  }
  return result.rows[0].id as string;
};

export const createSpecialist = asyncHandler(async (req: Request, res: Response) => {
  const { name, title, bio, avatar, specialty, price } = req.body;
  const id = uuidv4();

  const result = await query(
    `INSERT INTO specialists (id, user_id, name, title, bio, avatar, specialty, rating, price, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
     RETURNING *`,
    [id, req.user!.userId, name, title, bio, avatar, specialty, 5.0, price]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

export const getSpecialists = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(`
    SELECT s.*, 
           COALESCE(json_agg(json_build_object(
             'id', ts.id,
             'slot_date', ts.slot_date,
             'slot_time', ts.slot_time,
             'is_booked', ts.is_booked
           ) ORDER BY ts.slot_date, ts.slot_time) FILTER (WHERE ts.id IS NOT NULL), '[]') as slots
    FROM specialists s
    LEFT JOIN time_slots ts ON s.id = ts.specialist_id AND ts.slot_date >= CURRENT_DATE
    GROUP BY s.id
    ORDER BY s.rating DESC
  `);

  res.status(200).json({
    success: true,
    data: result.rows,
  });
});


export const getSpecialistById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await query(
    `SELECT s.*, COALESCE(json_agg(json_build_object(
       'id', ts.id,
       'slot_date', ts.slot_date,
       'slot_time', ts.slot_time,
       'is_booked', ts.is_booked
     )) FILTER (WHERE ts.id IS NOT NULL), '[]') AS slots
     FROM specialists s
     LEFT JOIN time_slots ts ON ts.specialist_id = s.id
     WHERE s.id = $1
     GROUP BY s.id`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Specialist not found' });
  }

  res.status(200).json({ success: true, data: result.rows[0] });
});

export const getMySlots = asyncHandler(async (req: Request, res: Response) => {
  const specialistId = await fetchSpecialistByUser(req.user!.userId);
  const result = await query(
    'SELECT * FROM time_slots WHERE specialist_id = $1 ORDER BY slot_date, slot_time',
    [specialistId]
  );

  res.status(200).json({ success: true, data: result.rows });
});

export const createMySlot = asyncHandler(async (req: Request, res: Response) => {
  const specialistId = await fetchSpecialistByUser(req.user!.userId);
  const { slot_date, slot_time } = req.body as { slot_date?: string; slot_time?: string };

  if (!slot_date || !slot_time) {
    throw new AppError(400, 'Дата и время слота обязательны.');
  }

  const parsedDate = new Date(slot_date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError(400, 'Неверный формат даты.');
  }

  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(slot_time)) {
    throw new AppError(400, 'Неверный формат времени. Используйте HH:MM.');
  }

  const result = await query(
    `INSERT INTO time_slots (id, specialist_id, slot_date, slot_time, is_booked, created_at)
     VALUES (gen_random_uuid(), $1, $2, $3, false, NOW())
     RETURNING *`,
    [specialistId, slot_date, slot_time]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

export const deleteMySlot = asyncHandler(async (req: Request, res: Response) => {
  const specialistId = await fetchSpecialistByUser(req.user!.userId);
  const { slotId } = req.params;

  const slotResult = await query(
    'SELECT * FROM time_slots WHERE id = $1 AND specialist_id = $2',
    [slotId, specialistId]
  );

  if (slotResult.rows.length === 0) {
    throw new AppError(404, 'Слот не найден');
  }

  const slot = slotResult.rows[0];
  if (slot.is_booked) {
    throw new AppError(409, 'Невозможно удалить забронированный слот');
  }

  await query('DELETE FROM time_slots WHERE id = $1', [slotId]);

  res.status(200).json({ success: true, message: 'Слот удалён' });
});

export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await query(
    `SELECT s.*, u.email, u.name as user_name, u.avatar as user_avatar 
     FROM specialists s 
     JOIN users u ON s.user_id = u.id 
     WHERE s.user_id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, 'Профиль специалиста не найден');
  }

  res.status(200).json({ success: true, data: result.rows[0] });
});

export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { title, bio, specialty, price, avatar } = req.body;

  const result = await query(
    `UPDATE specialists 
     SET title = COALESCE($1, title), 
         bio = COALESCE($2, bio), 
         specialty = COALESCE($3, specialty), 
         price = COALESCE($4, price),
         avatar = COALESCE($5, avatar)
     WHERE user_id = $6 
     RETURNING *`,
    [title, bio, specialty, price, avatar, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, 'Профиль специалиста не найден');
  }

  res.status(200).json({ success: true, data: result.rows[0] });
});

