const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'fintel-secure-token';
let accessToken = sessionStorage.getItem(TOKEN_KEY);

const request = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.message || `Request failed (${response.status})`); error.status = response.status; throw error; }
  return data;
};

export const setAccessToken = (token) => { accessToken = token || null; if (accessToken) sessionStorage.setItem(TOKEN_KEY, accessToken); else sessionStorage.removeItem(TOKEN_KEY); };
export const getAccessToken = () => accessToken;

export const authApi = {
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
};
export const userApi = { upgrade: () => request('/user/upgrade', { method: 'POST' }) };
export const uploadsApi = {
  list: () => request('/uploads'),
  get: (id) => request(`/uploads/${id}`),
  history: () => request('/uploads/history'),
  create: (files) => { const body = new FormData(); Array.from(files).forEach((file) => body.append('files', file)); return request('/uploads', { method: 'POST', body }); },
  review: (uploadId, transactionIndex, status, note = '') => request(`/uploads/${uploadId}/transactions/${transactionIndex}/review`, { method: 'PATCH', body: JSON.stringify({ status, note }) }),
};
export const complaintApi = {
  mine: () => request('/complaints/mine'),
  all: () => request('/complaints/admin/all'),
  create: (body) => request('/complaints', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/complaints/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
};
export const marketApi = {
  overview: () => request('/market/overview'),
  indices: () => request('/market/indices'),
  stocks: (q = '', sector = 'All') => request(`/market/stocks?q=${encodeURIComponent(q)}&sector=${encodeURIComponent(sector)}`),
  stock: (symbol) => request(`/market/stocks/${encodeURIComponent(symbol)}`),
  ipos: (status = 'all') => request(`/market/ipos?status=${encodeURIComponent(status)}`),
  screener: (params = {}) => { const qs = new URLSearchParams(params).toString(); return request(`/market/screener${qs ? `?${qs}` : ''}`); },
};
export const caseApi = {
  list: () => request('/cases'),
  create: (body) => request('/cases', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/cases/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  timeline: (id, text) => request(`/cases/${id}/timeline`, { method: 'POST', body: JSON.stringify({ text }) }),
};
export const ruleApi = {
  list: () => request('/rules'),
  create: (body) => request('/rules', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/rules/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  test: (body) => request('/rules/test', { method: 'POST', body: JSON.stringify(body) }),
};
export const adminApi = { risk: () => request('/admin/risk') };
