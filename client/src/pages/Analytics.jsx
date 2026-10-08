import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart2, TrendingUp, Sparkles, Award } from 'lucide-react';
import api from '../api/axios';

const weeklyData = [
  { name: 'Mon', topics: 2, mocks: 0 },
  { name: 'Tue', topics: 5, mocks: 1 },
  { name: 'Wed', topics: 3, mocks: 0 },
  { name: 'Thu', topics: 7, mocks: 1 },
  { name: 'Fri', topics: 4, mocks: 0 },
  { name: 'Sat', topics: 8, mocks: 1 },
  { name: 'Sun', topics: 10, mocks: 0 },
];

const categoryDistribution = [
  { name: 'DSA', value: 68, color: '#6366f1' },
  { name: 'OS', value: 24, color: '#a855f7' },
  { name: 'DBMS', value: 24, color: '#ec4899' },
  { name: 'Networks', value: 25, color: '#10b981' },
  { name: 'System Design', value: 23, color: '#f59e0b' },
  { name: 'Behavioral', value: 17, color: '#06b6d4' },
];

export default function Analytics() {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Velocity Insights</span>
          </div>
          <h1 className="text-3xl font-black text-white">Preparation Performance & Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Visualize your study pace, topic distribution, and weekly completion metrics.</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <TrendingUp className="h-8 w-8 text-indigo-400" />
          <div>
            <div className="text-2xl font-black text-white">+39%</div>
            <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Pace Growth</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-indigo-400" />
            <span>Weekly Study Velocity</span>
          </h2>
          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="topics" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Award className="h-5 w-5 text-purple-400" />
            <span>Topic Category Weightage</span>
          </h2>
          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
