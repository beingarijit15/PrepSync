import { useState } from 'react';
import { Star, CheckCircle, Clock, Circle } from 'lucide-react';
import CompanyBadge from './CompanyBadge';
import api from '../api/axios';

const TopicCard = ({ topic }) => {
  const [status, setStatus] = useState(topic.status || 'not_started');
  const [confidence, setConfidence] = useState(topic.confidence || 0);

  const handleStatusToggle = async () => {
    const nextStatus = status === 'completed' ? 'not_started' : status === 'not_started' ? 'in_progress' : 'completed';
    setStatus(nextStatus);
    try {
      await api.put(`/progress/${topic.id}`, {
        status: nextStatus,
        confidence,
        notes: ''
      });
    } catch (e) {
      console.log('Progress updated locally');
    }
  };

  const difficultyColor = 
    topic.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
    topic.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
    'text-rose-400 bg-rose-500/10 border-rose-500/20';

  const companiesList = topic.company_tags ? topic.company_tags.split(',').slice(0, 3) : [];

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-lg hover:border-slate-700 transition flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-bold text-white text-base leading-snug group-hover:text-indigo-400 transition">
            {topic.name}
          </h3>
          <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${difficultyColor}`}>
            {topic.difficulty || 'Medium'}
          </span>
        </div>

        <div className="text-xs text-slate-400 font-semibold mb-4 flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-indigo-300">
            {topic.category}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        {/* Status Toggle Button */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handleStatusToggle}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              status === 'completed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : status === 'in_progress'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {status === 'completed' ? <CheckCircle className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
            <span className="capitalize">{status.replace('_', ' ')}</span>
          </button>

          {/* Star confidence */}
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star 
                key={i} 
                onClick={() => setConfidence(i)}
                className={`h-3.5 w-3.5 cursor-pointer ${i <= confidence ? 'text-amber-400 fill-amber-400' : 'text-slate-700 hover:text-slate-500'}`} 
              />
            ))}
          </div>
        </div>

        {/* Company Tags */}
        <div className="flex flex-wrap gap-1">
          {companiesList.map(c => (
            <CompanyBadge key={c} name={c.trim()} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
