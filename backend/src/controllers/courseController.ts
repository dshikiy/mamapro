import { Request, Response } from 'express';
import { query } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;

  let sql = `
    SELECT c.*, 
           json_agg(json_build_object(
             'id', l.id,
             'title', l.title,
             'description', l.description,
             'youtubeUrl', l.youtube_url,
             'duration', l.duration,
             'order', l.order
           ) ORDER BY l.order) as lessons
    FROM courses c
    LEFT JOIN lessons l ON c.id = l.course_id
  `;

  const params: any[] = [];

  if (category && category !== 'all') {
    sql += ` WHERE c.category = $1`;
    params.push(category);
  }

  sql += ` GROUP BY c.id ORDER BY c.created_at DESC`;

  const result = await query(sql, params);

  res.status(200).json({
    success: true,
    data: result.rows,
  });
});

export const getCourseById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query(
    `SELECT c.*, 
            json_agg(json_build_object(
              'id', l.id,
              'title', l.title,
              'description', l.description,
              'youtubeUrl', l.youtube_url,
              'duration', l.duration,
              'order', l.order
            ) ORDER BY l.order) as lessons
     FROM courses c
     LEFT JOIN lessons l ON c.id = l.course_id
     WHERE c.id = $1
     GROUP BY c.id`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }

  res.status(200).json({ success: true, data: result.rows[0] });
});
