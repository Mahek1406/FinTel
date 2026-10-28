import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export default function ProtectedRoute({ children }) {
  const { currentUser, authReady } = useAuth();
  if (!authReady) return <div className="min-h-screen grid place-items-center bg-[#090d12] text-slate-500">Loading…</div>;
  return currentUser ? children : <Navigate to="/login" replace />;
}
