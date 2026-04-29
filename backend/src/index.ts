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

// Middleware
import { errorHandler } from './middleware/errorHandler';

const app: Express = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/specialists', specialistsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`Environment: ${config.env}`);
});

export default app;
