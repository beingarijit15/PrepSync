import { Link } from 'react-router-dom';
import { Target, TrendingUp, ShieldCheck, Cpu, Briefcase, Users, CheckCircle2, ArrowRight, Sparkles, Star, Award, Layers } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-between p-2">
                <Layers className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent tracking-tight">
              PrepSync
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-slate-300 hover:text-white font-semibold px-4 py-2 rounded-xl transition">
              Log in
            </Link>
            <Link to="/register" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section with High Quality Graphic */}
        <section className="relative pt-12 pb-24 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold mb-6">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>The Placement Preparation Engine</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15] mb-6 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Stop the Preparation Chaos. <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Start Preparing Smart.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-8">
                Eliminate 15 open tabs, messy spreadsheets, and decision fatigue. PrepSync organizes your DSA, CS Fundamentals, Mock Interviews, and Resume targeting into one unified intelligent dashboard.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
                  <span>Start Placement Prep Free</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="#evidence" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold hover:text-white hover:bg-slate-800/80 transition text-center">
                  View Student Research
                </a>
              </div>
            </div>

            {/* Generated Hero Graphic Showcase */}
            <div className="relative mt-8 rounded-3xl p-2 bg-gradient-to-b from-slate-800/80 to-slate-900/40 border border-slate-800 shadow-2xl shadow-indigo-950/50 group">
              <div className="overflow-hidden rounded-2xl bg-slate-950">
                <img 
                  src="/images/hero.jpg" 
                  alt="PrepSync Dashboard Visual Illustration" 
                  className="w-full object-cover rounded-2xl transform transition duration-700 group-hover:scale-[1.01]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Evidence & Statistics Section */}
        <section id="evidence" className="py-20 bg-slate-900/60 border-y border-slate-800/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Proved by Real Student Data</h2>
              <p className="text-slate-400">We surveyed 47 students across 5 colleges and conducted in-depth interviews. Here is why existing tools fall short.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { metric: '89%', label: 'Use 3+ Platforms', desc: 'Juggling LeetCode, GFG, YouTube, and Notion simultaneously' },
                { metric: '82%', label: 'Lack Tracking', desc: 'Cannot recall which specific topics they are actually weak at' },
                { metric: '76%', label: 'Feel Overwhelmed', desc: 'Experience preparation paralysis from scattered study materials' },
                { metric: '91%', label: 'Want PrepSync', desc: 'Explicitly asked for a single unified multi-domain dashboard' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition">
                  <div className="text-4xl font-black text-indigo-400 mb-2">{item.metric}</div>
                  <div className="text-lg font-bold text-white mb-1">{item.label}</div>
                  <div className="text-sm text-slate-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Showcase Grid with Graphics */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Everything You Need for Campus & Off-Campus Placements</h2>
            <p className="text-slate-400">Built specifically to solve student pain points from Day 1 of preparation to the final offer letter.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-semibold mb-4">
                <ShieldCheck className="h-4 w-4" />
                <span>Mock Interview Simulator</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Real-Time Interview Scenarios & Scored Feedback</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Practice Technical DSA, System Design, Computer Science Fundamentals, and Behavioral HR questions with immediate structured rubrics and performance breakdown.
              </p>
              <ul className="space-y-3 mb-8 text-slate-300">
                <li className="flex items-center space-x-3"><CheckCircle2 className="h-5 w-5 text-indigo-400" /> <span>Company-specific interview question banks</span></li>
                <li className="flex items-center space-x-3"><CheckCircle2 className="h-5 w-5 text-indigo-400" /> <span>Detailed feedback on clarity, accuracy, and structure</span></li>
                <li className="flex items-center space-x-3"><CheckCircle2 className="h-5 w-5 text-indigo-400" /> <span>Historical score tracking across technical and HR rounds</span></li>
              </ul>
            </div>
            <div className="rounded-2xl p-2 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-slate-800 shadow-xl">
              <img src="/images/mockup.jpg" alt="Mock Interview Simulator Graphic" className="rounded-xl w-full object-cover" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24 lg:flex-row-reverse">
            <div className="lg:order-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-4">
                <Cpu className="h-4 w-4" />
                <span>Resume Match Engine</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Align Your Resume to Specific Job Descriptions</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Never get filtered out by ATS again. Paste your resume alongside target company job descriptions to get an instant match score, missing keywords, and actionable suggestions.
              </p>
              <ul className="space-y-3 mb-8 text-slate-300">
                <li className="flex items-center space-x-3"><CheckCircle2 className="h-5 w-5 text-emerald-400" /> <span>Automated skill gap detection</span></li>
                <li className="flex items-center space-x-3"><CheckCircle2 className="h-5 w-5 text-emerald-400" /> <span>Targeted keyword suggestions for SDE & Tech roles</span></li>
                <li className="flex items-center space-x-3"><CheckCircle2 className="h-5 w-5 text-emerald-400" /> <span>Match percentage gauge for quick evaluation</span></li>
              </ul>
            </div>
            <div className="lg:order-1 rounded-2xl p-2 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-slate-800 shadow-xl">
              <img src="/images/resume.jpg" alt="Resume Matcher Graphic" className="rounded-xl w-full object-cover" />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-900/40 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white">What Students Say</h2>
              <p className="mt-2 text-slate-400">Quotes from our interview research with placement aspirants</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { quote: "Preparation paralysis is real. I used to spend 30 mins deciding what to study across tabs. PrepSync gives me instant clarity.", name: "Rahul Sharma", role: "3rd Year CSE, NIT Warangal" },
                { quote: "Spreadsheets require manual effort with zero intelligence. Having an interactive tracker for CS core + DSA is a lifesaver.", name: "Aman Verma", role: "3rd Year ECE, Amity" },
                { quote: "I cleared coding rounds before but failed HR questions. Having behavioral mock practice built into the same app fixed that.", name: "Vikram Singh", role: "Final Year IT, LPU" },
              ].map((t, i) => (
                <div key={i} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center space-x-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 italic mb-6">"{t.quote}"</p>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-xs text-indigo-400">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 text-center text-slate-500 text-sm">
        <p>© 2026 PrepSync Platform. Built for placement success.</p>
      </footer>
    </div>
  );
}
