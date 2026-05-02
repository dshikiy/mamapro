import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';

export const createUser = async (
  email: string,
  name: string,
  hashedPassword: string
): Promise<User> => {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO users (id, email, name, password, role, subscription, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
     RETURNING *`,
    [id, email, name, hashedPassword, 'mother', 'free']
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const fields = Object.keys(data).map((key, i) => `${key} = $${i + 1}`);
  const values = Object.values(data);
  const result = await query(
    `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );
  return result.rows[0];
};
