import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Github, 
  ExternalLink, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Send,
  Code
} from 'lucide-react';

interface AssignmentDetailProps {
  onBack: () => void;
  onTriggerSuccess: () => void;
}

export function AssignmentDetail({ onBack, onTriggerSuccess }: AssignmentDetailProps) {
  const [submissionType, setSubmissionType] = useState<'link' | 'file'>('link');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onTriggerSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
      >
        <ArrowLeft size={16} /> Back to Quests
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 border border-white/10 bg-black/40 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Responsive Hydra</h1>
                <p className="text-brand-purple font-bold text-sm">Boss Battle &bull; Frontend Master Path</p>
              </div>
              <div className="px-3 py-1 bg-brand-orange/20 border border-brand-orange/50 text-brand-orange text-[10px] font-black rounded-full">
                DUE IN 2 DAYS
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Objective</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Build a multi-headed layout that adapts to 3 distinct viewport sizes using only CSS Grid and Container Queries. The interface must remain performant under "network stress" simulation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">XP Reward</p>
                <p className="text-xl font-black text-white italic">+1,500 XP</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Difficulty</p>
                <p className="text-xl font-black text-brand-red italic">LEGENDARY</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 border border-white/10 bg-black/40">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Your Submission</h3>
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-brand-green/10 border border-brand-green/30 rounded-2xl flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center text-brand-green">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Mission Transmitted!</h4>
                  <p className="text-gray-400 text-xs mt-1">Awaiting instructor evaluation. Estimated feedback time: 24h.</p>
                </div>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-brand-green font-bold hover:underline"
                >
                  Update Submission
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-4 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
                  <button 
                    type="button"
                    onClick={() => setSubmissionType('link')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${submissionType === 'link' ? 'bg-brand-purple text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                    Repository Link
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSubmissionType('file')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${submissionType === 'file' ? 'bg-brand-purple text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                    Upload Files
                  </button>
                </div>

                {submissionType === 'link' ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        type="url" 
                        placeholder="https://github.com/username/repo"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-all"
                        required
                      />
                    </div>
                    <div className="relative">
                      <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        type="url" 
                        placeholder="Live Demo URL (Vercel/Netlify)"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center space-y-4 bg-white/2 hover:bg-white/5 transition-all cursor-pointer">
                    <div className="p-4 bg-white/5 rounded-full text-gray-500">
                      <Upload size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">Drop your source files here</p>
                      <p className="text-xs text-gray-500 mt-1">Supporting .zip, .tsx, .css (Max 50MB)</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Comments to Instructor</label>
                  <textarea 
                    placeholder="Briefly explain your architectural choices..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-all min-h-[100px]"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-brand-purple text-white font-black rounded-xl hover:bg-brand-purple/80 transition-all shadow-[0_0_30px_rgba(176,38,255,0.3)] uppercase text-sm flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Complete Mission
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 border border-white/10 bg-black/40">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Instructor Feedback</h3>
            <div className="flex items-center gap-3 text-gray-500">
              <Clock size={20} />
              <p className="text-xs italic">No feedback yet. Check back after submission.</p>
            </div>
          </div>

          <div className="glass-panel p-6 border border-white/10 bg-black/40">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Resources</h3>
            <div className="space-y-3">
              {[
                { name: 'Hydra UI Specs.pdf', type: 'doc' },
                { name: 'Grid Layout Patterns', type: 'link' },
                { name: 'Asset Pack v2.zip', type: 'file' }
              ].map((res, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg group hover:border-brand-cyan/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-brand-cyan" />
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{res.name}</span>
                  </div>
                  <ExternalLink size={14} className="text-gray-600 group-hover:text-brand-cyan transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
