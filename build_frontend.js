const fs = require('fs');
const path = require('path');

const basePath = path.join('c:', 'Users', 'sanja', 'OneDrive', 'Documents', 'project 1', 'client');

const files = {
  'package.json': `{
  "name": "prepsync-client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.8",
    "clsx": "^2.1.0",
    "lucide-react": "^0.363.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "react-router-dom": "^6.22.3",
    "recharts": "^2.12.3",
    "tailwind-merge": "^2.2.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "vite": "^5.2.0"
  }
}`,
  'vite.config.js': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});`,
  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        success: {
          500: '#10b981',
        },
        warning: {
          500: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}`,
  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
  'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PrepSync - Start Preparing Smart</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900 antialiased;
}
`,
  'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)`,
  'src/api/axios.js': `import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default api;`,
  'src/context/AuthContext.jsx': `import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // const res = await api.get('/auth/me'); // mock
          setUser({ id: 1, name: 'Demo User', email: 'demo@example.com' });
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', 'fake-token');
      setUser({ id: 1, name: 'Demo User', email });
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (data) => {
    try {
      // await api.post('/auth/register', data);
      localStorage.setItem('token', 'fake-token');
      setUser({ id: 1, name: data.name, email: data.email });
      toast.success('Registered successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);`,
  'src/components/ProtectedRoute.jsx': `import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return <Outlet />;
};

export default ProtectedRoute;`,
  'src/components/Sidebar.jsx': `import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Building2, MessagesSquare, FileText, Target, BarChart2 } from 'lucide-react';
import clsx from 'clsx';

const links = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Topics', path: '/topics', icon: BookOpen },
  { name: 'Companies', path: '/companies', icon: Building2 },
  { name: 'Mock Interview', path: '/mock-interview', icon: MessagesSquare },
  { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
  { name: 'Daily Goals', path: '/daily-goals', icon: Target },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 h-full flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-primary-600">PrepSync</span>
      </div>
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => clsx(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {link.name}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;`,
  'src/components/Layout.jsx': `import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center md:hidden">
            <Menu className="h-6 w-6 text-gray-500 cursor-pointer" />
            <span className="ml-4 text-xl font-bold text-primary-600">PrepSync</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            <button onClick={logout} className="text-gray-500 hover:text-gray-700">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;`,
  'src/components/ProgressRing.jsx': `const ProgressRing = ({ radius, stroke, progress }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#e0e7ff"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#4f46e5"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xl font-bold text-gray-700">{progress}%</span>
    </div>
  );
};
export default ProgressRing;`,
  'src/components/StatsCard.jsx': `const StatsCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="p-3 bg-primary-50 rounded-lg">
        <Icon className="h-6 w-6 text-primary-600" />
      </div>
    </div>
    {trend && (
      <div className="mt-4">
        <span className="text-sm font-medium text-success-500">{trend}</span>
      </div>
    )}
  </div>
);
export default StatsCard;`,
  'src/components/CompanyBadge.jsx': `const CompanyBadge = ({ name }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
    {name}
  </span>
);
export default CompanyBadge;`,
  'src/components/TopicCard.jsx': `import { Star } from 'lucide-react';
import CompanyBadge from './CompanyBadge';

const TopicCard = ({ topic }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900">{topic.title}</h3>
        <span className={\`px-2 py-1 text-xs font-medium rounded-md \${
          topic.status === 'Completed' ? 'bg-success-500/10 text-success-500' :
          topic.status === 'In Progress' ? 'bg-warning-500/10 text-warning-500' :
          'bg-gray-100 text-gray-600'
        }\`}>
          {topic.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{topic.description || 'No description provided.'}</p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex space-x-1">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className={\`h-4 w-4 \${i <= topic.confidence ? 'text-warning-500 fill-current' : 'text-gray-300'}\`} />
          ))}
        </div>
        <div className="flex gap-1 overflow-hidden">
          {topic.companies?.slice(0, 2).map(c => <CompanyBadge key={c} name={c} />)}
          {topic.companies?.length > 2 && <span className="text-xs text-gray-400">+{topic.companies.length - 2}</span>}
        </div>
      </div>
    </div>
  );
};
export default TopicCard;`,
  'src/pages/Landing.jsx': `import { Link } from 'react-router-dom';
import { Target, TrendingUp, ShieldCheck, Cpu, Briefcase, Users } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600">PrepSync</div>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Log in</Link>
            <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition">Sign up</Link>
          </div>
        </div>
      </header>
      
      <main>
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 py-20 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">Stop the Preparation Chaos.<br/>Start Preparing Smart.</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">The all-in-one platform to track your technical interview preparation, master topics, and land your dream job.</p>
          <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-full text-lg font-bold hover:bg-gray-100 transition shadow-lg inline-block">Get Started for Free</Link>
        </section>

        <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why PrepSync?</h2>
            <p className="mt-4 text-lg text-gray-600">80% of students lose track of their preparation. We fix that.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Structured Paths', desc: 'Curated topics for top companies' },
              { icon: TrendingUp, title: 'Progress Tracking', desc: 'Visual analytics to see your growth' },
              { icon: ShieldCheck, title: 'Mock Interviews', desc: 'Simulate real interview environments' },
              { icon: Cpu, title: 'AI Resume Analyzer', desc: 'Score and improve your resume' },
              { icon: Briefcase, title: 'Company Specific', desc: 'Target preparation for specific roles' },
              { icon: Users, title: 'Daily Goals', desc: 'Stay accountable with streaks' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <f.icon className="h-10 w-10 text-primary-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}`,
  'src/pages/Login.jsx': `import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Login to your PrepSync account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
            Sign In
          </button>
        </form>
        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">Register</Link>
        </div>
      </div>
    </div>
  );
}`,
  'src/pages/Register.jsx': `import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(data);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create an account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" required value={data.name} onChange={e => setData({...data, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" required value={data.email} onChange={e => setData({...data, email: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" required value={data.password} onChange={e => setData({...data, password: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
            Sign Up
          </button>
        </form>
        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">Log in</Link>
        </div>
      </div>
    </div>
  );
}`,
  'src/pages/Dashboard.jsx': `import { useAuth } from '../context/AuthContext';
import ProgressRing from '../components/ProgressRing';
import StatsCard from '../components/StatsCard';
import { BookOpen, Flame, Video, FileText } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-500">Here's what's happening with your preparation today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Topics Completed" value="45/120" icon={BookOpen} trend="+3 this week" />
        <StatsCard title="Current Streak" value="7 days" icon={Flame} trend="Keep it up!" />
        <StatsCard title="Mock Interviews" value="4" icon={Video} trend="Avg score: 85%" />
        <StatsCard title="Resume Score" value="92" icon={FileText} trend="Top 10%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-1 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-6">Category Progress</h2>
          <div className="space-y-4">
            {['Data Structures', 'Operating Systems', 'System Design', 'Behavioral'].map(cat => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{cat}</span>
                  <span className="text-gray-500">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-4 self-start w-full">Overall Progress</h2>
          <ProgressRing radius={70} stroke={12} progress={38} />
          <p className="mt-4 text-sm text-gray-500 text-center">You are on track to complete your goals by next month.</p>
        </div>
      </div>
    </div>
  );
}`,
  'src/pages/Topics.jsx': `import { useState } from 'react';
import TopicCard from '../components/TopicCard';

const MOCK_TOPICS = [
  { id: 1, title: 'Two Sum', status: 'Completed', confidence: 5, companies: ['Google', 'Amazon'], category: 'DSA' },
  { id: 2, title: 'Process Scheduling', status: 'In Progress', confidence: 3, companies: ['Microsoft'], category: 'OS' },
  { id: 3, title: 'CAP Theorem', status: 'Not Started', confidence: 0, companies: ['Uber', 'Meta'], category: 'SystemDesign' },
];

export default function Topics() {
  const [filter, setFilter] = useState('All');
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Topics Tracker</h1>
          <p className="text-gray-500">Manage and track your study topics.</p>
        </div>
      </div>
      
      <div className="flex space-x-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {['All', 'DSA', 'OS', 'DBMS', 'CN', 'SystemDesign', 'Behavioral'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={\`px-4 py-2 text-sm font-medium rounded-t-lg \${filter === f ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}\`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TOPICS.filter(t => filter === 'All' || t.category === filter).map(topic => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}`,
  'src/pages/Companies.jsx': `export default function Companies() {
  const companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Apple'];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Specific Prep</h1>
        <p className="text-gray-500">Tailor your preparation for target companies.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(c => (
          <div key={c} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md cursor-pointer flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-xl font-bold text-gray-600">{c[0]}</div>
            <h3 className="text-lg font-bold text-gray-900">{c}</h3>
            <p className="text-sm text-gray-500 mt-1">45 Recommended Topics</p>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  'src/pages/MockInterview.jsx': `export default function MockInterview() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Mock Interview Simulator</h1>
      <p className="text-gray-500 mb-8">Practice answering real interview questions.</p>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center py-20">
        <h2 className="text-xl font-semibold mb-4">Start a new session</h2>
        <div className="flex gap-4 justify-center">
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">Technical DSA</button>
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">Behavioral</button>
        </div>
      </div>
    </div>
  );
}`,
  'src/pages/ResumeAnalyzer.jsx': `import { useState } from 'react';
