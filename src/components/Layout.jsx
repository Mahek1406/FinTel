import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
export default function Layout() { const [open, setOpen] = useState(true); return <div className="min-h-screen bg-[#090d12] text-white"><div className="flex min-h-screen"><Sidebar isSidebarOpen={open} onToggle={() => setOpen(v => !v)} /><div className="min-w-0 flex-1"><Navbar /><main className="px-5 py-6 sm:px-6 lg:px-8 lg:py-7"><div className="page"><Outlet /></div></main></div></div></div>; }
