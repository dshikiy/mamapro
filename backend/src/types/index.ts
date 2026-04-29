// User
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'user' | 'specialist' | 'admin';
  avatar?: string;
  bio?: string;
  subscription: 'free' | 'basic' | 'pro';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

// Specialist
export interface Specialist {
  id: string;
  userId: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  specialty: string;
  rating: number;
  price: number;
  availability: AvailabilitySlot[];
  createdAt: Date;
}

export interface AvailabilitySlot {
  day: string;
  slots: string[];
}

// Appointment
export interface Appointment {
  id: string;
  userId: string;
  specialistId: string;
  dateTime: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

// Course
export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'parenting' | 'psychology' | 'postpartum' | 'stress' | 'relationships';
  lessons: Lesson[];
  instructor: string;
  image: string;
  duration: number;
  createdAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  youtubeUrl: string;
  duration: number;
  order: number;
}

// Daily Task
export interface DailyTask {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  dueDate: Date;
  createdAt: Date;
}

// Marketplace Listing
export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price?: number;
  status: 'active' | 'sold' | 'removed';
  createdAt: Date;
  updatedAt: Date;
}

// Subscription
export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'basic' | 'pro';
  startDate: Date;
  endDate: Date;
  active: boolean;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
