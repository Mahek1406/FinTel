
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';

import { connectDatabase } from './db.js';
import { env } from './config/env.js';

import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import ruleRoutes from './routes/ruleRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { requireAuth } from './middleware/auth.js';

const app = express();

// 1. Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5174',
  'https://fintel-frontend.onrender.com'
];

// 2. Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// 3. CORS configuration
app.use(cors({
  origin: allowedOrigins,
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4. Parse JSON requests
app.use(express.json({
  limit: '200kb'
}));

// 5. Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    product: 'Fintel Secure',
    version: '2.0.0'
  });
});

// 6. API routes
app.use('/api/auth', authRoutes);

app.use('/api/uploads/history', requireAuth, historyRoutes);
app.use('/api/uploads', uploadRoutes);

app.use('/api/user', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/admin', adminRoutes);

// 7. Error handling
app.use((error, _req, res, _next) => {

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: error.code === 'LIMIT_FILE_SIZE'
        ? 'CSV exceeds the configured upload size.'
        : error.message
    });
  }

  if (error?.message === 'Only CSV files are accepted.') {
    return res.status(400).json({
      message: error.message
    });
  }

  console.error(error);

  res.status(error?.status || 500).json({
    message: error?.message || 'Internal server error.'
  });
});

// 8. Connect database and start server
connectDatabase()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`[Fintel] API running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error(
      `[Fintel] Local data store failed: ${error.message}`
    );

    process.exitCode = 1;
  });
