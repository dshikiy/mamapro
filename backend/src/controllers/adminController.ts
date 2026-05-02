import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { UserRole } from '../types';

const VALID_ROLES: UserRole[] = ['mother', 'specialist', 'admin'];

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT id, email, name, role, avatar, bio, subscription, created_at, updated_at
     FROM users
     ORDER BY created_at DESC`
  );

  res.status(200).json({ success: true, data: result.rows });
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, specialty, subscription } = req.body as { role: UserRole; specialty?: string; subscription?: string };

  if (role && !VALID_ROLES.includes(role)) {
    throw new AppError(400, 'Invalid role');
  }

  const userResult = await query('SELECT id, email, role, subscription FROM users WHERE id = $1', [id]);
  if (userResult.rows.length === 0) {
    throw new AppError(404, 'User not found');
  }

  // If role is admin, always give pro subscription
  const finalSubscription = role === 'admin' ? 'pro' : (subscription || userResult.rows[0].subscription);
  const finalRole = role || userResult.rows[0].role;

  const updatedUser = await query(
    `UPDATE users SET role = $1, subscription = $2, updated_at = NOW() WHERE id = $3 RETURNING id, email, name, role, avatar, bio, subscription, created_at, updated_at`,
    [finalRole, finalSubscription, id]
  );

  if (finalRole === 'specialist') {
    const specialistExists = await query('SELECT id FROM specialists WHERE user_id = $1', [id]);
    if (specialistExists.rows.length === 0) {
      await query(
        `INSERT INTO specialists (id, user_id, name, title, bio, avatar, specialty, rating, price, availability, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, '', '', $4, 5.0, 0, '[]', NOW())`,
        [id, updatedUser.rows[0].name, specialty || 'Специалист', specialty || 'Общий']
      );
    } else if (specialty) {
      await query(
        `UPDATE specialists SET specialty = $1 WHERE user_id = $2`,
        [specialty, id]
      );
    }
  }

  res.status(200).json({ success: true, data: updatedUser.rows[0] });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const userResult = await query('SELECT id FROM users WHERE id = $1', [id]);
  if (userResult.rows.length === 0) {
    throw new AppError(404, 'User not found');
  }

  await query('DELETE FROM specialists WHERE user_id = $1', [id]);
  await query('DELETE FROM daily_tasks WHERE user_id = $1', [id]);
  await query('DELETE FROM listings WHERE user_id = $1', [id]);
  await query('DELETE FROM appointments WHERE user_id = $1', [id]);
  await query('DELETE FROM users WHERE id = $1', [id]);

  res.status(200).json({ success: true, message: 'User and related data deleted' });
});

export const getAdminStats = asyncHandler(async (req: Request, res: Response) => {
  const usersCount = await query('SELECT COUNT(*) FROM users');
  const specialistsCount = await query('SELECT COUNT(*) FROM specialists');
  const listingsCount = await query('SELECT COUNT(*) FROM listings');
  const appointmentsCount = await query('SELECT COUNT(*) FROM appointments');

  res.status(200).json({
    success: true,
    data: {
      users: parseInt(usersCount.rows[0].count),
      specialists: parseInt(specialistsCount.rows[0].count),
      listings: parseInt(listingsCount.rows[0].count),
      appointments: parseInt(appointmentsCount.rows[0].count),
    }
  });
});

export const getAllListings = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT l.*, u.name as seller_name, u.email as seller_email 
     FROM listings l 
     JOIN users u ON l.user_id = u.id 
     ORDER BY l.created_at DESC`
  );
  res.status(200).json({ success: true, data: result.rows });
});

export const deleteListing = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await query('DELETE FROM listings WHERE id = $1', [id]);
  res.status(200).json({ success: true, message: 'Listing deleted' });
});

// --- Course Management ---

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, category, instructor, image, duration, is_pro } = req.body;
  const id = uuidv4();
  const userId = req.user?.userId;
  const role = req.user?.role;

  // Specialists can only create courses for themselves
  const finalInstructorId = role === 'admin' ? (req.body.instructor_id || userId) : userId;

  const result = await query(
    `INSERT INTO courses (id, title, description, category, instructor, image, duration, is_pro, instructor_id, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
     RETURNING *`,
    [id, title, description, category, instructor, image, duration || 0, is_pro || false, finalInstructorId]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, category, instructor, image, duration, is_pro, instructor_id } = req.body;
  const userId = req.user?.userId;
  const role = req.user?.role;

  // Check ownership
  const courseCheck = await query('SELECT instructor_id FROM courses WHERE id = $1', [id]);
  if (courseCheck.rows.length === 0) throw new AppError(404, 'Course not found');
  
  if (role !== 'admin' && courseCheck.rows[0].instructor_id !== userId) {
    throw new AppError(403, 'You can only edit your own courses');
  }

  const result = await query(
    `UPDATE courses 
     SET title = COALESCE($1, title), 
         description = COALESCE($2, description), 
         category = COALESCE($3, category), 
         instructor = COALESCE($4, instructor), 
         image = COALESCE($5, image), 
         duration = COALESCE($6, duration),
         is_pro = COALESCE($7, is_pro),
         instructor_id = COALESCE($8, instructor_id)
     WHERE id = $9 
     RETURNING *`,
    [title, description, category, instructor, image, duration, is_pro, instructor_id, id]
  );

  res.status(200).json({ success: true, data: result.rows[0] });
});

