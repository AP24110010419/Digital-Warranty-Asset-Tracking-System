import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import warrantyRoutes from './routes/warrantyRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Load environment variables
dotenv.config();

// Initialize app

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
connectDB();

// Middleware
app.use(helmet());
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];
const localOriginPattern = /^https?:\/\/localhost(?::\d+)?$/;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || localOriginPattern.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/warranties`, warrantyRoutes);
app.use(`${API_PREFIX}/maintenance`, maintenanceRoutes);
app.use(`${API_PREFIX}/ai`, aiRoutes);

// Health check
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const DEFAULT_PORT = 5000;
const desiredPort = Number(process.env.PORT) || DEFAULT_PORT;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      if (port === DEFAULT_PORT && !process.env.PORT) {
        const fallbackPort = DEFAULT_PORT + 1;
        console.warn(`Port ${port} is already in use. Trying ${fallbackPort}...`);
        startServer(fallbackPort);
      } else {
        console.error(`Port ${port} is already in use. Set a different PORT in your environment and restart.`);
        process.exit(1);
      }
    } else {
      console.error(`Server error: ${error.message}`);
      process.exit(1);
    }
  });

  return server;
};

const server = startServer(desiredPort);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
