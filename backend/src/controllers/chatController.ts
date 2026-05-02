import { Request, Response } from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// ─── GET /api/chat/conversations ───────────────────────────────────────────
export const getConversations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const result = await query(
    `SELECT 
      c.id, 
      c.type, 
      c.title, 
      c.avatar,
      c.updated_at,
      cp.status as participant_status,
      (SELECT json_build_object(
        'id', u.id,
        'name', u.name,
        'avatar', u.avatar,
        'role', u.role
      ) FROM users u 
        JOIN conversation_participants cp2 ON u.id = cp2.user_id 
        WHERE cp2.conversation_id = c.id AND u.id != $1 LIMIT 1) as other_user,
      (SELECT json_build_object(
        'text', m.text,
        'sender_id', m.sender_id,
        'created_at', m.created_at
      ) FROM messages m 
        WHERE m.conversation_id = c.id 
        ORDER BY m.created_at DESC LIMIT 1) as last_message
     FROM conversations c
     JOIN conversation_participants cp ON c.id = cp.conversation_id
     WHERE cp.user_id = $1
     ORDER BY c.updated_at DESC`,
    [userId]
  );

  res.status(200).json({ success: true, data: result.rows });
});

// ─── GET /api/chat/messages/:conversationId ───────────────────────────────
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { conversationId } = req.params;

  // Check if participant
  const partCheck = await query(
    'SELECT status FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
    [conversationId, userId]
  );
  if (partCheck.rows.length === 0) throw new AppError(403, 'Access denied');

  const result = await query(
    `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.conversation_id = $1
     ORDER BY m.created_at ASC`,
    [conversationId]
  );

  // Update last_read_at
  await query(
    'UPDATE conversation_participants SET last_read_at = NOW() WHERE conversation_id = $1 AND user_id = $2',
    [conversationId, userId]
  );

  res.status(200).json({ success: true, data: result.rows });
});

// ─── POST /api/chat/start ──────────────────────────────────────────────────
export const startConversation = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { targetUserId, type = 'direct', title } = req.body;

  if (type === 'direct') {
    // Check if direct conversation already exists
    const existing = await query(
      `SELECT c.id FROM conversations c
       JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
       JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
       WHERE c.type = 'direct' AND cp1.user_id = $1 AND cp2.user_id = $2`,
      [userId, targetUserId]
    );

    if (existing.rows.length > 0) {
      return res.status(200).json({ success: true, data: { id: existing.rows[0].id } });
    }
  }

  const convId = uuidv4();
  await query(
    'INSERT INTO conversations (id, type, title, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
    [convId, type, title || null]
  );

  // Add current user as active
  await query(
    'INSERT INTO conversation_participants (conversation_id, user_id, status) VALUES ($1, $2, $3)',
    [convId, userId, 'active']
  );

  // Add target user as 'request' if it's a new direct chat, otherwise 'active' for group
  const targetStatus = type === 'direct' ? 'request' : 'active';
  if (targetUserId) {
    await query(
      'INSERT INTO conversation_participants (conversation_id, user_id, status) VALUES ($1, $2, $3)',
      [convId, targetUserId, targetStatus]
    );
  } else if (req.body.participantIds && Array.isArray(req.body.participantIds)) {
    // For groups
    for (const pId of req.body.participantIds) {
      if (pId !== userId) {
        await query(
          'INSERT INTO conversation_participants (conversation_id, user_id, status) VALUES ($1, $2, $3)',
          [convId, pId, 'active']
        );
      }
    }
  }

  res.status(201).json({ success: true, data: { id: convId } });
});

// ─── POST /api/chat/message ────────────────────────────────────────────────
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { conversationId, text } = req.body;

  if (!text?.trim()) throw new AppError(400, 'Empty message');

  const messageId = uuidv4();
  const result = await query(
    `INSERT INTO messages (id, conversation_id, sender_id, text, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING *`,
    [messageId, conversationId, userId, text.trim()]
  );

  await query(
    'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
    [conversationId]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

// ─── PATCH /api/chat/request/:conversationId ───────────────────────────────
export const handleRequest = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { conversationId } = req.params;
  const { action } = req.body; // 'accept' or 'decline'

  if (action === 'accept') {
    await query(
      "UPDATE conversation_participants SET status = 'active' WHERE conversation_id = $1 AND user_id = $2",
      [conversationId, userId]
    );
    res.status(200).json({ success: true, message: 'Request accepted' });
  } else {
    await query(
      'DELETE FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
      [conversationId, userId]
    );
    // If no more participants, delete conversation
    const parts = await query('SELECT count(*) FROM conversation_participants WHERE conversation_id = $1', [conversationId]);
    if (parseInt(parts.rows[0].count) <= 1) {
       await query('DELETE FROM conversations WHERE id = $1', [conversationId]);
    }
    res.status(200).json({ success: true, message: 'Request declined' });
  }
});

// ─── GET /api/chat/users ───────────────────────────────────────────────────
// Search users to start chat
export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  const userId = req.user!.userId;

  const result = await query(
    `SELECT id, name, avatar, role FROM users 
     WHERE (name ILIKE $1 OR email ILIKE $1) AND id != $2
     LIMIT 10`,
    [`%${q || ''}%`, userId]
  );

  res.status(200).json({ success: true, data: result.rows });
});
