import { Request, Response } from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const createListing = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, category, image, price, contactInfo } = req.body;
  if (!title?.trim() || !description?.trim() || !category?.trim() || !contactInfo?.trim()) {
    throw new AppError(400, 'Заполните все обязательные поля');
  }

  const userId = req.user!.userId;
  const userResult = await query('SELECT subscription FROM users WHERE id = $1', [userId]);
  const subscription = userResult.rows[0]?.subscription as string | undefined;

  const existingListings = await query(
    'SELECT COUNT(*) AS count FROM listings WHERE user_id = $1 AND status = $2',
    [userId, 'active']
  );

  const currentCount = Number(existingListings.rows[0]?.count || 0);
  if (subscription === 'free' && currentCount >= 1) {
    throw new AppError(403, 'Перейдите на Pro для безлимита');
  }

  const id = uuidv4();
  const result = await query(
    `INSERT INTO listings (id, user_id, title, description, category, image, price, contact_info, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
     RETURNING *`,
    [id, userId, title.trim(), description.trim(), category.trim(), image || null, price || null, contactInfo.trim(), 'active']
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

export const getListings = asyncHandler(async (req: Request, res: Response) => {
  const { category, search } = req.query;
  const userId = req.user?.userId;

  let sql = `
    SELECT l.*, u.name as seller_name,
    EXISTS(SELECT 1 FROM marketplace_likes WHERE listing_id = l.id AND user_id = $2) as is_liked
    FROM listings l
    JOIN users u ON l.user_id = u.id
    WHERE l.status = $1
  `;
  const params: any[] = ['active', userId || null];

  if (category && category !== 'Все') {
    sql += ` AND l.category = $${params.length + 1}`;
    params.push(category);
  }

  if (search) {
    sql += ` AND (l.title ILIKE $${params.length + 1} OR l.description ILIKE $${params.length + 1})`;
    params.push(`%${search}%`);
  }

  sql += ' ORDER BY l.created_at DESC';

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
  const { title, description, category, price, image, contactInfo } = req.body;

  const result = await query(
    `UPDATE listings SET title = $1, description = $2, category = $3, price = $4, image = $5, contact_info = $6, updated_at = NOW()
     WHERE id = $7 AND user_id = $8
     RETURNING *`,
    [title, description, category, price, image, contactInfo || null, id, req.user!.userId]
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

export const toggleLike = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id: listingId } = req.params;

  const check = await query('SELECT 1 FROM marketplace_likes WHERE listing_id = $1 AND user_id = $2', [listingId, userId]);

  if (check.rows.length > 0) {
    await query('DELETE FROM marketplace_likes WHERE listing_id = $1 AND user_id = $2', [listingId, userId]);
    res.status(200).json({ success: true, liked: false });
  } else {
    await query('INSERT INTO marketplace_likes (listing_id, user_id) VALUES ($1, $2)', [listingId, userId]);
    res.status(200).json({ success: true, liked: true });
  }
});
