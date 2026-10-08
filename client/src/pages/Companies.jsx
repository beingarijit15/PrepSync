import { useState, useEffect } from 'react';
import { Building2, Search, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import TopicCard from '../components/TopicCard';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyTopics, setCompanyTopics] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/companies');
      if (res.data && res.data.length > 0) {
        setCompanies(res.data);
      } else {
        setCompanies([
          { name: 'Google', topicCount: 42 },
          { name: 'Amazon', topicCount: 56 },
          { name: 'Microsoft', topicCount: 48 },
          { name: 'Flipkart', topicCount: 38 },
          { name: 'TCS', topicCount: 30 },
          { name: 'Infosys', topicCount: 28 },
          { name: 'Wipro', topicCount: 25 },
          { name: 'Adobe', topicCount: 35 },
          { name: 'Uber', topicCount: 32 }
        ]);
      }
    } catch (e) {
      console.log('Error loading companies');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompany = async (companyName) => {
    setSelectedCompany(companyName);
    try {
      const res = await api.get(`/companies/${companyName}/topics`);
      if (res.data) setCompanyTopics(res.data);
    } catch (e) {
      setCompanyTopics([]);
    }
  };

  const filteredCompanies = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Target Company Trackers</span>
          </div>
          <h1 className="text-3xl font-black text-white">Company Preparation Modules</h1>
          <p className="text-slate-400 text-sm mt-1">Study questions frequently asked by specific tech leaders and service companies.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search company..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {!selectedCompany ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(c => (
            <div 
              key={c.name} 
              onClick={() => handleSelectCompany(c.name)}
              className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 cursor-pointer transition flex items-center justify-between group shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-black text-white shadow-md">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">{c.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{c.topicCount || 30}+ Targeted Topics</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
            <div>
              <button 
                onClick={() => setSelectedCompany(null)}
                className="text-xs font-semibold text-indigo-400 hover:underline mb-1 inline-block"
              >
                ← Back to All Companies
              </button>
              <h2 className="text-2xl font-black text-white">{selectedCompany} Placement Roadmap</h2>
            </div>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/20 text-xs font-bold">
              {companyTopics.length} Topics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyTopics.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
