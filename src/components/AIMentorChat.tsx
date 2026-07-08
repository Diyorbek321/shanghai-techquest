import React, { useState } from 'react';
import { MessageSquare, X, Send, Paperclip, Code, Mic } from 'lucide-react';
import { cn } from '../lib/utils';

export function AIMentorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-ai-mentor', handleToggle);
    return () => window.removeEventListener('toggle-ai-mentor', handleToggle);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-brand-purple text-white shadow-[0_0_20px_rgba(176,38,255,0.4)] hover:scale-110 transition-transform z-50 flex items-center justify-center group"
      >
        <MessageSquare size={24} />
        <span className={cn(
          "absolute right-full mr-4 bg-brand-card border border-brand-purple/50 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all duration-300 pointer-events-none text-glow",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        )}>
          Ask TechSensei
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-brand-card backdrop-blur-xl border border-brand-purple/50 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden neon-glow-purple flex-shrink-0">
      
      {/* Header */}
      <div className="p-4 border-b border-brand-border bg-gradient-to-r from-brand-purple/20 to-transparent flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center border border-brand-purple/50 text-xl relative">
            🤖
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-brand-green rounded-full border-2 border-brand-bg"></div>
          </div>
          <div>
            <h3 className="font-bold text-white text-glow">TechSensei AI</h3>
            <p className="text-xs text-brand-green">Online</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
        <div className="flex gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center shrink-0 border border-brand-purple/50">🤖</div>
          <div className="bg-white/10 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-200 border border-white/5">
            Hello! I'm TechSensei. I'm here to help you level up your coding skills. What are we working on today?
          </div>
        </div>

        <div className="flex gap-3 max-w-[85%] ml-auto justify-end">
          <div className="bg-brand-cyan/20 rounded-2xl rounded-tr-sm p-3 text-sm text-white border border-brand-cyan/30">
            Can you explain how CSS Grid areas work?
          </div>
        </div>

        <div className="flex gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center shrink-0 border border-brand-purple/50">🤖</div>
          <div className="bg-white/10 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-200 border border-white/5">
            <p className="mb-2">Sure! CSS Grid areas let you name sections of your layout and place elements easily.</p>
            <div className="bg-black/50 p-2 rounded border border-brand-border font-mono text-xs text-brand-cyan my-2 overflow-x-auto">
              .container {'{'}<br/>
              &nbsp;&nbsp;display: grid;<br/>
              &nbsp;&nbsp;grid-template-areas:<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"header header"<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"sidebar main"<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"footer footer";<br/>
              {'}'}
            </div>
            <p>You then assign items using <code className="bg-black/30 px-1 rounded text-brand-purple">grid-area: header;</code></p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar shrink-0 border-t border-white/5">
        {['Explain error', 'Review my code', 'Suggest improvements'].map(chip => (
          <button key={chip} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-brand-purple/20 border border-white/10 hover:border-brand-purple/50 text-xs text-gray-300 transition-colors">
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-brand-border bg-black/40 shrink-0">
        <div className="flex items-end gap-2 bg-black/40 border border-brand-border focus-within:border-brand-purple rounded-xl p-1 transition-colors">
          <div className="flex gap-1 p-1 shrink-0">
            <button className="p-1.5 text-gray-400 hover:text-white rounded-lg"><Paperclip size={18} /></button>
            <button className="p-1.5 text-gray-400 hover:text-brand-cyan rounded-lg"><Code size={18} /></button>
          </div>
          <textarea 
            placeholder="Type a message..."
            className="w-full bg-transparent text-sm resize-none focus:outline-none py-2 max-h-32 text-white custom-scrollbar"
            rows={1}
            style={{ minHeight: '36px' }}
          ></textarea>
          <div className="flex gap-1 p-1 shrink-0">
            <button className="p-1.5 text-gray-400 hover:text-brand-orange rounded-lg"><Mic size={18} /></button>
            <button className="p-1.5 bg-brand-purple hover:bg-brand-purple/80 text-white rounded-lg transition-colors"><Send size={16} /></button>
          </div>
        </div>
      </div>

    </div>
  );
}
