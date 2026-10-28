import { Router } from 'express';
import Upload from '../models/Upload.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { csvUpload } from '../middleware/uploadValidation.js';
import { parseCsvUpload } from '../services/csvService.js';
import { benchmarkRows } from '../services/benchmarkService.js';
import { analyzeUpload } from '../services/uploadAnalysis.js';

const router = Router();

router.post('/', requireAuth, csvUpload.array('files', 10), async (req, res, next) => {
  try {
    if (!req.files?.length) return res.status(400).json({ message: 'Select at least one CSV file.' });
    const uploads = [];
    for (const file of req.files) {
      const parsed = parseCsvUpload(file);
      const benchmark = await benchmarkRows(parsed.rows, parsed.headers);
      const upload = await Upload.create({ owner: req.user._id, filename: file.originalname, size: file.size, ...parsed, ...benchmark });
      uploads.push(analyzeUpload(upload));
    }
    res.status(201).json({ uploads });
  } catch (error) { next(error); }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { owner: req.user._id };
    const uploads = await Upload.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ uploads: uploads.map(analyzeUpload) });
  } catch (error) { next(error); }
});

router.get('/admin/all', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const uploads = await Upload.find({}).sort({ createdAt: -1 }).limit(200);
    res.json({ uploads: uploads.map(analyzeUpload) });
  } catch (error) { next(error); }
});

router.get('/:uploadId', requireAuth, async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? { _id: req.params.uploadId } : { _id: req.params.uploadId, owner: req.user._id };
    const upload = await Upload.findOne(filter);
    if (!upload) return res.status(404).json({ message: 'Dataset not found.' });
    res.json({ upload: analyzeUpload(upload) });
  } catch (error) { next(error); }
});

router.patch('/:uploadId/transactions/:transactionIndex/review', requireAuth, async (req, res, next) => {
  try {
    const index = Number(req.params.transactionIndex);
    const status = req.body?.status;
    if (!Number.isInteger(index) || index < 0 || !['safe', 'fraud'].includes(status)) return res.status(400).json({ message: 'Valid transaction index and review status are required.' });
    const filter = req.user.role === 'admin' ? { _id: req.params.uploadId } : { _id: req.params.uploadId, owner: req.user._id };
    const upload = await Upload.findOne(filter);
    if (!upload || index >= upload.rows.length) return res.status(404).json({ message: 'Transaction not found.' });
    const note = String(req.body?.note || '').trim().slice(0, 500);
    const existing = upload.riskReviews.find((r) => r.transactionIndex === index);
    if (existing) Object.assign(existing, { status, note, reviewedAt: new Date(), reviewedBy: req.user._id });
    else upload.riskReviews.push({ transactionIndex: index, status, note, reviewedBy: req.user._id });
    await upload.save();
    res.json({ upload: analyzeUpload(upload) });
  } catch (error) { next(error); }
});

export default router;
