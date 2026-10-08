import { useState, useEffect } from 'react';
import { Target, Flame, CheckSquare, Plus, Sparkles, Trophy } from 'lucide-react';
import api from '../api/axios';

export default function DailyGoals() {
  const [goals, setGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [streak, setStreak] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayGoals();
  }, []);

  const fetchTodayGoals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/goals/today');
      if (res.data && res.data.goals_json) {
        let parsed = res.data.goals_json;
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        setGoals(parsed);
      } else {
        setGoals([
          { id: 1, text: "Solve 2 DSA Medium questions on Dynamic Programming", completed: true },
          { id: 2, text: "Revise Operating System Process & Threading concepts", completed: true },
          { id: 3, text: "Practice 1 Technical Mock Interview scenario", completed: false },
          { id: 4, text: "Review SQL Joins and Normalization notes", completed: false }
        ]);
      }
    } catch (e) {
      console.log('Error fetching goals');
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = async (id) => {
    const updated = goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
    setGoals(updated);
    try {
      await api.post('/goals', { goals: updated });
    } catch (e) {
      console.log('Goal updated locally');
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newGoal = { id: Date.now(), text: newGoalText.trim(), completed: false };
    const updated = [...goals, newGoal];
    setGoals(updated);
    setNewGoalText('');
    try {
      await api.post('/goals', { goals: updated });
    } catch (e) {
      console.log('Goal added locally');
    }
  };

  const completedCount = goals.filter(g => g.completed).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Consistency Tracker</span>
          </div>
          <h1 className="text-3xl font-black text-white">Daily Preparation Goals</h1>
          <p className="text-slate-400 text-sm mt-1">Consistency beats intensity. Complete daily targets to maintain your streak.</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <Flame className="h-8 w-8 text-amber-400 animate-bounce" />
          <div>
            <div className="text-2xl font-black text-white">{streak} Days</div>
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Current Streak</div>
          </div>
        </div>
      </div>

      {/* Main Checklist Card */}
      <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Target className="h-5 w-5 text-indigo-400" />
            <span>Today's Tasklist</span>
          </h2>
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            {completedCount}/{goals.length} Completed
          </span>
        </div>

        {/* Form to Add Goal */}
        <form onSubmit={handleAddGoal} className="flex gap-3">
          <input
            type="text"
            placeholder="Add custom task (e.g. Revise System Design Caching)..."
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Goals List */}
        <div className="space-y-3 pt-2">
          {goals.map((g) => (
            <label
              key={g.id}
              className={`flex items-center space-x-4 p-4 rounded-2xl border transition cursor-pointer ${
                g.completed 
                  ? 'bg-slate-950/40 border-slate-800/50 text-slate-500 line-through' 
                  : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-indigo-500/40'
              }`}
            >
              <input
                type="checkbox"
                checked={g.completed}
                onChange={() => toggleGoal(g.id)}
                className="h-5 w-5 text-indigo-600 rounded border-slate-700 bg-slate-900 focus:ring-indigo-500"
              />
              <span className="text-sm font-semibold flex-1">{g.text}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
