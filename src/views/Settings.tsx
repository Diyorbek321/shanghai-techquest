import React from 'react';
import { motion } from 'motion/react';
import {
  Settings as SettingsIcon,
  User as UserIcon,
  Bell,
  Shield,
  Volume2,
  Monitor,
  Keyboard,
  Eye,
  Lock,
  LogOut
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { audioManager } from '../lib/audio';
import { api } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { User } from '../types';

const THEME_LABELS: Record<'dark' | 'neon' | 'cyber', string> = {
  dark: 'Tungi',
  neon: 'Neon',
  cyber: 'Kiber',
};

type TabId = 'profile' | 'appearance' | 'audio' | 'notifications' | 'security' | 'keys';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profil sozlamalari', icon: <UserIcon size={18} /> },
  { id: 'appearance', label: "Ko'rinish", icon: <Monitor size={18} /> },
  { id: 'audio', label: 'Audio va effektlar', icon: <Volume2 size={18} /> },
  { id: 'notifications', label: 'Bildirishnomalar', icon: <Bell size={18} /> },
  { id: 'security', label: 'Xavfsizlik', icon: <Shield size={18} /> },
  { id: 'keys', label: 'Tezkor tugmalar', icon: <Keyboard size={18} /> },
];

interface SettingsProps {
  user: User;
}

