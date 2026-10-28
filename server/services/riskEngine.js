const NORMALIZE = (text) => String(text ?? '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

const FIELD_ALIASES = {
  amount: ['amount', 'transaction_amount', 'value', 'transaction_value', 'amount_usd', 'price', 'total', 'cost', 'debit', 'credit'],
  date: ['timestamp', 'date', 'transaction_date', 'datetime', 'time', 'created_at', 'transaction_time'],
  entity: ['customer', 'customer_id', 'account', 'account_id', 'merchant', 'merchant_id', 'client', 'client_id', 'user_id', 'name'],
  category: ['category', 'type', 'transaction_type', 'payment_type', 'channel', 'product', 'region', 'status'],
};

const parseNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value == null) return null;
  const cleaned = String(value).replace(/[₹$€£,\s]/g, '').trim();
  if (!cleaned || !/^-?(\d+(\.\d+)?|\.\d+)$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

const parseDate = (value) => {
  if (value == null || value === '') return null;
  const text = String(value).trim();
  if (/^\d{8,18}$/.test(text)) return null;
  const date = new Date(text);
  return Number.isNaN(date.valueOf()) ? null : date;
};

const findField = (headers, aliases) => {
  const normalized = new Map(headers.map((h) => [NORMALIZE(h), h]));
  for (const alias of aliases) if (normalized.has(alias)) return normalized.get(alias);
  return null;
};

const detectField = (headers, rows, kind) => {
  const direct = findField(headers, FIELD_ALIASES[kind]);
  if (direct) {
    const usable = rows.filter((r) => (kind === 'amount' ? parseNumber(r[direct]) !== null : kind === 'date' ? parseDate(r[direct]) !== null : r[direct] != null && String(r[direct]).trim() !== '')).length;
    if (usable / Math.max(rows.length, 1) >= (kind === 'amount' ? .55 : .35)) return direct;
  }
  if (kind === 'amount') {
    const candidate = headers.find((h) => {
      const values = rows.map((r) => parseNumber(r[h])).filter((v) => v !== null);
      return values.length / Math.max(rows.length, 1) >= .8;
    });
    return candidate || null;
  }
  if (kind === 'date') {
    return headers.find((h) => rows.filter((r) => parseDate(r[h])).length / Math.max(rows.length, 1) >= .7) || null;
  }
  if (kind === 'entity') {
    return headers.find((h) => {
      const values = rows.map((r) => String(r[h] ?? '').trim()).filter(Boolean);
      const unique = new Set(values).size;
      return unique > 1 && unique < rows.length * .95 && unique >= 2;
    }) || null;
  }
  return null;
};

const percentile = (value, sorted) => {
  if (value == null || !sorted.length) return .5;
  let lo = 0, hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= value) lo = mid + 1; else hi = mid;
  }
  return lo / sorted.length;
};

const median = (values) => {
  const arr = [...values].sort((a, b) => a - b);
  if (!arr.length) return null;
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
};

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const level = (score) => score >= 65 ? 'HIGH' : score >= 35 ? 'MEDIUM' : 'LOW';

const duplicateSignature = (row) => JSON.stringify(row, Object.keys(row).sort());

