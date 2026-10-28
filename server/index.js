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
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: env.clientOrigin, credentials: false }));
app.use(express.json({ limit: '200kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', product: 'Fintel Secure', version: '2.0.0' }));
app.use('/api/auth', authRoutes);
app.use('/api/uploads/history', requireAuth, historyRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/user', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/admin', adminRoutes);
app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) return res.status(400).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'CSV exceeds the configured upload size.' : error.message });
  if (error?.message === 'Only CSV files are accepted.') return res.status(400).json({ message: error.message });
  console.error(error);
  res.status(error?.status || 500).json({ message: error?.message || 'Internal server error.' });
});

connectDatabase()
  .then(() => app.listen(env.port, () => console.log(`[Fintel] API running at http://localhost:${env.port}`)))
  .catch((error) => { console.error(`[Fintel] Local data store failed: ${error.message}`); process.exitCode = 1; });
