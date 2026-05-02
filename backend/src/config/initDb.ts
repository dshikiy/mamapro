import { query } from './database';
import { hashPassword } from '../utils/password';

export const initDb = async () => {
  console.log('⏳ Инициализация базы данных...');
  try {
    // Initial Schema (001)
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'mother',
        avatar VARCHAR(255),
        bio TEXT,
        subscription VARCHAR(50) DEFAULT 'free',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS specialists (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        bio TEXT,
        avatar VARCHAR(255),
        specialty VARCHAR(255),
        rating FLOAT DEFAULT 5.0,
        price FLOAT NOT NULL,
        availability JSONB,
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        specialist_id UUID NOT NULL REFERENCES specialists(id),
        date_time TIMESTAMP NOT NULL,
        duration INTEGER DEFAULT 60,
        status VARCHAR(50) DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        instructor VARCHAR(255),
        image VARCHAR(255),
        duration INTEGER,
        is_pro BOOLEAN DEFAULT false,
        instructor_id UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id UUID PRIMARY KEY,
        course_id UUID NOT NULL REFERENCES courses(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        youtube_url VARCHAR(255),
        duration INTEGER,
        "order" INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_lessons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        lesson_id UUID NOT NULL REFERENCES lessons(id),
        completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, lesson_id)
      );

      CREATE TABLE IF NOT EXISTS daily_tasks (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP,
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS listings (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(255),
        image VARCHAR(255),
        price FLOAT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        plan VARCHAR(50),
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        active BOOLEAN DEFAULT true
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_specialists_user_id ON specialists(user_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_specialist_id ON appointments(specialist_id);
      CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
      CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
      CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_id ON daily_tasks(user_id);
      CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
    `);

    // Seed initial courses and lessons only if none exist
    const coursesCount = await query('SELECT COUNT(*)::int AS count FROM courses');
    if (coursesCount.rows[0].count === 0) {
      const course1Id = '00000000-0000-0000-0000-000000000001';
      const course2Id = '00000000-0000-0000-0000-000000000002';

      await query(
        `INSERT INTO courses (id, title, description, category, instructor, image, duration)
         VALUES
           ($1, $2, $3, $4, $5, $6, $7),
           ($8, $9, $10, $11, $12, $13, $14)`,
        [
          course1Id,
          'Постпартум уверенность',
          'Комплексный курс о восстановлении после родов и заботе о себе.',
          'psychology',
          'Асель Н.',
          'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80',
          280,
          course2Id,
          'Грудное вскармливание с уверенностью',
          'Построим гармоничный ритм кормления и снизим стресс.',
          'breastfeeding',
          'Мадина К.',
          'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
          190,
        ]
      );

      await query(
        `INSERT INTO lessons (id, course_id, title, description, youtube_url, duration, "order") VALUES
          (gen_random_uuid(), $1, 'Введение в курс', 'Как устроен курс и чего ожидать.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 12, 1),
          (gen_random_uuid(), $1, 'Эмоциональные ресурсы мамы', 'Практики для восстановления внутреннего баланса.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 18, 2),
          (gen_random_uuid(), $1, 'Режим сна и отдых', 'Как создать рутину, которая работает.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 24, 3),
          (gen_random_uuid(), $2, 'Основы грудного вскармливания', 'Техники правильного захвата и питания.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 20, 1),
          (gen_random_uuid(), $2, 'Решение частых проблем', 'Как справиться с трещинами, лактостазом и болью.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 22, 2),
          (gen_random_uuid(), $2, 'Питание мамы при кормлении', 'Питательные привычки для уверенного ГВ.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 18, 3)`,
        [course1Id, course2Id]
      );
    }

    // Migrate old user role values to new role names
    await query(`
      UPDATE users
      SET role = 'mother'
      WHERE role = 'user';
    `);

    // Ensure a default super-admin account exists
    const adminEmail = 'admin@mamapro.kz';
    const adminResult = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (adminResult.rows.length === 0) {
      const hashedPassword = await hashPassword('Admin123!');
      await query(
        `INSERT INTO users (id, email, name, password, role, subscription, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, 'admin', 'free', NOW(), NOW())`,
        [adminEmail, 'MamaPro Admin', hashedPassword]
      );
      console.log('✅ Super-admin created: admin@mamapro.kz / Admin123!');
    }

    // Enhanced Schema (002)
    await query(`
      CREATE TABLE IF NOT EXISTS marathons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration_days INTEGER NOT NULL DEFAULT 7,
        price FLOAT NOT NULL DEFAULT 5000,
        image VARCHAR(255),
        instructor_id UUID REFERENCES specialists(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS marathon_enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        marathon_id UUID NOT NULL REFERENCES marathons(id),
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        current_day INTEGER DEFAULT 1,
        completed BOOLEAN DEFAULT false,
        UNIQUE(user_id, marathon_id)
      );

      CREATE TABLE IF NOT EXISTS time_slots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        specialist_id UUID NOT NULL REFERENCES specialists(id),
        slot_date DATE NOT NULL,
        slot_time TIME NOT NULL,
        is_booked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(specialist_id, slot_date, slot_time)
      );

      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        amount FLOAT NOT NULL,
        type VARCHAR(50) NOT NULL,
        reference_id UUID,
        status VARCHAR(50) DEFAULT 'completed',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS diary_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        text TEXT NOT NULL,
        mood VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS anonymous_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        question TEXT NOT NULL,
        answer TEXT,
        answered_by UUID REFERENCES users(id) ON DELETE SET NULL,
        tags VARCHAR(255)[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Update appointments table to link to time_slots
      DO $$ BEGIN
        ALTER TABLE appointments ADD COLUMN IF NOT EXISTS time_slot_id UUID REFERENCES time_slots(id);
      EXCEPTION
        WHEN others THEN NULL;
      END $$;
      
      DO $$ BEGIN
        ALTER TABLE appointments ADD COLUMN IF NOT EXISTS meeting_link VARCHAR(255);
      EXCEPTION
        WHEN others THEN NULL;
      END $$;

      DO $$ BEGIN
        ALTER TABLE appointments ADD COLUMN IF NOT EXISTS price FLOAT;
      EXCEPTION
        WHEN others THEN NULL;
      END $$;

      DO $$ BEGIN
        ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id);
      EXCEPTION
        WHEN others THEN NULL;
      END $$;

      -- Add contact field to listings
      DO $$ BEGIN
        ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_info VARCHAR(255);
      EXCEPTION
        WHEN others THEN NULL;
      END $$;

      DO $$ BEGIN
        ALTER TABLE listings ADD COLUMN IF NOT EXISTS city VARCHAR(100);
      EXCEPTION
        WHEN others THEN NULL;
      END $$;

      -- Update subscriptions table with more fields
      DO $$ BEGIN
        ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS appointments_used INTEGER DEFAULT 0;
      EXCEPTION
        WHEN others THEN NULL;
      END $$;

      DO $$ BEGIN
        ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS appointments_limit INTEGER;
      EXCEPTION
        WHEN others THEN NULL;
      END $$;

      -- Indexes
      CREATE INDEX IF NOT EXISTS idx_marathons_active ON marathons(is_active);
      CREATE INDEX IF NOT EXISTS idx_marathon_enrollments_user ON marathon_enrollments(user_id);
      CREATE INDEX IF NOT EXISTS idx_time_slots_specialist ON time_slots(specialist_id);
      CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(slot_date);
      CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
      CREATE INDEX IF NOT EXISTS idx_diary_user ON diary_entries(user_id);
      CREATE INDEX IF NOT EXISTS idx_anon_questions ON anonymous_questions(created_at DESC);

      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(50) DEFAULT 'direct', -- 'direct' or 'group'
        title VARCHAR(255),
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS conversation_participants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'active', -- 'active', 'request', 'muted', 'blocked'
        last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(conversation_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id),
        text TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Migration: Ensure messages has conversation_id (in case table already existed)
      DO $$ BEGIN
        ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;
      EXCEPTION
        WHEN others THEN NULL;
      END $$;

      CREATE TABLE IF NOT EXISTS marketplace_likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, listing_id)
      );

      CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_conv_participants_user ON conversation_participants(user_id);
      CREATE INDEX IF NOT EXISTS idx_market_likes_user ON marketplace_likes(user_id);

      -- Patch existing tables with missing columns
      DO $$ BEGIN
        ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false;
        ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor_id UUID REFERENCES users(id);
      EXCEPTION
        WHEN others THEN NULL;
      END $$;

      DO $$ BEGIN
        ALTER TABLE specialists ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
      EXCEPTION
        WHEN others THEN NULL;
      END $$;
    `);

    console.log('✅ База данных успешно инициализирована!');
  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error);
  }
};
