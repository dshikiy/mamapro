-- Migration 002: Enhanced schema for MamaPro full platform

-- Add marathon-specific tables
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

-- Marathon enrollment (участие)
CREATE TABLE IF NOT EXISTS marathon_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  marathon_id UUID NOT NULL REFERENCES marathons(id),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  current_day INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT false,
  UNIQUE(user_id, marathon_id)
);

-- Time slots for specialists
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialist_id UUID NOT NULL REFERENCES specialists(id),
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(specialist_id, slot_date, slot_time)
);

-- Payments / transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount FLOAT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'subscription', 'appointment', 'marathon', 'marketplace_listing'
  reference_id UUID,         -- ID of appointment/marathon/listing
  status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diary entries (дневник мамы)
CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  text TEXT NOT NULL,
  mood VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Anonymous Q&A
CREATE TABLE IF NOT EXISTS anonymous_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),    -- nullable, truly anon
  question TEXT NOT NULL,
  answer TEXT,
  answered_by UUID REFERENCES users(id),
  tags VARCHAR(255)[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update appointments table to link to time_slots
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS time_slot_id UUID REFERENCES time_slots(id);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS meeting_link VARCHAR(255);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS price FLOAT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id);

-- Add contact field to listings
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_info VARCHAR(255);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Update subscriptions table with more fields
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS appointments_used INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS appointments_limit INTEGER; -- NULL = unlimited

-- Indexes
CREATE INDEX IF NOT EXISTS idx_marathons_active ON marathons(is_active);
CREATE INDEX IF NOT EXISTS idx_marathon_enrollments_user ON marathon_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_specialist ON time_slots(specialist_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(slot_date);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_user ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_anon_questions ON anonymous_questions(created_at DESC);

-- Seed default time slots for the next 7 days (demo data)
-- This would be done via application logic in production
