import AdminDashboardPage from './AdminDashboardPage.jsx';
import UserDashboardPage from './UserDashboardPage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
export default function DashboardPage() { const { currentUser } = useAuth(); return currentUser?.role === 'admin' ? <AdminDashboardPage /> : <UserDashboardPage />; }
