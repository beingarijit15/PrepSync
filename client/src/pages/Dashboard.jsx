import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProgressRing from '../components/ProgressRing';
import StatsCard from '../components/StatsCard';
import { BookOpen, Flame, Video, FileText, ArrowRight, CheckCircle, Sparkles, Building2, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 184,
    completed: 45,
    percentage: 24,
    byCategory: [
      { category: 'DSA', total: 68, completed: 22 },
      { category: 'OS', total: 24, completed: 8 },
      { category: 'DBMS', total: 24, completed: 7 },
      { category: 'CN', total: 25, completed: 5 },
      { category: 'SystemDesign', total: 23, completed: 3 },
      { category: 'Behavioral', total: 17, completed: 0 }
    ]
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/progress/stats');
        if (res.data && res.data.total) {
          setStats(res.data);
        }
      } catch (err) {
        console.log('Using default dashboard metrics');
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Target Company Placement Active</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">
            Targeting Top Tech Roles
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            You've completed <span className="font-bold text-indigo-400">{stats.completed}</span> out of <span className="font-bold text-indigo-400">{stats.total}</span> essential interview topics. Keep up your daily streak!
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/topics" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2">
              <span>Continue Topic Tracker</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/mock-interview" className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition">
              Start Mock Interview
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Topics Completed" value={`${stats.completed}/${stats.total}`} icon={BookOpen} trend={`${stats.percentage}% done`} />
        <StatsCard title="Current Streak" value="5 Days" icon={Flame} trend="Active Streak" />
        <StatsCard title="Mock Interviews" value="3 Completed" icon={Video} trend="Avg Score 82%" />
        <StatsCard title="Resume Match" value="88%" icon={FileText} trend="SDE Role Ready" />
      </div>

      {/* Category Breakdown & Progress Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Target className="h-5 w-5 text-indigo-400" />
              <span>Domain Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400">Target: 100% Coverage</span>
          </div>

          <div className="space-y-5">
            {stats.byCategory.map((cat) => {
              const catPct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
              return (
                <div key={cat.category} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-200">{cat.category}</span>
                    <span className="text-indigo-400 font-mono">{cat.completed}/{cat.total} ({catPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${catPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Circular Gauge */}
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-between">
          <h3 className="text-lg font-bold text-white self-start">Overall Readiness</h3>
          <div className="my-6">
            <ProgressRing radius={75} stroke={12} progress={stats.percentage} />
          </div>
          <div className="text-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800 w-full">
            <p className="text-xs text-slate-400 leading-relaxed">
              Based on historical data from target companies like <span className="text-slate-200 font-semibold">Google, Amazon, and Microsoft</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Company Cards */}
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-indigo-400" />
            <span>Target Company Modules</span>
          </h3>
          <Link to="/companies" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">View All →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Google', 'Amazon', 'Microsoft', 'Flipkart'].map((comp) => (
            <Link 
              key={comp} 
              to={`/companies`}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition group"
            >
              <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition">{comp}</div>
              <div className="text-xs text-slate-400 mt-1">20+ Frequent Questions</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
