import React from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Book, 
  Terminal, 
  ShieldQuestion, 
  ChevronDown, 
  ExternalLink,
  Github,
  Twitter,
  Mail
} from 'lucide-react';

export function HelpCenter() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const faqs = [
    { 
      q: "How do I earn XP for my city?", 
      a: "Every time you complete a quest in the Assignments section or solve a problem in the Problem sets, you earn Universal XP. This XP directly powers your city's growth and unlocks new building types."
    },
    { 
      q: "What are the Arena seasons?", 
      a: "Seasons last 30 days. During this time, every battle win contributes to your rank. At the end of the season, players in the Top 100 receive exclusive gear and rare city monuments."
    },
    { 
      q: "How do I become a Teacher?", 
      a: "Teacher status is granted to community contributors who have maintained a Level 50+ profile and passed the 'Core Pedagogical Assessment'. Contact support if you meet these requirements."
    },
    { 
      q: "Can I use external libraries in Code Lab?", 
      a: "Yes! Code Lab supports most popular NPM packages. Simply use the package manager interface within the lab to add dependencies to your sandbox."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-brand-cyan/10 rounded-3xl border border-brand-cyan/20 mb-6">
          <HelpCircle size={48} className="text-brand-cyan" />
        </div>
        <h1 className="text-4xl font-heading font-bold text-white tracking-tight mb-4">Neural Support Interface</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">Access the central knowledge base or connect with our support agents for any technical difficulties.</p>
        
        <div className="mt-8 relative max-w-2xl mx-auto">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search documentation, tutorials, and community fixes..." 
            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-brand-cyan focus:outline-none transition-all shadow-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Documentation', icon: <Book className="text-brand-cyan" />, desc: 'Core platform guides' },
          { label: 'Community', icon: <MessageSquare className="text-brand-purple" />, desc: 'Discuss with peers' },
          { label: 'Terminal Logs', icon: <Terminal className="text-brand-orange" />, desc: 'System status & updates' },
        ].map((box, i) => (
          <button key={i} className="glass-panel p-6 border border-white/10 rounded-2xl hover:border-brand-cyan/50 transition-all text-left group">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-fit mb-4 group-hover:bg-brand-cyan/10 group-hover:border-brand-cyan/30 transition-all">
              {box.icon}
            </div>
            <h3 className="font-bold text-white mb-1 group-hover:text-brand-cyan transition-colors">{box.label}</h3>
            <p className="text-xs text-gray-500">{box.desc}</p>
          </button>
        ))}
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <ShieldQuestion className="text-brand-purple" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-panel border border-white/10 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white">{faq.q}</span>
                  <ChevronDown size={18} className={`text-gray-500 transition-transform ${openFaq === i ? 'rotate-180 text-brand-cyan' : ''}`} />
                </button>
                {openFaq === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5 text-sm text-gray-400 leading-relaxed"
                  >
                    <div className="pt-2 border-t border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-purple/10 border border-brand-purple/20 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">Still stuck in the mainframe?</h3>
            <p className="text-gray-400 text-sm">Our support agents are available 24/7 to help you resolve any issues with your city, gear, or account.</p>
          </div>
          <button className="px-8 py-3 bg-brand-purple hover:bg-brand-purple/80 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(176,38,255,0.4)] whitespace-nowrap">
            Open Support Ticket
          </button>
        </div>

        <div className="flex justify-center gap-8 py-8 border-t border-white/5">
          <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
            <Github size={18} /> GitHub
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
            <Twitter size={18} /> Twitter
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
            <Mail size={18} /> Email
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
            <ExternalLink size={18} /> Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
