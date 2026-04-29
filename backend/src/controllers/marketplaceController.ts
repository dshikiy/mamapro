import { Request, Response } from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const createListing = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, category, image, price } = req.body;
  const id = uuidv4();

  const result = await query(
    `INSERT INTO listings (id, user_id, title, description, category, image, price, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
     RETURNING *`,
    [id, req.user!.userId, title, description, category, image, price || null, 'active']
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

export const getListings = asyncHandler(async (req: Request, res: Response) => {
  const { category, search } = req.query;

  let sql = 'SELECT * FROM listings WHERE status = $1';
  const params: any[] = ['active'];

  if (category) {
    sql += ` AND category = $${params.length + 1}`;
    params.push(category);
  }

  if (search) {
    sql += ` AND (title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
    params.push(`%${search}%`);
  }

  sql += ' ORDER BY created_at DESC';

  const result = await query(sql, params);

  res.status(200).json({ success: true, data: result.rows });
});

export const getListingById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query('SELECT * FROM listings WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    throw new AppError(404, 'Listing not found');
  }

  res.status(200).json({ success: true, data: result.rows[0] });
});

export const updateListing = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, category, price, image } = req.body;

  const result = await query(
    `UPDATE listings SET title = $1, description = $2, category = $3, price = $4, image = $5, updated_at = NOW()
     WHERE id = $6 AND user_id = $7
     RETURNING *`,
    [title, description, category, price, image, id, req.user!.userId]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, 'Listing not found or unauthorized');
  }

  res.status(200).json({ success: true, data: result.rows[0] });
});

export const deleteListing = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query(
    'UPDATE listings SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
    ['removed', id, req.user!.userId]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, 'Listing not found or unauthorized');
  }

  res.status(200).json({ success: true, message: 'Listing deleted' });
});
