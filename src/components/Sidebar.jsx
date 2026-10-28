import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Activity, BarChart3, BookOpen, BriefcaseBusiness, ChevronLeft, ChevronRight, Database, FileClock, Files, LayoutDashboard, LogOut, Search, Shield, SlidersHorizontal, TrendingUp, WalletCards } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../logo.png';

const userLinks = [
  ['Dashboard', '/dashboard', LayoutDashboard],
  ['Data Upload', '/upload', Database],
  ['Processing', '/processing', Activity],
  ['Insights', '/visualization', BarChart3],
  ['Transaction History', '/history', FileClock],
  ['Security', '/security', Shield],
  ['Cases', '/cases', Files],
  ['Rules Lab', '/rules', SlidersHorizontal],
];
const marketLinks = [
  ['Market', '/market', TrendingUp],
  ['Stocks', '/stocks', Search],
  ['IPOs', '/ipos', BriefcaseBusiness],
  ['Screener', '/screener', SlidersHorizontal],
  ['Paper Portfolio', '/portfolio', WalletCards],
  ['Learn', '/learn', BookOpen],
];

export default function Sidebar({ isSidebarOpen, onToggle }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const links = currentUser?.role === 'admin' ? [['Dashboard', '/dashboard', LayoutDashboard], ['Risk Command Center', '/admin/risk', Shield], ['Cases', '/cases', Files], ['Market', '/market', TrendingUp]] : userLinks;
  const active = (path) => location.pathname === path;
  const go = (path) => navigate(path);
  return (
    <aside className={`sticky top-0 hidden h-screen shrink-0 border-r border-white/[0.07] bg-[#080c11] lg:block ${isSidebarOpen ? 'w-[242px]' : 'w-[72px]'} transition-[width] duration-200`}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-white/[0.07] px-4">
          <button className="flex min-w-0 items-center gap-3 text-left" onClick={() => go('/dashboard')}>
            <img src={logo} alt="Fintel Secure" className="h-9 w-9 object-contain" />
            {isSidebarOpen && <div className="min-w-0"><div className="text-[15px] font-semibold tracking-tight text-slate-100">Fintel Secure</div><div className="text-[9px] uppercase tracking-[.18em] text-slate-600">Finance intelligence</div></div>}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavSection title="Workspace" open={isSidebarOpen} />
          <div className="space-y-1">
            {links.map(([label, path, Icon]) => <NavItem key={path} label={label} path={path} Icon={Icon} open={isSidebarOpen} />)}
          </div>
          {currentUser?.role !== 'admin' && <>
            <NavSection title="Markets" open={isSidebarOpen} />
            <div className="space-y-1">{marketLinks.map(([label, path, Icon]) => <NavItem key={path} label={label} path={path} Icon={Icon} open={isSidebarOpen} />)}</div>
          </>}
        </div>
        <div className="border-t border-white/[0.07] p-3">
          {isSidebarOpen && <div className="mb-3 border border-white/[0.06] bg-[#0d1218] p-3"><p className="truncate text-xs font-medium text-slate-300">{currentUser?.name || 'User'}</p><p className="mt-1 truncate text-[10px] text-slate-600">{currentUser?.email || ''}</p></div>}
          <button onClick={() => { logout(); navigate('/login', { replace: true }); }} className="flex w-full items-center justify-center gap-2 border border-white/[0.07] bg-[#0c1117] px-3 py-2.5 text-xs font-semibold text-slate-500 hover:border-white/[0.14] hover:text-slate-200">
            <LogOut size={14} /> {isSidebarOpen && 'Sign out'}
          </button>
        </div>
        <button onClick={onToggle} className="absolute -right-3 top-8 grid h-7 w-7 place-items-center border border-white/[0.09] bg-[#0c1117] text-slate-500 hover:text-white">{isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}</button>
      </div>
    </aside>
  );
}
function NavSection({ title, open }) { return open ? <div className="px-2 pb-2 pt-3 text-[9px] font-semibold uppercase tracking-[.16em] text-slate-700">{title}</div> : <div className="h-3" />; }
function NavItem({ label, path, Icon, open }) { return <NavLink to={path} className={({ isActive }) => `group flex items-center gap-3 border-l-2 px-3 py-2.5 text-xs font-medium transition ${isActive ? 'border-[#4e79ad] bg-[#101720] text-slate-100' : 'border-transparent text-slate-600 hover:bg-white/[0.02] hover:text-slate-300'}`}><Icon size={15} />{open && <span className="truncate">{label}</span>}</NavLink>; }