export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const role = req.user?.role;

  // Check ownership
  const courseCheck = await query('SELECT instructor_id FROM courses WHERE id = $1', [id]);
  if (courseCheck.rows.length === 0) throw new AppError(404, 'Course not found');
  
  if (role !== 'admin' && courseCheck.rows[0].instructor_id !== userId) {
    throw new AppError(403, 'You can only delete your own courses');
  }

  await query('DELETE FROM user_lessons WHERE lesson_id IN (SELECT id FROM lessons WHERE course_id = $1)', [id]);
  await query('DELETE FROM lessons WHERE course_id = $1', [id]);
  await query('DELETE FROM courses WHERE id = $1', [id]);
  res.status(200).json({ success: true, message: 'Course and lessons deleted' });
});

export const addLesson = asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { title, description, youtubeUrl, duration, order } = req.body;
  const userId = req.user?.userId;
  const role = req.user?.role;

  // Check ownership
  const courseCheck = await query('SELECT instructor_id FROM courses WHERE id = $1', [courseId]);
  if (courseCheck.rows.length === 0) throw new AppError(404, 'Course not found');
  
  if (role !== 'admin' && courseCheck.rows[0].instructor_id !== userId) {
    throw new AppError(403, 'You can only add lessons to your own courses');
  }

  const id = uuidv4();
  const result = await query(
    `INSERT INTO lessons (id, course_id, title, description, youtube_url, duration, "order", created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     RETURNING *`,
    [id, courseId, title, description, youtubeUrl, duration || 0, order || 0]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

export const updateLesson = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, youtubeUrl, duration, order } = req.body;
  const userId = req.user?.userId;
  const role = req.user?.role;

  // Check ownership
  const lessonCheck = await query(
    'SELECT c.instructor_id FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = $1',
    [id]
  );
  if (lessonCheck.rows.length === 0) throw new AppError(404, 'Lesson not found');
  
  if (role !== 'admin' && lessonCheck.rows[0].instructor_id !== userId) {
    throw new AppError(403, 'You can only edit lessons of your own courses');
  }

  const result = await query(
    `UPDATE lessons 
     SET title = COALESCE($1, title), 
         description = COALESCE($2, description), 
         youtube_url = COALESCE($3, youtube_url), 
         duration = COALESCE($4, duration), 
         "order" = COALESCE($5, "order")
     WHERE id = $6 
     RETURNING *`,
    [title, description, youtubeUrl, duration, order, id]
  );

  res.status(200).json({ success: true, data: result.rows[0] });
});

export const deleteLesson = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const role = req.user?.role;

  // Check ownership
  const lessonCheck = await query(
    'SELECT c.instructor_id FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = $1',
    [id]
  );
  if (lessonCheck.rows.length === 0) throw new AppError(404, 'Lesson not found');
  
  if (role !== 'admin' && lessonCheck.rows[0].instructor_id !== userId) {
    throw new AppError(403, 'You can only delete lessons of your own courses');
  }

  await query('DELETE FROM user_lessons WHERE lesson_id = $1', [id]);
  await query('DELETE FROM lessons WHERE id = $1', [id]);
  res.status(200).json({ success: true, message: 'Lesson deleted' });
});

// --- Specialist Verification ---

export const toggleSpecialistVerification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { verified } = req.body;
  
  const result = await query(
    `UPDATE specialists SET verified = $1 WHERE id = $2 RETURNING *`,
    [verified, id]
  );
  
  if (result.rows.length === 0) {
    throw new AppError(404, 'Specialist not found');
  }
  
  res.status(200).json({ success: true, data: result.rows[0] });
});

// --- Appointments ---

export const getAllAppointments = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT a.*, u.name as user_name, s.name as specialist_name, s.title as specialist_title
     FROM appointments a
     JOIN users u ON a.user_id = u.id
     JOIN specialists s ON a.specialist_id = s.id
     ORDER BY a.date_time DESC`
  );
  res.status(200).json({ success: true, data: result.rows });
});

export const createSpecialist = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, title, specialty, price, bio } = req.body;
  
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  let userId: string;
  
  if (existingUser.rows.length > 0) {
    userId = existingUser.rows[0].id;
    await query("UPDATE users SET role = 'specialist' WHERE id = $1", [userId]);
  } else {
    userId = uuidv4();
    const hashedPassword = password || 'defaultPass123';
    await query(
      `INSERT INTO users (id, email, name, password, role, subscription, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'specialist', 'pro', NOW(), NOW())`,
      [userId, email, name, hashedPassword]
    );
  }
  
  const specialistId = uuidv4();
  const result = await query(
    `INSERT INTO specialists (id, user_id, name, title, bio, avatar, specialty, rating, price, verified, created_at)
     VALUES ($1, $2, $3, $4, $5, '', $6, 5.0, $7, true, NOW())
     RETURNING *`,
    [specialistId, userId, name, title || specialty, bio || '', specialty, price || 0]
  );
  
  res.status(201).json({ success: true, data: result.rows[0] });
});

export const getAllSpecialists = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT s.*, u.email as user_email
     FROM specialists s
     JOIN users u ON s.user_id = u.id
     ORDER BY s.created_at DESC`
  );
  res.status(200).json({ success: true, data: result.rows });
});

export const getAllMarathons = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT m.*, s.name as instructor_name 
     FROM marathons m 
     LEFT JOIN specialists s ON m.instructor_id = s.id 
     ORDER BY m.created_at DESC`
  );
  res.status(200).json({ success: true, data: result.rows });
});

export const createMarathon = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, duration_days, price, image, instructor_id } = req.body;
  const id = uuidv4();
  const result = await query(
    `INSERT INTO marathons (id, title, description, duration_days, price, image, instructor_id, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     RETURNING *`,
    [id, title, description, duration_days, price, image, instructor_id || null]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

export const deleteMarathon = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await query('DELETE FROM marathon_enrollments WHERE marathon_id = $1', [id]);
  await query('DELETE FROM marathons WHERE id = $1', [id]);
  res.status(200).json({ success: true, message: 'Marathon deleted' });
});
