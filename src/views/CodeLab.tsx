import React, { useRef, useState } from 'react';
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
  CheckCircle2,
  Loader2,
  BrainCircuit,
  Zap,
  Send
} from 'lucide-react';
import { cn } from '../lib/utils';
import { api } from '../lib/api';

import { useQuestManager } from '../lib/QuestManager';

const INITIAL_CODE = {
  html: '<div class="card">\n  <h2>Profil</h2>\n  <p>Talaba dasturchi</p>\n</div>',
  css: '.card {\n  background: rgba(10, 14, 39, 0.8);\n  border: 1px solid #00D9FF;\n  border-radius: 8px;\n  padding: 20px;\n  color: white;\n  text-align: center;\n  box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);\n}\n\n.card h2 {\n  color: #00D9FF;\n  margin-bottom: 8px;\n}',
  js: 'console.log("Card component initialized.");'
};

interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
}

export function CodeLab() {
  const [activeTab, setActiveTab] = useState<'preview' | 'console' | 'tests' | 'ai' | 'review'>('preview');
  const [activeFile, setActiveFile] = useState<'html' | 'css' | 'js'>('html');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [code, setCode] = useState(INITIAL_CODE);
  const [runCount, setRunCount] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<{ level: string; text: string }[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { addXp } = useQuestManager();
  const [aiReview, setAiReview] = useState<{ rating: number; feedback: string; cyberSuggestion: string } | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

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

  const handleReset = () => {
    setCode(INITIAL_CODE);
    setConsoleLogs([]);
  };

  const handleRun = () => {
    setConsoleLogs([]);
    setRunCount((c) => c + 1);
    setActiveTab('console');
  };

  const sendChat = async (content: string) => {
    if (!content.trim() || isChatting) return;
    const userMsg: ChatMessage = { id: `local-${Date.now()}`, role: 'USER', content };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatting(true);
    try {
      const res = await api.post<{ assistantMessage: ChatMessage }>('/mentor/messages', { content });
      setChatMessages((prev) => [...prev, res.assistantMessage]);
    } catch (error) {
      setChatMessages((prev) => [...prev, { id: `err-${Date.now()}`, role: 'ASSISTANT', content: "Javob olishning imkoni bo'lmadi. Birozdan so'ng qayta urinib ko'ring." }]);
    } finally {
      setIsChatting(false);
    }
  };

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type !== 'codelab-console') return;
      setConsoleLogs((prev) => [...prev, { level: event.data.level, text: event.data.text }]);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  React.useEffect(() => {
    const handleRunCode = () => handleRun();
    window.addEventListener('run-code-shortcut', handleRunCode);
    return () => window.removeEventListener('run-code-shortcut', handleRunCode);
  }, []);

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
    const consoleShim = `
      <script>
        (function () {
          function forward(level) {
            return function (...args) {
              window.parent.postMessage({
                type: 'codelab-console',
                level,
                text: args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')
              }, '*');
            };
          }
          console.log = forward('log');
          console.warn = forward('warn');
          console.error = forward('error');
          window.onerror = function (message) {
            window.parent.postMessage({ type: 'codelab-console', level: 'error', text: String(message) }, '*');
          };
        })();
      </script>
    `;
    const srcDoc = `
      <html>
        <head>
          ${consoleShim}
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
          ref={iframeRef}
          key={runCount}
          srcDoc={srcDoc}
          title="ko'rib chiqish"
          className="w-full h-full border-none"
          sandbox="allow-scripts"
        />
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
              Profil Kartasini Yaratish
              <span className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded border border-brand-cyan/30">Frontend</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 rounded-md transition-colors"
          >
            <RotateCcw size={16} /> Qayta boshlash
          </button>
          <button
            onClick={() => { setActiveTab('ai'); sendChat('Bu CodeLab mashqi uchun maslahat bering.'); }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-purple bg-brand-purple/10 border border-brand-purple/30 rounded-md hover:bg-brand-purple/20 transition-colors"
          >
            <MessageSquareCode size={16} /> Maslahat Olish
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRun}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-brand-bg bg-brand-cyan rounded-md hover:bg-brand-cyan/90 transition-all neon-glow-cyan shadow-lg"
          >
            <Play size={16} fill="currentColor" /> Kodni Ishga Tushirish
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAiReview}
            disabled={isReviewing}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/30 rounded-md hover:bg-brand-cyan/20 transition-all"
          >
            {isReviewing ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
            AI Sharh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isSubmitting || showSuccess}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-gradient-to-r from-brand-purple to-brand-cyan rounded-md hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? <RotateCcw size={16} className="animate-spin" /> : <Check size={16} />}
            {isSubmitting ? 'Yakunlanmoqda...' : 'Mashqni Yakunlash'}
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
              { id: 'preview', label: 'Ko\'rib chiqish', icon: LayoutTemplate },
              { id: 'console', label: 'Konsol', icon: Terminal },
              { id: 'tests', label: 'Sinovlar', icon: CheckCircle2 },
              { id: 'ai', label: 'AI Yordamchi', icon: MessageSquareCode },
              { id: 'review', label: 'Kodni Ko\'rib chiqish', icon: MessageSquareCode }
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
                      <h3 className="text-xl font-heading font-bold text-brand-cyan">AI Hamkasb Sharhi</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 uppercase tracking-widest">Sifat Bahosi</span>
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
                        <h4 className="text-brand-purple font-bold text-sm uppercase tracking-wider">Kibernetik Tavsiya</h4>
                        <p className="text-white text-sm mt-1">{aiReview.cyberSuggestion}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleAiReview}
                      className="w-full py-2 bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-sm font-bold rounded-lg hover:bg-brand-cyan/20 transition-colors"
                    >
                      AI Tahlilini Yangilash
                    </button>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-brand-border rounded-2xl">
                    <BrainCircuit size={48} className="text-gray-600 mb-4 animate-pulse" />
                    <h4 className="text-gray-400 font-bold mb-2">Kod Sintezini Ishga Tushirish</h4>
                    <p className="text-gray-600 text-sm max-w-xs">
                      Batafsil strukturaviy tahlil va unumdorlik ko'rsatkichlarini olish uchun kod blokingizni neyron tarmoqqa yuklang.
                    </p>
                    <button
                      onClick={handleAiReview}
                      disabled={isReviewing}
                      className="mt-6 px-6 py-2 bg-brand-cyan text-black font-bold rounded-lg hover:bg-brand-cyan/80 transition-all"
                    >
                      {isReviewing ? 'Protokol Tahlil Qilinmoqda...' : 'Diagnostikani Ishga Tushirish'}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'console' && (
              <div className="p-4 font-mono text-sm h-full bg-[#0d1117] overflow-y-auto">
                <div className="text-gray-500 mb-2"># Veb Konsol — "Kodni Ishga Tushirish" bosilganda yangilanadi</div>
                {consoleLogs.length === 0 && (
                  <div className="text-gray-600">Hali chiqish yo'q. console.log() dan foydalaning va "Kodni Ishga Tushirish" tugmasini bosing.</div>
                )}
                {consoleLogs.map((log, i) => (
                  <div key={i} className={cn('flex gap-2', log.level === 'error' ? 'text-brand-red' : log.level === 'warn' ? 'text-brand-orange' : 'text-brand-green')}>
                    <span className="text-gray-500">&gt;</span> {log.text}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-brand-border rounded-2xl m-4">
                <CheckCircle2 size={48} className="text-gray-600 mb-4" />
                <h4 className="text-gray-400 font-bold mb-2">Avtomatik sinovlar mavjud emas</h4>
                <p className="text-gray-600 text-sm max-w-xs">
                  Bu erkin mashq maydoni — baholangan test holatlari yo'q. Kodingizni tekshirish uchun "AI Sharh" tugmasidan foydalaning.
                </p>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="flex flex-col h-full bg-brand-bg">
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded bg-brand-purple/20 border border-brand-purple/50 flex items-center justify-center shrink-0">
                        🤖
                      </div>
                      <div className="bg-brand-card p-3 rounded-lg rounded-tl-none border border-brand-border text-sm">
                        Salom! Men TechSensei man. Kodingiz haqida savol bering yoki "Maslahat Olish" tugmasini bosing.
                      </div>
                    </div>
                  )}
                  {chatMessages.map((m) => (
                    <div key={m.id} className={cn('flex gap-3', m.role === 'USER' && 'flex-row-reverse')}>
                      <div className="w-8 h-8 rounded bg-brand-purple/20 border border-brand-purple/50 flex items-center justify-center shrink-0">
                        {m.role === 'USER' ? '🧑' : '🤖'}
                      </div>
                      <div className="bg-brand-card p-3 rounded-lg border border-brand-border text-sm max-w-[80%] whitespace-pre-wrap">
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {isChatting && <div className="text-xs text-gray-500 flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> TechSensei yozmoqda...</div>}
                </div>
                <div className="p-3 border-t border-brand-border bg-black/20">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') sendChat(chatInput); }}
                      placeholder="Maslahat so'rang..."
                      className="flex-1 bg-black/40 border border-brand-border rounded pl-3 py-1.5 text-sm focus:border-brand-purple focus:outline-none"
                    />
                    <button
                      onClick={() => sendChat(chatInput)}
                      disabled={isChatting || !chatInput.trim()}
                      className="px-3 py-1.5 bg-brand-purple/20 text-brand-purple border border-brand-purple/50 rounded text-sm font-medium hover:bg-brand-purple/30 disabled:opacity-50 flex items-center gap-1"
                    >
                      <Send size={14} /> Yuborish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Assignment Details (Collapsible) */}
      <div className="h-10 bg-brand-bg border-t border-brand-border flex items-center px-4 justify-between cursor-pointer hover:bg-white/5 relative z-10">
        <span className="text-sm font-medium text-gray-300">Topshiriq Talablari</span>
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
                  Missiya Yakunlandi!
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
                      <span className="flex items-center gap-1">🔥 Ketma-ketlik Uzaytirildi!</span>
                      <span>13 kun</span>
                    </div>
                    <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-brand-orange/30">
                      <motion.div
                        initial={{ width: "12%" }}
                        animate={{ width: "13%" }}
                        transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#FFD700] to-brand-orange shadow-[0_0_10px_rgba(255,140,0,0.8)]"
                      />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 text-center">Keyingi bosqich bonusigacha 2 kun qoldi!</div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-brand-green mb-1 font-bold">
                      <span>Daraja Rivojlanishi</span>
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
