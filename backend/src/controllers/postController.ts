import { Request, Response } from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  const result = await query(
    `SELECT p.*, u.name as author_name, u.avatar as author_avatar, u.role as author_role,
       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
       (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count,
       EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = $1) as is_liked
     FROM posts p
     JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC`,
    [userId || null]
  );

  res.status(200).json({ success: true, data: result.rows });
});

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { content, images } = req.body;

  if (!content && (!images || images.length === 0)) {
    throw new AppError(400, 'Post content cannot be empty');
  }

  const id = uuidv4();
  const result = await query(
    `INSERT INTO posts (id, user_id, content, images, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING *`,
    [id, userId, content, JSON.stringify(images || [])]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

export const toggleLike = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { postId } = req.params;

  const check = await query('SELECT 1 FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);

  if (check.rows.length > 0) {
    await query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
    res.status(200).json({ success: true, liked: false });
  } else {
    await query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
    res.status(200).json({ success: true, liked: true });
  }
});

export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  
  const result = await query(
    `SELECT c.*, u.name as user_name, u.avatar as user_avatar
     FROM post_comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId]
  );

  res.status(200).json({ success: true, data: result.rows });
});

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { postId } = req.params;
  const { text } = req.body;

  if (!text?.trim()) throw new AppError(400, 'Comment text empty');

  const id = uuidv4();
  const result = await query(
    `INSERT INTO post_comments (id, post_id, user_id, text, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING *`,
    [id, postId, userId, text.trim()]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});
