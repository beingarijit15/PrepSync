import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Flame, Bell } from 'lucide-react';

const Layout = () => {
  const { user } = useAuth();
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-20 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between px-8 shrink-0 backdrop-blur-md">
          <div>
            <h1 className="text-xl font-extrabold text-white">Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.name || 'Aspirant'}</span>! 👋</h1>
            <p className="text-xs text-slate-400">{user?.target_companies ? `Targeting: ${user.target_companies}` : 'Placement Track Active'}</p>
          </div>
          
          <div className="flex items-center space-x-5">
            {/* Streak Counter Badge */}
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs">
              <Flame className="h-4 w-4 fill-amber-400 animate-pulse" />
              <span>5 Day Streak</span>
            </div>

            {/* Notification Icon */}
            <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
