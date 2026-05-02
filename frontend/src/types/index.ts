export type User = {
  id: string;
  email: string;
  name: string;
  role: 'mother' | 'specialist' | 'admin';
  avatar?: string;
  bio?: string;
  subscription: 'free' | 'basic' | 'pro';
  createdAt: string;
};

export type Specialist = {
  id: string;
  user_id?: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  specialty: string;
  rating: number;
  price: number;
  availability: {
    day: string;
    slots: string[];
  }[];
  slots?: {
    id: string;
    slot_date: string;
    slot_time: string;
    is_booked: boolean;
  }[];
};

export type Appointment = {
  id: string;
  userId: string;
  specialistId: string;
  specialist: Specialist;
  dateTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'upcoming';
  notes?: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  lessons: Lesson[];
  instructor: string;
  image: string;
  duration: number;
  is_pro: boolean;
  completedLessonIds?: string[];
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  duration: number;
  order: number;
  completed?: boolean;
};

export type DailyTask = {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  dueDate: string;
};

export type Listing = {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price?: number;
  contact_info?: string;
  status: 'active' | 'sold' | 'removed';
  createdAt: string;
  updatedAt: string;
};

export type DiaryEntry = {
  id: string;
  userId: string;
  text: string;
  mood?: string;
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
