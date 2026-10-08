import { useState, useEffect } from 'react';
import TopicCard from '../components/TopicCard';
import { Search, Filter, BookOpen, Sparkles } from 'lucide-react';
import api from '../api/axios';

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, [category]);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const url = category === 'All' ? '/progress/topics' : `/progress/topics?category=${category}`;
      const res = await api.get(url);
      if (res.data) setTopics(res.data);
    } catch (e) {
      console.log('Error loading topics');
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = topics.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.company_tags && t.company_tags.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Mastery Progress</span>
          </div>
          <h1 className="text-3xl font-black text-white">Smart Topic Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">184 Curated topics across DSA, OS, DBMS, Networks, System Design & Behavioral.</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-3xl font-black text-indigo-400">{filteredTopics.length}</div>
          <div className="text-xs text-slate-500 font-semibold">Topics Available</div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {['All', 'DSA', 'OS', 'DBMS', 'CN', 'SystemDesign', 'Behavioral'].map(f => (
              <button 
                key={f} 
                onClick={() => setCategory(f)} 
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  category === f 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search topic or company..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading topics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.slice(0, 60).map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
