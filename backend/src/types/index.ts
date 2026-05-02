export type UserRole = 'mother' | 'specialist' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  subscription: 'free' | 'basic' | 'pro';
  created_at: Date;
  updated_at: Date;
}

export interface Specialist {
  id: string;
  user_id: string;
  name: string;
  title: string;
  bio?: string;
  avatar?: string;
  specialty: string;
  rating: number;
  price: number;
  availability?: any;
  created_at: Date;
}

export interface TimeSlot {
  id: string;
  specialist_id: string;
  slot_date: string;
  slot_time: string;
  is_booked: boolean;
  created_at: Date;
}

export interface Appointment {
  id: string;
  user_id: string;
  specialist_id: string;
  date_time: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  time_slot_id?: string;
  meeting_link?: string;
  price?: number;
  payment_id?: string;
  created_at: Date;
}

export interface Marathon {
  id: string;
  title: string;
  description?: string;
  duration_days: number;
  price: number;
  image?: string;
  instructor_id?: string;
  is_active: boolean;
  created_at: Date;
}

export interface MarathonEnrollment {
  id: string;
  user_id: string;
  marathon_id: string;
  started_at: Date;
  current_day: number;
  completed: boolean;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  image?: string;
  price?: number;
  status: 'active' | 'sold' | 'removed';
  contact_info?: string;
  city?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'basic' | 'pro';
  start_date: Date;
  end_date: Date;
  active: boolean;
  appointments_used: number;
  appointments_limit?: number; // null = unlimited
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  type: 'subscription' | 'appointment' | 'marathon' | 'marketplace_listing';
  reference_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description?: string;
  created_at: Date;
}

export interface DiaryEntry {
  id: string;
  user_id: string;
  text: string;
  mood?: string;
  created_at: Date;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  instructor?: string;
  image?: string;
  duration?: number;
  created_at: Date;
}

export interface JwtPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}
