const universe = [
  { symbol: 'RELIANCE.NS', display: 'RELIANCE', company: 'Reliance Industries', sector: 'Energy', price: 2954.4, changePct: 0.72, pe: 24.1, roe: 9.8, revenueGrowth: 8.6, dividendYield: 0.34, marketCapCr: 2004000, volume: 5234000, high52: 3217.6, low52: 2220.3 },
  { symbol: 'TCS.NS', display: 'TCS', company: 'Tata Consultancy Services', sector: 'IT', price: 3220.1, changePct: -0.42, pe: 27.3, roe: 49.7, revenueGrowth: 6.5, dividendYield: 1.46, marketCapCr: 1168000, volume: 1723000, high52: 4592.3, low52: 2967.0 },
  { symbol: 'HDFCBANK.NS', display: 'HDFCBANK', company: 'HDFC Bank', sector: 'Financials', price: 914.2, changePct: 1.16, pe: 20.4, roe: 16.8, revenueGrowth: 13.4, dividendYield: 1.14, marketCapCr: 1398000, volume: 8142000, high52: 1015.8, low52: 664.4 },
  { symbol: 'INFY.NS', display: 'INFY', company: 'Infosys', sector: 'IT', price: 1510.5, changePct: -0.18, pe: 24.7, roe: 31.2, revenueGrowth: 7.8, dividendYield: 2.24, marketCapCr: 625000, volume: 2680000, high52: 2006.8, low52: 1358.3 },
  { symbol: 'ICICIBANK.NS', display: 'ICICIBANK', company: 'ICICI Bank', sector: 'Financials', price: 1415.8, changePct: 0.96, pe: 20.1, roe: 17.4, revenueGrowth: 17.2, dividendYield: 0.57, marketCapCr: 990000, volume: 4540000, high52: 1519.0, low52: 1034.0 },
  { symbol: 'SBIN.NS', display: 'SBIN', company: 'State Bank of India', sector: 'Financials', price: 894.9, changePct: 1.84, pe: 10.8, roe: 17.9, revenueGrowth: 10.2, dividendYield: 1.62, marketCapCr: 798000, volume: 9310000, high52: 932.0, low52: 555.0 },
  { symbol: 'BHARTIARTL.NS', display: 'BHARTIARTL', company: 'Bharti Airtel', sector: 'Telecom', price: 1928.4, changePct: 1.28, pe: 33.1, roe: 16.1, revenueGrowth: 11.5, dividendYield: 0.27, marketCapCr: 1201000, volume: 1980000, high52: 2038.0, low52: 1226.1 },
  { symbol: 'ITC.NS', display: 'ITC', company: 'ITC', sector: 'Consumer', price: 451.7, changePct: -0.09, pe: 26.8, roe: 28.4, revenueGrowth: 7.1, dividendYield: 2.98, marketCapCr: 562000, volume: 8410000, high52: 528.5, low52: 399.3 },
  { symbol: 'LT.NS', display: 'LT', company: 'Larsen & Toubro', sector: 'Industrials', price: 3921.3, changePct: 0.64, pe: 31.7, roe: 15.8, revenueGrowth: 17.9, dividendYield: 0.62, marketCapCr: 537000, volume: 1040000, high52: 4250.0, low52: 2617.0 },
  { symbol: 'MARUTI.NS', display: 'MARUTI', company: 'Maruti Suzuki India', sector: 'Auto', price: 14682.2, changePct: -0.74, pe: 28.4, roe: 13.7, revenueGrowth: 10.9, dividendYield: 0.95, marketCapCr: 442000, volume: 246000, high52: 16330.0, low52: 10737.0 },
  { symbol: 'SUNPHARMA.NS', display: 'SUNPHARMA', company: 'Sun Pharmaceutical Industries', sector: 'Healthcare', price: 1682.7, changePct: 1.03, pe: 40.6, roe: 13.1, revenueGrowth: 11.7, dividendYield: 0.74, marketCapCr: 405000, volume: 1110000, high52: 1800.0, low52: 1378.5 },
  { symbol: 'AXISBANK.NS', display: 'AXISBANK', company: 'Axis Bank', sector: 'Financials', price: 1186.7, changePct: -0.52, pe: 16.9, roe: 16.0, revenueGrowth: 16.4, dividendYield: 0.08, marketCapCr: 367000, volume: 3690000, high52: 1339.6, low52: 933.5 },
  { symbol: 'WIPRO.NS', display: 'WIPRO', company: 'Wipro', sector: 'IT', price: 271.2, changePct: 0.21, pe: 23.9, roe: 15.8, revenueGrowth: 2.6, dividendYield: 0.64, marketCapCr: 283000, volume: 3920000, high52: 325.8, low52: 207.1 },
  { symbol: 'HINDUNILVR.NS', display: 'HINDUNILVR', company: 'Hindustan Unilever', sector: 'Consumer', price: 2814.3, changePct: -0.31, pe: 54.2, roe: 20.5, revenueGrowth: 5.3, dividendYield: 1.41, marketCapCr: 662000, volume: 772000, high52: 3035.0, low52: 2166.0 },
  { symbol: 'ZOMATO.NS', display: 'ETERNAL', company: 'Eternal', sector: 'Consumer Tech', price: 298.4, changePct: 2.11, pe: 89.4, roe: 3.4, revenueGrowth: 42.5, dividendYield: 0, marketCapCr: 281000, volume: 10900000, high52: 344.0, low52: 174.0 },
  { symbol: 'BAJFINANCE.NS', display: 'BAJFINANCE', company: 'Bajaj Finance', sector: 'Financials', price: 1023.5, changePct: -1.08, pe: 27.0, roe: 20.1, revenueGrowth: 26.4, dividendYield: 0.12, marketCapCr: 632000, volume: 2250000, high52: 1308.0, low52: 780.0 },
  { symbol: 'TATAMOTORS.NS', display: 'TATAMOTORS', company: 'Tata Motors', sector: 'Auto', price: 693.7, changePct: 1.37, pe: 8.7, roe: 31.0, revenueGrowth: 14.2, dividendYield: 0.43, marketCapCr: 254000, volume: 12500000, high52: 1179.0, low52: 571.0 },
  { symbol: 'ADANIENT.NS', display: 'ADANIENT', company: 'Adani Enterprises', sector: 'Conglomerate', price: 2430.8, changePct: -1.41, pe: 69.5, roe: 5.7, revenueGrowth: 18.9, dividendYield: 0.04, marketCapCr: 280000, volume: 1810000, high52: 3518.0, low52: 1968.0 },
];

