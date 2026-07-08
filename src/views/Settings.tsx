import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Volume2, 
  Monitor, 
  Keyboard, 
  Database,
  Moon,
  Sun,
  Eye,
  Lock,
  LogOut
} from 'lucide-react';
import { audioManager } from '../lib/audio';

export function Settings() {
  const [audioEnabled, setAudioEnabled] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const [theme, setTheme] = React.useState<'dark' | 'neon' | 'cyber'>('dark');

  const handleAudioToggle = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      audioManager.playClick();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-brand-cyan/10 rounded-2xl border border-brand-cyan/20">
          <SettingsIcon size={32} className="text-brand-cyan" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">System Settings</h1>
          <p className="text-gray-400">Manage your TechQuest experience and cyber-identity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          {[
            { id: 'profile', label: 'Profile Settings', icon: <User size={18} /> },
            { id: 'appearance', label: 'Appearance', icon: <Monitor size={18} /> },
            { id: 'audio', label: 'Audio & SFX', icon: <Volume2 size={18} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
            { id: 'security', label: 'Security', icon: <Shield size={18} /> },
            { id: 'keys', label: 'Hotkeys', icon: <Keyboard size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:bg-white/5 text-gray-400 hover:text-white border border-transparent hover:border-white/10"
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
          
          <div className="pt-4 border-t border-brand-border mt-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-brand-red hover:bg-brand-red/10 transition-all">
              <LogOut size={18} />
              <span className="text-sm font-medium">Terminate Session</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Appearance Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 border border-white/10 rounded-2xl"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Monitor size={20} className="text-brand-cyan" />
              Interface Theme
            </h2>
            
            <div className="grid grid-cols-3 gap-4">
              {['dark', 'neon', 'cyber'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t as any)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    theme === t ? 'border-brand-cyan bg-brand-cyan/10' : 'border-white/5 bg-black/20 hover:border-white/20'
                  }`}
                >
                  <div className={`w-full aspect-video rounded-md mb-2 ${
                    t === 'dark' ? 'bg-brand-bg' : t === 'neon' ? 'bg-[#0A0E27]' : 'bg-[#1a1a1a]'
                  }`}>
                    <div className="flex gap-1 p-1">
                      <div className={`w-2 h-2 rounded-full ${t === 'neon' ? 'bg-brand-cyan' : 'bg-gray-600'}`}></div>
                      <div className={`w-2 h-2 rounded-full ${t === 'neon' ? 'bg-brand-purple' : 'bg-gray-600'}`}></div>
                    </div>
                  </div>
                  <span className="text-xs font-bold capitalize text-white">{t}</span>
                  {theme === t && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-brand-cyan rounded-full flex items-center justify-center">
                      <Lock size={10} className="text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Audio Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 border border-white/10 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Volume2 size={20} className="text-brand-purple" />
                Sound & Atmosphere
              </h2>
              <button 
                onClick={handleAudioToggle}
                className={`w-12 h-6 rounded-full transition-colors relative ${audioEnabled ? 'bg-brand-cyan' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${audioEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Interface Feedback</p>
                  <p className="text-xs text-gray-500">Play subtle clicks and hovers</p>
                </div>
                <input type="range" className="w-32 accent-brand-cyan" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Ambient Soundtrack</p>
                  <p className="text-xs text-gray-500">Low-fi cyber beats for focus</p>
                </div>
                <input type="range" className="w-32 accent-brand-purple" />
              </div>
            </div>
          </motion.div>

          {/* Account Visibility */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 border border-white/10 rounded-2xl"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Eye size={20} className="text-brand-orange" />
              Privacy & Presence
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="w-5 h-5 border-2 border-brand-orange/50 rounded flex items-center justify-center group-hover:border-brand-orange">
                  <div className="w-3 h-3 bg-brand-orange rounded-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-300">Appear Online</p>
                  <p className="text-xs text-gray-500">Let peers see when you're active in the Arena</p>
                </div>
              </label>
              
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="w-5 h-5 border-2 border-white/20 rounded flex items-center justify-center group-hover:border-brand-cyan">
                  {/* Unchecked */}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-300">Public Profile</p>
                  <p className="text-xs text-gray-500">Allow others to view your achievements and MyCity</p>
                </div>
              </label>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
