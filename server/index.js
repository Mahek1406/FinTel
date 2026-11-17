
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
  'http://localhost:5173',
  'https://fintel-frontend.onrender.com'
];

// 2. CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    // (health checks and server-to-server requests)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

// 3. Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// 4. Enable CORS and preflight requests
app.use(cors(corsOptions));

// 5. Parse JSON
app.use(express.json({
  limit: '200kb'
}));

// 6. Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    product: 'Fintel Secure',
    version: '2.0.0'
  });
});

// 7. API routes
app.use('/api/auth', authRoutes);

app.use('/api/uploads/history', requireAuth, historyRoutes);
app.use('/api/uploads', uploadRoutes);

app.use('/api/user', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/admin', adminRoutes);

// 8. Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: 'API endpoint not found.',
    path: req.originalUrl
  });
});

// 9. Error handling
app.use((error, req, res, next) => {
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

  if (error?.message === 'Origin not allowed by CORS') {
    return res.status(403).json({
      message: 'Frontend origin is not allowed.'
    });
  }

  console.error('[Fintel Error]:', error);

  res.status(error?.status || 500).json({
    message: error?.message || 'Internal server error.'
  });
});

// 10. Connect database and start server
connectDatabase()
  .then(() => {
    app.listen(env.port, '0.0.0.0', () => {
      console.log(`[Fintel] API running on port ${env.port}`);
      console.log('[Fintel] CORS configured successfully');
    });
  })
  .catch((error) => {
    console.error(
      `[Fintel] Database connection failed: ${error.message}`
    );

    process.exit(1);
  });