export function Settings({ user }: SettingsProps) {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = React.useState<TabId>('appearance');
  const [theme, setTheme] = React.useState<'dark' | 'neon' | 'cyber'>(user.theme);
  const [audioEnabled, setAudioEnabled] = React.useState(user.audioEnabled);
  const [onlineVisible, setOnlineVisible] = React.useState(user.onlineVisible);
  const [profilePublic, setProfilePublic] = React.useState(user.profilePublic);
  const [pushEnabled, setPushEnabled] = React.useState(user.pushEnabled);
  const [uiSfxVolume, setUiSfxVolume] = React.useState<number>(() => {
    const stored = localStorage.getItem('techquest.uiSfxVolume');
    return stored !== null ? Number(stored) : 50;
  });
  const [bgmVolume, setBgmVolume] = React.useState<number>(() => {
    const stored = localStorage.getItem('techquest.bgmVolume');
    return stored !== null ? Number(stored) : 50;
  });

  const updateUser = useMutation({
    mutationFn: (body: Partial<Pick<User, 'theme' | 'audioEnabled' | 'onlineVisible' | 'profilePublic' | 'pushEnabled'>>) =>
      api.patch<User>('/users/me', body),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['auth', 'me'], updatedUser);
    },
  });

  const handleThemeChange = (t: 'dark' | 'neon' | 'cyber') => {
    setTheme(t);
    updateUser.mutate({ theme: t });
  };

  const handleAudioToggle = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    updateUser.mutate({ audioEnabled: next });
    if (next) {
      audioManager.playClick();
    }
  };

  const handleOnlineVisibleToggle = () => {
    const next = !onlineVisible;
    setOnlineVisible(next);
    updateUser.mutate({ onlineVisible: next });
  };

  const handleProfilePublicToggle = () => {
    const next = !profilePublic;
    setProfilePublic(next);
    updateUser.mutate({ profilePublic: next });
  };

  const handlePushToggle = () => {
    const next = !pushEnabled;
    setPushEnabled(next);
    updateUser.mutate({ pushEnabled: next });
  };

  const handleUiSfxVolumeChange = (value: number) => {
    setUiSfxVolume(value);
    localStorage.setItem('techquest.uiSfxVolume', String(value));
  };

  const handleBgmVolumeChange = (value: number) => {
    setBgmVolume(value);
    localStorage.setItem('techquest.bgmVolume', String(value));
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-brand-cyan/10 rounded-2xl border border-brand-cyan/20">
          <SettingsIcon size={32} className="text-brand-cyan" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Tizim sozlamalari</h1>
          <p className="text-gray-400">TechQuest tajribangiz va kiber-shaxsingizni boshqaring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border ${
                activeTab === tab.id
                  ? 'bg-brand-cyan/10 border-brand-cyan/40 text-white'
                  : 'hover:bg-white/5 text-gray-400 hover:text-white border-transparent hover:border-white/10'
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}

          <div className="pt-4 border-t border-brand-border mt-4">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-brand-red hover:bg-brand-red/10 transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Seansni yakunlash</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 border border-white/10 rounded-2xl"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <UserIcon size={20} className="text-brand-cyan" />
                Profil sozlamalari
              </h2>
              <div className="flex items-center gap-4">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-brand-cyan object-cover" />
                <div>
                  <p className="text-white font-bold">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Ismingiz va avataringizni Profil sahifasidan tahrirlashingiz mumkin.</p>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 border border-white/10 rounded-2xl"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Monitor size={20} className="text-brand-cyan" />
                Interfeys mavzusi
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {(['dark', 'neon', 'cyber'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
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
                    <span className="text-xs font-bold capitalize text-white">{THEME_LABELS[t]}</span>
                    {theme === t && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-brand-cyan rounded-full flex items-center justify-center">
                        <Lock size={10} className="text-black" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'audio' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 border border-white/10 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Volume2 size={20} className="text-brand-purple" />
                  Ovoz va muhit
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
                    <p className="text-sm font-medium text-gray-300">Interfeys effektlari</p>
                    <p className="text-xs text-gray-500">Bosish va hover paytida yengil tovushlar chiqarish</p>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={uiSfxVolume}
                    onChange={(e) => handleUiSfxVolumeChange(Number(e.target.value))}
                    className="w-32 accent-brand-cyan"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Fon musiqasi</p>
                    <p className="text-xs text-gray-500">Diqqatni jamlash uchun low-fi kiber ohanglar</p>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={bgmVolume}
                    onChange={(e) => handleBgmVolumeChange(Number(e.target.value))}
                    className="w-32 accent-brand-purple"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 border border-white/10 rounded-2xl"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Bell size={20} className="text-brand-purple" />
                Bildirishnomalar
              </h2>
              <label className="flex items-center gap-4 cursor-pointer group">
                <button
                  onClick={handlePushToggle}
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                    pushEnabled ? 'border-brand-orange/50' : 'border-white/20 group-hover:border-brand-cyan'
                  }`}
                >
                  {pushEnabled && <div className="w-3 h-3 bg-brand-orange rounded-sm" />}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-300">Push bildirishnomalar</p>
                  <p className="text-xs text-gray-500">Yangi missiyalar va yutuqlar haqida xabar oling</p>
                </div>
              </label>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 border border-white/10 rounded-2xl"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Eye size={20} className="text-brand-orange" />
                Maxfiylik va faollik holati
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <button
                    onClick={handleOnlineVisibleToggle}
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      onlineVisible ? 'border-brand-orange/50' : 'border-white/20 group-hover:border-brand-cyan'
                    }`}
                  >
                    {onlineVisible && <div className="w-3 h-3 bg-brand-orange rounded-sm" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-300">Onlayn ko'rinish</p>
                    <p className="text-xs text-gray-500">Arenada faol bo'lganingizda boshqalar buni ko'rsin</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group">
                  <button
                    onClick={handleProfilePublicToggle}
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      profilePublic ? 'border-brand-orange/50' : 'border-white/20 group-hover:border-brand-cyan'
                    }`}
                  >
                    {profilePublic && <div className="w-3 h-3 bg-brand-orange rounded-sm" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-300">Ochiq profil</p>
                    <p className="text-xs text-gray-500">Boshqalarga yutuqlaringiz va MyCity'ingizni ko'rishga ruxsat bering</p>
                  </div>
                </label>
              </div>
            </motion.div>
          )}

          {activeTab === 'keys' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 border border-white/10 rounded-2xl"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Keyboard size={20} className="text-brand-cyan" />
                Tezkor tugmalar
              </h2>
              <p className="text-xs text-gray-500">Tezkor tugmalarni sozlash hozircha ishlab chiqilmoqda.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
