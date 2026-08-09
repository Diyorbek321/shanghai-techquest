import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Code, 
  BookOpen, 
  Target, 
  ChevronRight, 
  X,
  Plus,
  Server,
  BookText,
  Presentation,
  Bell,
  Calendar
} from 'lucide-react';
import { ViewType, Track } from '../types';

interface QuickActionsProps {
  onNavigate: (view: ViewType) => void;
  userTrack: Track | null;
}

export function QuickActions({ onNavigate, userTrack }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'codelab', label: 'Kod Laboratoriyasi', icon: <Code size={18} />, color: 'bg-brand-cyan', view: 'codelab' as ViewType },
    { id: 'assignment', label: "So'nggi vazifa", icon: <Target size={18} />, color: 'bg-brand-purple', view: 'assignments' as ViewType },
    { id: 'homework', label: 'Kunlik uy vazifasi', icon: <BookText size={18} />, color: 'bg-brand-orange', view: 'homework' as ViewType },
    { id: 'signals', label: 'Bildirishnomalar', icon: <Bell size={18} />, color: 'bg-brand-purple', view: 'notifications' as ViewType },
    { id: 'schedule', label: "Jadvalni ko'rish", icon: <Calendar size={18} />, color: 'bg-brand-cyan', view: 'calendar' as ViewType },
    { id: 'office', label: 'Ofis Dasturlari', icon: <Presentation size={18} />, color: 'bg-blue-600', view: 'office_course' as ViewType, trackRequirement: 'office' as Track },
    { id: 'course', label: 'Frontendni davom ettirish', icon: <BookOpen size={18} />, color: 'bg-brand-orange', view: 'frontend_course' as ViewType, trackRequirement: 'frontend' as Track },
    { id: 'backend', label: 'Backendni davom ettirish', icon: <Server size={18} />, color: 'bg-emerald-600', view: 'backend_course' as ViewType, trackRequirement: 'backend' as Track },
  ].filter(action => !action.trackRequirement || userTrack === action.trackRequirement);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 mb-4 w-64 space-y-2"
          >
            {actions.map((action, i) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  onNavigate(action.view);
                  setIsOpen(false);
                }}
                className="w-full glass-panel p-3 border border-white/10 bg-black/80 hover:bg-white/5 transition-all flex items-center justify-between group rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-black ${action.color}`}>
                    {action.icon}
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-tight">{action.label}</span>
                </div>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          isOpen ? 'bg-brand-red rotate-45' : 'bg-brand-cyan shadow-[0_0_20px_rgba(0,217,255,0.4)]'
        }`}
      >
        {isOpen ? <X className="text-white" size={28} /> : <Plus className="text-black" size={28} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red rounded-full animate-pulse border-2 border-black" />
        )}
      </motion.button>
    </div>
  );
}
