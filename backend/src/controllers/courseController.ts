import { Request, Response } from 'express';
import { query } from '../config/database';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const { category, instructor_id } = req.query;

  let sql = `
    SELECT c.*, 
           COALESCE(json_agg(json_build_object(
             'id', l.id,
             'title', l.title,
             'description', l.description,
             'youtubeUrl', l.youtube_url,
             'duration', l.duration,
             'order', l.order
           ) ORDER BY l.order) FILTER (WHERE l.id IS NOT NULL), '[]') as lessons
    FROM courses c
    LEFT JOIN lessons l ON c.id = l.course_id
  `;

  const params: any[] = [];
  const conditions: string[] = [];

  if (category && category !== 'all') {
    params.push(category);
    conditions.push(`c.category = $${params.length}`);
  }

  if (instructor_id) {
    params.push(instructor_id);
    conditions.push(`c.instructor_id = $${params.length}`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(' AND ');
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
  const userId = req.user?.userId || null;

  const courseResult = await query(
    `SELECT c.*, 
            COALESCE(json_agg(json_build_object(
              'id', l.id,
              'title', l.title,
              'description', l.description,
              'youtubeUrl', l.youtube_url,
              'duration', l.duration,
              'order', l.order
            ) ORDER BY l.order) FILTER (WHERE l.id IS NOT NULL), '[]') as lessons
     FROM courses c
     LEFT JOIN lessons l ON c.id = l.course_id
     WHERE c.id = $1
     GROUP BY c.id`,
    [id]
  );

  if (courseResult.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }

  const course = courseResult.rows[0];
  let completedLessonIds: string[] = [];

  if (userId) {
    const progressResult = await query(
      `SELECT lesson_id FROM user_lessons WHERE user_id = $1 AND completed = true AND lesson_id IN (
         SELECT id FROM lessons WHERE course_id = $2
       )`,
      [userId, id]
    );
    completedLessonIds = progressResult.rows.map((row) => row.lesson_id);
  }

  res.status(200).json({ success: true, data: { ...course, completedLessonIds } });
});

export const completeLesson = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { courseId, lessonId } = req.params;

  const lessonResult = await query(
    'SELECT id, course_id FROM lessons WHERE id = $1 AND course_id = $2',
    [lessonId, courseId]
  );

  if (lessonResult.rows.length === 0) {
    throw new AppError(404, 'Lesson not found for this course');
  }

  const result = await query(
    `INSERT INTO user_lessons (user_id, lesson_id, completed, completed_at)
     VALUES ($1, $2, true, NOW())
     ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = true, completed_at = NOW()
     RETURNING *`,
    [userId, lessonId]
  );

  res.status(200).json({ success: true, data: result.rows[0] });
});
