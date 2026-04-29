import { Request, Response } from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../middleware/errorHandler';

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
           json_build_array(
             json_build_object('day', 'Monday', 'slots', '{"09:00", "14:00", "16:00"}'),
             json_build_object('day', 'Wednesday', 'slots', '{"10:00", "15:00"}'),
             json_build_object('day', 'Friday', 'slots', '{"09:00", "11:00", "14:00"}')
           ) as availability
    FROM specialists s
  `);

  res.status(200).json({
    success: true,
    data: result.rows,
  });
});

export const getSpecialistById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await query('SELECT * FROM specialists WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Specialist not found' });
  }

  res.status(200).json({ success: true, data: result.rows[0] });
});
