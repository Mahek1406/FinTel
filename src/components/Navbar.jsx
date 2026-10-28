import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const titles = { '/dashboard':'Dashboard', '/upload':'Data Upload', '/processing':'Processing', '/visualization':'Insights', '/history':'Transaction History', '/security':'Security', '/cases':'Investigation Cases', '/rules':'Rules Lab', '/market':'Market', '/stocks':'Stocks', '/ipos':'IPOs', '/screener':'Stock Screener', '/portfolio':'Paper Portfolio', '/learn':'Learn', '/admin/risk':'Risk Command Center' };
export default function Navbar() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const title = titles[location.pathname] || 'Fintel Secure';
  const initial = (currentUser?.name || currentUser?.email || 'U').trim().charAt(0).toUpperCase();
  return <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#090d12]/95 backdrop-blur"><div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-6 lg:px-8"><div><p className="text-[13px] font-medium text-slate-300">{title}</p><p className="mt-0.5 text-[10px] text-slate-700">Fintel Secure / {currentUser?.role === 'admin' ? 'Administrator' : 'Workspace'}</p></div><div className="flex items-center gap-3"><Link to="/stocks" className="hidden items-center gap-2 border border-white/[0.07] bg-[#0d1218] px-3 py-2 text-[11px] text-slate-500 hover:text-slate-200 sm:flex"><Search size={13} /> Market search</Link><div className="hidden text-right md:block"><p className="max-w-[180px] truncate text-xs font-medium text-slate-300">{currentUser?.name || 'User'}</p><p className="mt-0.5 max-w-[180px] truncate text-[10px] text-slate-600">{currentUser?.email || ''}</p></div><div className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.08] bg-[#11171e] text-xs font-semibold text-slate-300">{initial}</div></div></div></header>;
}
