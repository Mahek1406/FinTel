import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import { uploadsApi } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const DataContext = createContext(null);
const numeric = (v) => { const n = Number(String(v ?? '').replace(/[₹$€£,\s]/g, '')); return Number.isFinite(n) ? n : null; };
const normalizeHeader = (h) => String(h ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const findField = (headers, aliases) => { const map = new Map(headers.map((h) => [normalizeHeader(h), h])); return aliases.map((x) => map.get(x)).find(Boolean) || null; };
const enrich = (upload) => {
  const rows = upload.rows || [], headers = upload.headers || [], risk = upload.riskAnalysis || {};
  const amountField = risk.amountField || findField(headers, ['amount','transaction_amount','value','transaction_value','price','total','cost','debit','credit']);
  const dateField = risk.dateField || findField(headers, ['date','timestamp','transaction_date','datetime','time']);
  const categoryField = risk.categoryField || findField(headers, ['category','type','transaction_type','payment_type','channel','region','merchant','product']);
  const amounts = rows.map((r) => numeric(r[amountField])).filter((v) => v !== null);
  const categoryMap = {};
  const dateMap = {};
  if (categoryField) rows.forEach((r) => { const k = String(r[categoryField] ?? 'Unknown'); categoryMap[k] = (categoryMap[k] || 0) + 1; });
  if (dateField) rows.forEach((r) => { const d = new Date(r[dateField]); if (!Number.isNaN(d.valueOf())) { const k = d.toISOString().slice(0,10); dateMap[k] = (dateMap[k] || 0) + 1; } });
  const total = amounts.reduce((a,b) => a+b,0);
  return { ...upload, id: upload._id || upload.id, name: upload.filename, totalTransactions: rows.length, averageValue: amounts.length ? Number((total / amounts.length).toFixed(2)) : null, minValue: amounts.length ? Math.min(...amounts) : null, maxValue: amounts.length ? Math.max(...amounts) : null, categoryCounts: Object.keys(categoryMap).length ? { labels: Object.keys(categoryMap), values: Object.values(categoryMap) } : null, dateTrend: Object.keys(dateMap).length ? { labels: Object.keys(dateMap).sort(), values: Object.keys(dateMap).sort().map((k) => dateMap[k]) } : null, numericField: amountField, categoryField, dateField };
};

export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!currentUser) { setFiles([]); return; }
    setLoading(true);
    try { const result = await uploadsApi.list(); setFiles((result.uploads || []).map(enrich)); }
    catch (error) { console.error(error); }
    finally { setLoading(false); }
  }, [currentUser]);

  useEffect(() => { load(); }, [load]);

  const addFiles = useCallback(async (selected) => { const result = await uploadsApi.create(selected); const mapped = (result.uploads || []).map(enrich); setFiles((current) => [...mapped, ...current]); return mapped; }, []);
  const updateReview = useCallback(async (uploadId, transactionIndex, status, note = '') => { const result = await uploadsApi.review(uploadId, transactionIndex, status, note); const mapped = enrich(result.upload); setFiles((current) => current.map((f) => f.id === mapped.id ? mapped : f)); return mapped; }, []);

  const localParse = useCallback((file) => new Promise((resolve, reject) => { Papa.parse(file, { header: true, skipEmptyLines: true, complete: (r) => r.errors?.length ? reject(new Error('Unable to preview CSV.')) : resolve(r.data) }); }), []);

  const value = useMemo(() => ({ files, loading, load, addFiles, updateReview, localParse }), [files, loading, load, addFiles, updateReview, localParse]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
export const useData = () => { const context = useContext(DataContext); if (!context) throw new Error('useData must be used within DataProvider'); return context; };