export const scoreTransactions = (rows = [], headers = []) => {
  const amountField = detectField(headers, rows, 'amount');
  const dateField = detectField(headers, rows, 'date');
  const entityField = detectField(headers, rows, 'entity');
  const categoryField = detectField(headers, rows, 'category');

  const amounts = amountField ? rows.map((r) => parseNumber(r[amountField])).filter((v) => v !== null) : [];
  const sortedAmounts = [...amounts].sort((a, b) => a - b);
  const med = median(amounts);
  const deviations = med == null ? [] : amounts.map((v) => Math.abs(v - med));
  const mad = median(deviations) || 0;

  const entityCounts = new Map();
  const categoryCounts = new Map();
  const duplicateCounts = new Map();
  const entityTimes = new Map();
  rows.forEach((row, i) => {
    if (entityField) {
      const entity = String(row[entityField] ?? 'Unknown').trim().toLowerCase();
      entityCounts.set(entity, (entityCounts.get(entity) || 0) + 1);
    }
    if (categoryField) {
      const cat = String(row[categoryField] ?? 'Unknown').trim().toLowerCase();
      categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
    }
    const sig = duplicateSignature(row);
    duplicateCounts.set(sig, (duplicateCounts.get(sig) || 0) + 1);
    if (entityField && dateField) {
      const entity = String(row[entityField] ?? 'Unknown').trim().toLowerCase();
      const date = parseDate(row[dateField]);
      if (date) {
        if (!entityTimes.has(entity)) entityTimes.set(entity, []);
        entityTimes.get(entity).push(date.getTime());
      }
    }
  });

  const transactions = rows.map((row, index) => {
    const amount = amountField ? parseNumber(row[amountField]) : null;
    const date = dateField ? parseDate(row[dateField]) : null;
    const entity = entityField ? String(row[entityField] ?? 'Unknown').trim().toLowerCase() : null;
    const category = categoryField ? String(row[categoryField] ?? 'Unknown').trim().toLowerCase() : null;
    const duplicateCount = duplicateCounts.get(duplicateSignature(row)) || 1;
    const entityFrequency = entity ? entityCounts.get(entity) || 1 : 1;
    const categoryFrequency = category ? categoryCounts.get(category) || 1 : 1;

    const amountPercentile = percentile(amount, sortedAmounts) * 100;
    const amountRobust = amount == null || med == null ? 0 : clamp(Math.abs(amount - med) / Math.max(med, 1) * 38 + (mad ? Math.abs(amount - med) / Math.max(3 * mad, 1) * 17 : 0), 0, 55);
    const rarityScore = entityField ? clamp(20 - Math.min(entityFrequency, 20), 0, 20) : categoryField ? clamp(10 - Math.min(categoryFrequency, 10), 0, 10) : 0;

    let velocityScore = 0;
    if (entity && date && entityTimes.has(entity)) {
      const times = entityTimes.get(entity);
      let nearby = 0;
      for (const t of times) if (t !== date.getTime() && Math.abs(t - date.getTime()) <= 60 * 60 * 1000) nearby += 1;
      velocityScore = clamp((nearby - 1) * 6, 0, 18);
    }

    const weekend = date ? [0, 6].includes(date.getDay()) : false;
    const offHours = date ? date.getHours() < 6 || date.getHours() >= 22 : false;
    const timingScore = (weekend ? 5 : 0) + (offHours ? 7 : 0);
    const duplicateScore = duplicateCount > 1 ? clamp(14 + (duplicateCount - 2) * 4, 14, 25) : 0;
    const invalidAmountScore = amount != null && amount <= 0 ? 24 : 0;
    const rareCategoryScore = categoryField && categoryFrequency === 1 ? 6 : 0;

    const riskScore = Math.round(clamp(amountRobust + rarityScore + velocityScore + timingScore + duplicateScore + invalidAmountScore + rareCategoryScore));
    const anomalyScore = Math.round(clamp(amountRobust * .9 + rarityScore * 1.2 + velocityScore * 1.1 + duplicateScore * 1.15 + timingScore + invalidAmountScore * 1.2 + rareCategoryScore));

    const factors = [];
    if (invalidAmountScore) factors.push({ code: 'INVALID_AMOUNT', label: 'Amount is zero or negative', weight: invalidAmountScore });
    if (duplicateScore) factors.push({ code: 'DUPLICATE', label: `Duplicate transaction pattern (${duplicateCount} matching records)`, weight: duplicateScore });
    if (amountRobust >= 30) factors.push({ code: 'AMOUNT_OUTLIER', label: 'Transaction amount is materially outside the dataset baseline', weight: Math.round(amountRobust) });
    else if (amountRobust >= 16) factors.push({ code: 'AMOUNT_DEVIATION', label: 'Transaction amount deviates from the dataset median', weight: Math.round(amountRobust) });
    if (velocityScore >= 8) factors.push({ code: 'VELOCITY', label: 'Multiple related transactions occurred within a short window', weight: Math.round(velocityScore) });
    if (rarityScore >= 12) factors.push({ code: 'RARITY', label: 'Activity is rare for the detected account or entity', weight: Math.round(rarityScore) });
    if (timingScore >= 5) factors.push({ code: 'TIMING', label: weekend && offHours ? 'Weekend and off-hours activity detected' : weekend ? 'Weekend transaction detected' : 'Off-hours transaction detected', weight: timingScore });
    if (rareCategoryScore) factors.push({ code: 'RARE_CATEGORY', label: 'Category occurs only once in the dataset', weight: rareCategoryScore });
    factors.sort((a, b) => b.weight - a.weight);
    if (!factors.length) factors.push({ code: 'BASELINE', label: 'Transaction aligns with the observed dataset pattern', weight: 0 });

    return {
      transactionIndex: index,
      riskScore,
      anomalyScore,
      riskLevel: level(riskScore),
      reviewReason: factors[0].label,
      factors,
      metrics: {
        amount,
        amountPercentile: Math.round(amountPercentile),
        medianAmount: med == null ? null : Number(med.toFixed(2)),
        entityFrequency,
        categoryFrequency,
        nearbyTransactions: velocityScore ? Math.round(velocityScore / 6 + 1) : 0,
        duplicateCount,
        weekend,
        offHours,
      },
    };
  });

  const counts = transactions.reduce((acc, item) => {
    acc[item.riskLevel] += 1;
    return acc;
  }, { LOW: 0, MEDIUM: 0, HIGH: 0 });

  return {
    amountField,
    dateField,
    entityField,
    categoryField,
    transactions,
    counts,
    highRiskPercentage: rows.length ? Math.round(counts.HIGH / rows.length * 100) : 0,
    mediumOrHighPercentage: rows.length ? Math.round((counts.HIGH + counts.MEDIUM) / rows.length * 100) : 0,
  };
};
