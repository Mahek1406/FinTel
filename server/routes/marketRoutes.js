import { Router } from 'express';
import { getIndices, getIpos, getMarketOverview, getStock, listStocks, screenStocks } from '../services/marketService.js';

const router = Router();
router.get('/overview', async (_req, res, next) => { try { res.json(await getMarketOverview()); } catch (e) { next(e); } });
router.get('/indices', async (_req, res, next) => { try { res.json({ indices: await getIndices() }); } catch (e) { next(e); } });
router.get('/stocks', async (req, res, next) => { try { res.json({ stocks: await listStocks({ query: req.query.q || '', sector: req.query.sector || 'All' }) }); } catch (e) { next(e); } });
router.get('/stocks/:symbol', async (req, res, next) => { try { const stock = await getStock(req.params.symbol); if (!stock) return res.status(404).json({ message: 'Stock not found.' }); res.json({ stock }); } catch (e) { next(e); } });
router.get('/ipos', async (req, res, next) => { try { res.json({ ipos: await getIpos(req.query.status || 'all') }); } catch (e) { next(e); } });
router.get('/screener', async (req, res, next) => { try { res.json({ stocks: await screenStocks(req.query) }); } catch (e) { next(e); } });
export default router;