const indices = [
  { symbol: '^NSEI', label: 'NIFTY 50', value: 23346.4, change: 75.8, changePct: 0.33 },
  { symbol: '^BSESN', label: 'SENSEX', value: 74314.59, change: -21.86, changePct: -0.03 },
  { symbol: '^NSEBANK', label: 'BANK NIFTY', value: 56055.75, change: -236.7, changePct: -0.42 },
  { symbol: '^NSEIT', label: 'NIFTY IT', value: 29155.6, change: 67.95, changePct: 0.23 },
];

const ipoBoard = [
  { name: 'A-One Steels India', symbol: 'AONE', status: 'upcoming', priceBand: '₹285–405', open: '2026-09-24', close: '2026-09-28', issueSize: '₹405 Cr', issueType: 'Book Built', listingDate: '2026-10-01', exchange: 'NSE/BSE' },
  { name: 'Elevate Campuses', symbol: 'ELEVATE', status: 'upcoming', priceBand: '₹343–362', open: '2026-09-23', close: '2026-09-25', issueSize: '₹2,100 Cr', issueType: 'Book Built', listingDate: '2026-09-30', exchange: 'NSE/BSE' },
  { name: 'Swastika Infra', symbol: 'SWASTIKA', status: 'upcoming', priceBand: '₹175–185', open: '2026-09-23', close: '2026-09-25', issueSize: '₹161 Cr', issueType: 'Book Built', listingDate: '2026-09-30', exchange: 'NSE/BSE' },
  { name: 'Sona Selection India', symbol: 'SONA', status: 'live', priceBand: '₹1,055–1,071', open: '2026-09-17', close: '2026-09-19', issueSize: '₹320 Cr', issueType: 'Book Built', listingDate: '2026-09-25', exchange: 'NSE/BSE' },
  { name: 'Hero Motors', symbol: 'HERO', status: 'live', priceBand: '₹1,750–1,850', open: '2026-09-16', close: '2026-09-18', issueSize: '₹900 Cr', issueType: 'Book Built', listingDate: '2026-09-24', exchange: 'NSE/BSE' },
  { name: 'Orchid Warehousing', symbol: 'ORCHID', status: 'recent', priceBand: '₹512–540', open: '2026-09-01', close: '2026-09-03', issueSize: '₹275 Cr', issueType: 'Book Built', listingDate: '2026-09-08', exchange: 'NSE/BSE' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const yahooQuote = async (symbol) => {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=3mo&interval=1d`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6500), headers: { 'User-Agent': 'Mozilla/5.0 FintelSecure/2.0' } });
    if (!response.ok) throw new Error(`Yahoo ${response.status}`);
    const json = await response.json();
    const result = json?.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta?.regularMarketPrice) throw new Error('No quote returned');
    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];
    const history = timestamps.map((ts, i) => ({ date: new Date(ts * 1000).toISOString().slice(0, 10), close: closes[i] })).filter((p) => Number.isFinite(p.close));
    const previous = meta.chartPreviousClose ?? meta.previousClose ?? meta.regularMarketPrice;
    const change = meta.regularMarketPrice - previous;
    return {
      price: meta.regularMarketPrice,
      change,
      changePct: previous ? change / previous * 100 : 0,
      high: meta.regularMarketDayHigh ?? meta.regularMarketPrice,
      low: meta.regularMarketDayLow ?? meta.regularMarketPrice,
      volume: meta.regularMarketVolume ?? 0,
      currency: meta.currency || 'INR',
      history,
      source: 'Yahoo Finance',
    };
  } catch {
    return null;
  }
};

export const listStocks = async ({ query = '', sector = 'All' } = {}) => {
  const q = query.trim().toLowerCase();
  return universe.filter((stock) => {
    const matchesQuery = !q || [stock.display, stock.company, stock.symbol, stock.sector].some((v) => v.toLowerCase().includes(q));
    return matchesQuery && (sector === 'All' || stock.sector === sector);
  });
};

export const getStock = async (symbol) => {
  const base = universe.find((s) => s.symbol.toLowerCase() === symbol.toLowerCase() || s.display.toLowerCase() === symbol.toLowerCase());
  if (!base) return null;
  const live = await yahooQuote(base.symbol);
  if (live) return { ...base, ...live, isLive: true };
  const history = Array.from({ length: 30 }, (_, i) => {
    const factor = 1 + (i - 14) * 0.003 + Math.sin(i * 0.73) * 0.018;
    return { date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10), close: Number((base.price * factor).toFixed(2)) };
  });
  return {
    ...base,
    change: base.price * base.changePct / 100,
    high: base.price * 1.018,
    low: base.price * 0.984,
    currency: 'INR',
    history,
    source: 'Fintel reference feed',
    isLive: false,
  };
};

export const getIndices = async () => {
  const live = await Promise.all(indices.map(async (index) => {
    const quote = await yahooQuote(index.symbol);
    return quote ? { ...index, value: quote.price, change: quote.change, changePct: quote.changePct, source: quote.source } : { ...index, source: 'Fintel reference feed' };
  }));
  return live;
};

export const getMarketOverview = async () => {
  const stocks = await listStocks();
  return {
    indices: await getIndices(),
    topGainers: [...stocks].sort((a, b) => b.changePct - a.changePct).slice(0, 5),
    topLosers: [...stocks].sort((a, b) => a.changePct - b.changePct).slice(0, 5),
    mostActive: [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 10),
    sectors: [...new Set(stocks.map((s) => s.sector))].sort(),
    source: 'Yahoo Finance when reachable; reference market universe otherwise',
  };
};

export const getIpos = async (status = 'all') => {
  await sleep(40);
  return status === 'all' ? ipoBoard : ipoBoard.filter((ipo) => ipo.status === status);
};

export const screenStocks = async (filters = {}) => {
  const { query = '', sector = 'All', minPe, maxPe, minRoe, minGrowth, minDividend, maxPrice } = filters;
  const stocks = await listStocks({ query, sector });
  return stocks.filter((s) =>
    (minPe === '' || minPe == null || s.pe >= Number(minPe)) &&
    (maxPe === '' || maxPe == null || s.pe <= Number(maxPe)) &&
    (minRoe === '' || minRoe == null || s.roe >= Number(minRoe)) &&
    (minGrowth === '' || minGrowth == null || s.revenueGrowth >= Number(minGrowth)) &&
    (minDividend === '' || minDividend == null || s.dividendYield >= Number(minDividend)) &&
    (maxPrice === '' || maxPrice == null || s.price <= Number(maxPrice))
  );
};
