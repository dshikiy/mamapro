import { Request, Response } from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, dueDate } = req.body;
  const id = uuidv4();

  const result = await query(
    `INSERT INTO daily_tasks (id, user_id, title, description, due_date, completed, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     RETURNING *`,
    [id, req.user!.userId, title, description, new Date(dueDate), false]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT * FROM daily_tasks WHERE user_id = $1 ORDER BY due_date DESC`,
    [req.user!.userId]
  );

  res.status(200).json({ success: true, data: result.rows });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { completed } = req.body;

  const result = await query(
    `UPDATE daily_tasks SET completed = $1, completed_at = $2 WHERE id = $3 RETURNING *`,
    [completed, completed ? new Date() : null, id]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, 'Task not found');
  }

  res.status(200).json({ success: true, data: result.rows[0] });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query('DELETE FROM daily_tasks WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    throw new AppError(404, 'Task not found');
  }

  res.status(200).json({ success: true, message: 'Task deleted' });
});
