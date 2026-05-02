import 'dotenv/config';
import { query } from '../config/database';
import { hashPassword } from '../utils/password';
import { v4 as uuidv4 } from 'uuid';

async function initializeDatabase() {
  console.log('🚀 Starting Full Database Initialization...');
  
  try {
    // 1. Core Tables
    console.log('📦 Creating Core Tables...');
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
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    `);

    // 2. Education & Content
    console.log('📚 Creating Education Tables...');
    await query(`
      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        instructor VARCHAR(255),
        image VARCHAR(255),
        duration INTEGER,
        is_pro BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id UUID PRIMARY KEY,
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        youtube_url VARCHAR(255),
        duration INTEGER,
        "order" INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_lessons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
        completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, lesson_id)
      );

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
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        marathon_id UUID NOT NULL REFERENCES marathons(id) ON DELETE CASCADE,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        current_day INTEGER DEFAULT 1,
        completed BOOLEAN DEFAULT false,
        UNIQUE(user_id, marathon_id)
      );
    `);

    // 3. Social & Chat
    console.log('💬 Creating Social Tables...');
    await query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT,
        images JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS post_likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS post_comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(50) DEFAULT 'direct',
        title VARCHAR(255),
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS conversation_participants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'active',
        last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(conversation_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Marketplace
    console.log('🛍 Creating Marketplace Tables...');
    await query(`
      CREATE TABLE IF NOT EXISTS listings (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(255),
        image VARCHAR(255),
        price FLOAT,
        contact_info VARCHAR(255),
        city VARCHAR(100),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS marketplace_likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, listing_id)
      );
    `);

    // 5. Appointments & Payments
    console.log('🗓 Creating Appointment Tables...');
    await query(`
      CREATE TABLE IF NOT EXISTS time_slots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        specialist_id UUID NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
        slot_date DATE NOT NULL,
        slot_time TIME NOT NULL,
        is_booked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(specialist_id, slot_date, slot_time)
      );

      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount FLOAT NOT NULL,
        type VARCHAR(50) NOT NULL,
        reference_id UUID,
        status VARCHAR(50) DEFAULT 'completed',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        specialist_id UUID NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
        time_slot_id UUID REFERENCES time_slots(id),
        date_time TIMESTAMP NOT NULL,
        duration INTEGER DEFAULT 60,
        status VARCHAR(50) DEFAULT 'scheduled',
        meeting_link VARCHAR(255),
        price FLOAT,
        payment_id UUID REFERENCES payments(id),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Extras (Diary, Subscriptions)
    console.log('📓 Creating Extra Tables...');
    await query(`
      CREATE TABLE IF NOT EXISTS diary_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        mood VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan VARCHAR(50),
        appointments_used INTEGER DEFAULT 0,
        appointments_limit INTEGER,
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        active BOOLEAN DEFAULT true
      );

      CREATE TABLE IF NOT EXISTS daily_tasks (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP,
        due_date DATE,
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
    `);

    // 7. Seed Data
    console.log('🌱 Seeding Admin Account...');
    const adminEmail = 'admin@mamapro.kz';
    const adminCheck = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (adminCheck.rows.length === 0) {
      const hashedPass = await hashPassword('Admin123!');
      await query(
        'INSERT INTO users (id, email, name, password, role, subscription) VALUES ($1, $2, $3, $4, $5, $6)',
        [uuidv4(), adminEmail, 'MamaPro Admin', hashedPass, 'admin', 'pro']
      );
      console.log('✅ Admin Created: admin@mamapro.kz / Admin123!');
    }

    console.log('🌱 Seeding Initial Courses...');
    const courseCheck = await query('SELECT count(*) FROM courses');
    if (parseInt(courseCheck.rows[0].count) === 0) {
       const c1 = uuidv4();
       await query(`
         INSERT INTO courses (id, title, description, category, instructor, duration, is_pro)
         VALUES ($1, 'Постпартум уверенность', 'Курс о восстановлении после родов', 'psychology', 'Асель Н.', 280, false)`, [c1]);
       
       await query(`
         INSERT INTO lessons (id, course_id, title, description, youtube_url, duration, "order")
         VALUES (gen_random_uuid(), $1, 'Введение', 'Начало пути', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 10, 1)`, [c1]);
    }

    console.log('✨ Database Successfully Initialized!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Critical Error during initialization:', err);
    process.exit(1);
  }
}

initializeDatabase();
