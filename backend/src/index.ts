import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config/env';

// Routes
import authRoutes from './routes/auth';
import specialistsRoutes from './routes/specialists';
import appointmentsRoutes from './routes/appointments';
import coursesRoutes from './routes/courses';
import tasksRoutes from './routes/tasks';
import marketplaceRoutes from './routes/marketplace';
import marathonsRoutes from './routes/marathons';
import profileRoutes from './routes/profile';
import adminRoutes from './routes/admin';
import chatRoutes from './routes/chat';
import subscriptionRoutes from './routes/subscription';
import contentRoutes from './routes/content';
import postRoutes from './routes/posts';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { initDb } from './config/initDb';

const app: Express = express();

// Список разрешенных адресов (добавь сюда свой домен Vercel, если он изменится)
const allowedOrigins = [
  'https://mamapro-7inj.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002'
];

app.use(cors({
  // Явно указываем типы для origin и callback, чтобы пройти проверку TypeScript
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Разрешаем запросы без origin (например, мобильные приложения или curl)
    if (!origin) return callback(null, true);

    // Проверяем, есть ли адрес в списке разрешенных или является ли он localhost
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost')) {
      callback(null, true);
    } else {
      console.log('🛑 CORS Blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/specialists', specialistsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/marathons', marathonsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MamaPro Server is running 🌸',
    version: '2.0.0',
    env: config.env
  });
});

// Error handling
app.use(errorHandler);

// Start server
const port = config.port;
app.listen(port, '0.0.0.0', async () => {
  try {
    // Инициализация базы данных (создание таблиц)
    await initDb();
    console.log(`🚀 MamaPro Server running on port ${port}`);
    console.log(`🌱 Environment: ${config.env}`);
    // Выводим список разрешенных CORS из конфига для проверки
    console.log(`📡 CORS Origins configured: ${config.corsOrigin.join(', ')}`);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
  }
});

export default app;