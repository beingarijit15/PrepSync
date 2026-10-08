import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Building2, MessagesSquare, FileText, Target, BarChart2, Layers, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const links = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Topic Tracker', path: '/topics', icon: BookOpen },
  { name: 'Company Prep', path: '/companies', icon: Building2 },
  { name: 'Mock Interview', path: '/mock-interview', icon: MessagesSquare },
  { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
  { name: 'Daily Goals', path: '/daily-goals', icon: Target },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 h-screen flex flex-col hidden md:flex sticky top-0">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            PrepSync
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 py-6 overflow-y-auto px-4">
        <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-3">
          Menu
        </div>
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => clsx(
                  'flex items-center px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all group',
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )}
              >
                <Icon className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="truncate">
              <div className="text-sm font-bold text-slate-200 truncate">{user?.name || 'Student'}</div>
              <div className="text-xs text-indigo-400 truncate">{user?.college || 'Prep Track'}</div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