import ProgressRing from '../components/ProgressRing';

export default function ResumeAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult(85);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resume Analyzer</h1>
        <p className="text-gray-500">Compare your resume against a job description.</p>
      </div>

      {!result ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <label className="font-semibold mb-2">Your Resume Content</label>
            <textarea className="w-full flex-1 border border-gray-300 rounded-lg p-3 min-h-[300px]" placeholder="Paste your resume text here..."></textarea>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <label className="font-semibold mb-2">Job Description</label>
            <textarea className="w-full flex-1 border border-gray-300 rounded-lg p-3 min-h-[300px]" placeholder="Paste the JD here..."></textarea>
          </div>
          <div className="md:col-span-2 flex justify-center">
            <button onClick={analyze} disabled={analyzing} className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-primary-700 disabled:opacity-50">
              {analyzing ? 'Analyzing...' : 'Analyze Match'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-6">Analysis Complete</h2>
          <ProgressRing radius={80} stroke={12} progress={result} />
          <div className="mt-8 grid grid-cols-2 gap-4 text-left">
            <div className="bg-success-50 p-4 rounded-lg border border-success-100">
              <h3 className="font-semibold text-success-700">Matched Skills</h3>
              <p className="text-sm mt-2">React, Node.js, SQL</p>
            </div>
            <div className="bg-warning-50 p-4 rounded-lg border border-warning-100">
              <h3 className="font-semibold text-warning-700">Missing Skills</h3>
              <p className="text-sm mt-2">Docker, AWS</p>
            </div>
          </div>
          <button onClick={() => setResult(null)} className="mt-6 text-primary-600 hover:underline">Analyze another</button>
        </div>
      )}
    </div>
  );
}`,
  'src/pages/DailyGoals.jsx': `export default function DailyGoals() {
  const goals = ['Solve 2 Easy DSA', 'Revise OS Scheduling', 'Apply to 3 companies'];
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Daily Goals</h1>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Today's Tasks</h2>
        <div className="space-y-3">
          {goals.map((g, i) => (
            <label key={i} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200">
              <input type="checkbox" className="h-5 w-5 text-primary-600 rounded border-gray-300" />
              <span className="text-gray-700 font-medium">{g}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}`,
  'src/pages/Analytics.jsx': `import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', completed: 2 },
  { name: 'Tue', completed: 5 },
  { name: 'Wed', completed: 3 },
  { name: 'Thu', completed: 7 },
  { name: 'Fri', completed: 4 },
  { name: 'Sat', completed: 8 },
  { name: 'Sun', completed: 10 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Preparation Analytics</h1>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Topics Completed (This Week)</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}`,
  'src/App.jsx': `import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Topics from './pages/Topics';
import Companies from './pages/Companies';
import MockInterview from './pages/MockInterview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import DailyGoals from './pages/DailyGoals';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/daily-goals" element={<DailyGoals />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(basePath, filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log('Created:', filepath);
});
