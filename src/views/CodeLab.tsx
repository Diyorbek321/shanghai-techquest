import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  Check, 
  Terminal, 
  LayoutTemplate, 
  MessageSquareCode,
  FileCode2,
  ChevronDown,
  XCircle,
  CheckCircle2,
  Maximize2,
  Loader2,
  BrainCircuit,
  Eye,
  CheckCircle,
  Cpu,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

import { useQuestManager } from '../lib/QuestManager';

export function CodeLab() {
  const [activeTab, setActiveTab] = useState<'preview' | 'console' | 'tests' | 'ai' | 'review'>('preview');
  const [activeFile, setActiveFile] = useState<'html' | 'css' | 'js'>('html');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { addXp } = useQuestManager();
  const [aiReview, setAiReview] = useState<{ rating: number; feedback: string; cyberSuggestion: string } | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleAiReview = async () => {
    setIsReviewing(true);
    setAiReview(null);
    try {
      const response = await fetch('/api/review-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code[activeFile as keyof typeof code], language: activeFile }),
      });
      const data = await response.json();
      setAiReview(data);
      setActiveTab('review');
    } catch (error) {
      console.error('AI Review error:', error);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      addXp(150, 'CodeLab Challenge');
      setTimeout(() => setShowSuccess(false), 4000);
    }, 2000);
  };

  const [code, setCode] = useState({
    html: '<div class="card">\n  <h2>Profile</h2>\n  <p>Student Developer</p>\n</div>',
    css: '.card {\n  background: rgba(10, 14, 39, 0.8);\n  border: 1px solid #00D9FF;\n  border-radius: 8px;\n  padding: 20px;\n  color: white;\n  text-align: center;\n  box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);\n}\n\n.card h2 {\n  color: #00D9FF;\n  margin-bottom: 8px;\n}',
    js: 'console.log("Card component initialized.");'
  });

  React.useEffect(() => {
    const handleRunCode = () => {
      // In a real app, this would trigger the actual execution logic
      console.log('Shortcut: Running code...');
      handleSubmit();
    };
    window.addEventListener('run-code-shortcut', handleRunCode);
    return () => window.removeEventListener('run-code-shortcut', handleRunCode);
  }, [code]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(prev => ({ ...prev, [activeFile]: value }));
    }
  };

  const getLanguage = () => {
    if (activeFile === 'html') return 'html';
    if (activeFile === 'css') return 'css';
    return 'javascript';
  };

  const renderPreview = () => {
    const srcDoc = `
      <html>
        <head>
          <style>
            body { font-family: system-ui, sans-serif; background: #000; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            ${code.css}
          </style>
        </head>
        <body>
          ${code.html}
          <script>${code.js}</script>
        </body>
      </html>
    `;
    return (
      <div className="w-full h-full bg-black relative">
        <iframe 
          srcDoc={srcDoc}
          title="preview"
          className="w-full h-full border-none"
          sandbox="allow-scripts"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button className="bg-black/50 p-1.5 rounded text-gray-400 hover:text-white backdrop-blur">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -mt-2 -mx-2 sm:-mx-4 lg:-mx-6">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between p-3 bg-brand-bg border-b border-brand-border">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              Build a Profile Card
              <span className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded border border-brand-cyan/30">Frontend</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 rounded-md transition-colors">
            <RotateCcw size={16} /> Reset
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-purple bg-brand-purple/10 border border-brand-purple/30 rounded-md hover:bg-brand-purple/20 transition-colors">
            <MessageSquareCode size={16} /> Get Hint
          </button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-brand-bg bg-brand-cyan rounded-md hover:bg-brand-cyan/90 transition-all neon-glow-cyan shadow-lg"
          >
            <Play size={16} fill="currentColor" /> Run Code
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAiReview}
            disabled={isReviewing}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/30 rounded-md hover:bg-brand-cyan/20 transition-all"
          >
            {isReviewing ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
            AI Review
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isSubmitting || showSuccess}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-gradient-to-r from-brand-purple to-brand-cyan rounded-md hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? <RotateCcw size={16} className="animate-spin" /> : <Check size={16} />}
            {isSubmitting ? 'Testing...' : 'Submit'}
          </motion.button>
        </div>
      </div>

      {/* Main Split Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Panel: Editor */}
        <div className="w-1/2 flex flex-col border-r border-brand-border">
          {/* File Tabs */}
          <div className="flex bg-[#1e1e1e] border-b border-black">
            {(['html', 'css', 'js'] as const).map(ext => (
              <button
                key={ext}
                onClick={() => setActiveFile(ext)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm border-r border-black transition-colors",
                  activeFile === ext 
                    ? "bg-[#252526] text-white border-t-2 border-t-brand-cyan" 
                    : "text-gray-500 hover:bg-[#2a2a2b] hover:text-gray-300 border-t-2 border-t-transparent"
                )}
              >
                <FileCode2 size={14} className={
                  ext === 'html' ? 'text-orange-400' : 
                  ext === 'css' ? 'text-blue-400' : 'text-yellow-400'
                } />
                index.{ext}
              </button>
            ))}
          </div>
          
          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              theme="vs-dark"
              language={getLanguage()}
              value={code[activeFile]}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
              }}
            />
          </div>
        </div>

        {/* Right Panel: Output/Tools */}
        <div className="w-1/2 flex flex-col bg-brand-bg">
          {/* Tool Tabs */}
          <div className="flex border-b border-brand-border px-2">
            {[
              { id: 'preview', label: 'Preview', icon: LayoutTemplate },
              { id: 'console', label: 'Console', icon: Terminal },
              { id: 'tests', label: 'Tests', icon: CheckCircle2 },
              { id: 'ai', label: 'AI Assistant', icon: MessageSquareCode },
              { id: 'review', label: 'Code Review', icon: MessageSquareCode }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id 
                    ? "text-brand-cyan border-brand-cyan" 
                    : "text-gray-400 border-transparent hover:text-gray-200"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'preview' && renderPreview()}
            
            {activeTab === 'review' && (
              <div className="p-6 h-full bg-brand-bg text-white overflow-auto">
                {aiReview ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-heading font-bold text-brand-cyan">AI Peer Review</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 uppercase tracking-widest">Quality Rating</span>
                        <span className="text-2xl font-mono text-brand-green">{aiReview.rating}/10</span>
                      </div>
                    </div>

                    <div className="p-4 bg-brand-sidebar/40 border border-brand-border rounded-xl">
                      <div className="markdown-body text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {aiReview.feedback}
                      </div>
                    </div>

                    <div className="p-4 bg-brand-purple/10 border border-brand-purple/30 rounded-xl flex items-center gap-4">
                      <Zap className="text-brand-purple shrink-0" size={24} />
                      <div>
                        <h4 className="text-brand-purple font-bold text-sm uppercase tracking-wider">Cybernetic Suggestion</h4>
                        <p className="text-white text-sm mt-1">{aiReview.cyberSuggestion}</p>
                      </div>
                    </div>

                    <button 
                      onClick={handleAiReview}
                      className="w-full py-2 bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-sm font-bold rounded-lg hover:bg-brand-cyan/20 transition-colors"
                    >
                      Refresh AI Insights
                    </button>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-brand-border rounded-2xl">
                    <BrainCircuit size={48} className="text-gray-600 mb-4 animate-pulse" />
                    <h4 className="text-gray-400 font-bold mb-2">Initialize Code Synthesis</h4>
                    <p className="text-gray-600 text-sm max-w-xs">
                      Upload your code block to the neural network to receive detailed structural analysis and performance metrics.
                    </p>
                    <button 
                      onClick={handleAiReview}
                      disabled={isReviewing}
                      className="mt-6 px-6 py-2 bg-brand-cyan text-black font-bold rounded-lg hover:bg-brand-cyan/80 transition-all"
                    >
                      {isReviewing ? 'Analyzing Protocol...' : 'Run Diagnostics'}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'console' && (
              <div className="p-4 font-mono text-sm h-full bg-[#0d1117] overflow-y-auto">
                <div className="text-gray-500 mb-2"># Web Console</div>
                <div className="text-brand-green flex gap-2"><span className="text-gray-500">&gt;</span> Card component initialized.</div>
              </div>
            )}
            
            {activeTab === 'tests' && (
              <div className="p-4 h-full overflow-y-auto bg-brand-bg">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="font-semibold text-gray-200">Test Results</h3>
                  <span className="text-xs font-mono text-brand-green bg-brand-green/10 px-2 py-1 rounded">2/3 Passed</span>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
                  <div className="bg-brand-cyan h-2 rounded-full" style={{ width: '66%' }}></div>
                </div>

                <div className="space-y-3">
                  <div className="bg-black/30 border border-brand-border rounded p-3 flex gap-3">
                    <CheckCircle2 className="text-brand-green shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="text-sm font-medium">Card element exists</div>
                      <div className="text-xs text-gray-500 mt-1">Expected .card to be in document</div>
                    </div>
                  </div>
                  <div className="bg-black/30 border border-brand-border rounded p-3 flex gap-3">
                    <CheckCircle2 className="text-brand-green shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="text-sm font-medium">Card has styling applied</div>
                      <div className="text-xs text-gray-500 mt-1">Expected background and border properties</div>
                    </div>
                  </div>
                  <div className="bg-brand-orange/5 border border-brand-orange/30 rounded p-3 flex gap-3">
                    <XCircle className="text-brand-orange shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="text-sm font-medium text-brand-orange">Hover effect implemented</div>
                      <div className="text-xs text-gray-400 mt-1">Expected transform scale on hover.</div>
                      <div className="mt-2 text-xs font-mono bg-black/50 p-2 rounded border border-brand-orange/20 text-gray-300">
                        Expected: transform: scale(1.05)<br/>
                        Received: none
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="flex flex-col h-full bg-brand-bg">
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-brand-purple/20 border border-brand-purple/50 flex items-center justify-center shrink-0">
                      🤖
                    </div>
                    <div className="bg-brand-card p-3 rounded-lg rounded-tl-none border border-brand-border text-sm">
                      <p className="mb-2">Hello! I'm TechSensei. I see you're working on the Profile Card assignment.</p>
                      <p>Your current code looks good, but you're missing the hover state for the 3rd test. Try adding a <code className="text-brand-cyan bg-black/50 px-1 rounded">:hover</code> pseudo-class in your CSS.</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-brand-border bg-black/20">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask for a hint..."
                      className="flex-1 bg-black/40 border border-brand-border rounded pl-3 py-1.5 text-sm focus:border-brand-purple focus:outline-none"
                    />
                    <button className="px-3 py-1.5 bg-brand-purple/20 text-brand-purple border border-brand-purple/50 rounded text-sm font-medium hover:bg-brand-purple/30">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'review' && (
              <div className="flex flex-col h-full bg-brand-bg">
                <div className="p-3 border-b border-brand-border bg-black/40 flex justify-between items-center">
                  <div className="text-sm font-medium">Peer Reviews (2)</div>
                  <button className="text-xs bg-brand-purple/20 text-brand-purple px-2 py-1 rounded border border-brand-purple/50">Request Review</button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  <div className="bg-black/30 border border-brand-border rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">AS</div>
                        <span className="text-sm font-bold text-gray-300">Alex_Student</span>
                      </div>
                      <span className="text-xs text-gray-500">10 mins ago</span>
                    </div>
                    <div className="bg-black/50 border-l-2 border-brand-cyan p-2 mb-2 font-mono text-xs text-gray-400">
                      Line 5 (CSS): <span className="text-brand-cyan">padding: 20px;</span>
                    </div>
                    <p className="text-sm text-gray-300">Consider using rem units instead of px for better accessibility scaling across different devices!</p>
                  </div>
                  
                  <div className="bg-black/30 border border-brand-border rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs">SJ</div>
                        <span className="text-sm font-bold text-gray-300">Sarah.JS</span>
                      </div>
                      <span className="text-xs text-gray-500">1 hour ago</span>
                    </div>
                    <div className="bg-black/50 border-l-2 border-brand-cyan p-2 mb-2 font-mono text-xs text-gray-400">
                      Line 7 (CSS): <span className="text-brand-cyan">text-align: center;</span>
                    </div>
                    <p className="text-sm text-gray-300">This looks great. Maybe add a subtle hover effect to the card to make it feel more interactive?</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Assignment Details (Collapsible) */}
      <div className="h-10 bg-brand-bg border-t border-brand-border flex items-center px-4 justify-between cursor-pointer hover:bg-white/5 relative z-10">
        <span className="text-sm font-medium text-gray-300">Assignment Requirements</span>
        <ChevronDown size={16} className="text-gray-500" />
      </div>

      {/* Epic Game-Feel Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-brand-bg/80 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,136,0.1)_0%,_transparent_60%)] pointer-events-none"></div>
            
            {/* Animated particles (fake) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute w-[800px] h-[800px] border-4 border-brand-green/30 rounded-full"
            />
            
            <motion.div 
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
              className="relative text-center flex flex-col items-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-10 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(0,255,136,0.5)_360deg)] rounded-full blur-xl"
              />
              <div className="bg-brand-bg border border-brand-green p-8 rounded-2xl neon-glow-green relative z-10 shadow-2xl">
                <h2 className="font-heading text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-green to-brand-green tracking-tight mb-2 uppercase drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]">
                  Quest Complete!
                </h2>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-mono text-3xl font-bold text-[#FFD700] mb-6 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                >
                  +150 XP
                </motion.div>
                
                <div className="w-64 mx-auto mb-2 text-left space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-brand-orange mb-1 font-bold">
                      <span className="flex items-center gap-1">🔥 Streak Extended!</span>
                      <span>13 Days</span>
                    </div>
                    <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-brand-orange/30">
                      <motion.div 
                        initial={{ width: "12%" }}
                        animate={{ width: "13%" }}
                        transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#FFD700] to-brand-orange shadow-[0_0_10px_rgba(255,140,0,0.8)]"
                      />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 text-center">2 days until next milestone bonus!</div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-brand-green mb-1 font-bold">
                      <span>Rank Progression</span>
                      <span>2600 / 3000 XP</span>
                    </div>
                    <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-brand-green/30">
                      <motion.div 
                        initial={{ width: "81%" }}
                        animate={{ width: "86%" }}
                        transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-brand-cyan to-brand-green"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
