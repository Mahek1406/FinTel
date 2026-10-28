import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, isPremium: Boolean(u.isPremium) });
const tokenFor = (u) => jwt.sign({ sub: u._id.toString(), role: u.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name?.trim() || !email?.trim() || typeof password !== 'string' || password.length < 8) return res.status(400).json({ message: 'Name, email and a password of at least 8 characters are required.' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
    return res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const normalizedEmail = req.body?.email?.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user || typeof req.body?.password !== 'string' || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password.' });
    return res.json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.post('/verify-password', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+passwordHash');
    const valid = Boolean(user && typeof req.body?.password === 'string' && await bcrypt.compare(req.body.password, user.passwordHash));
    if (!valid) return res.status(401).json({ verified: false, message: 'Password verification failed.' });
    return res.json({ verified: true });
  } catch (error) { next(error); }
});

router.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

export default router;
