import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { authApi, complaintApi, setAccessToken, userApi } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [authReady] = useState(true);

  const loadComplaints = useCallback(async () => {
    if (!currentUser) return [];
    const result = currentUser.role === 'admin' ? await complaintApi.all() : await complaintApi.mine();
    setComplaints(result.complaints || []);
    return result.complaints || [];
  }, [currentUser]);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login({ email, password });
    setAccessToken(result.token);
    setCurrentUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(() => { setAccessToken(null); setCurrentUser(null); setComplaints([]); }, []);

  const signUp = useCallback(async (name, email, password) => {
    const result = await authApi.signup({ name, email, password });
    return result.user;
  }, []);

  const upgradeToPremium = useCallback(async () => {
    const result = await userApi.upgrade();
    setCurrentUser(result.user);
    toast.success('Premium access enabled.');
    return result.user;
  }, []);

  const addComplaint = useCallback(async ({ subject, description }) => {
    const result = await complaintApi.create({ subject, description });
    setComplaints((current) => [result.complaint, ...current]);
    return result.complaint;
  }, []);

  const updateComplaint = useCallback(async (id, body) => {
    const result = await complaintApi.update(id, body);
    setComplaints((current) => current.map((c) => c.id === id ? result.complaint : c));
    return result.complaint;
  }, []);

  const value = useMemo(() => ({ currentUser, authReady, complaints, login, logout, signUp, loadComplaints, upgradeToPremium, addComplaint, updateComplaint }), [currentUser, authReady, complaints, login, logout, signUp, loadComplaints, upgradeToPremium, addComplaint, updateComplaint]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
