import React from 'react';
import { motion } from 'motion/react';
import { Store, ShoppingCart, Sparkles, Zap, Shield, Crown, Package, Globe, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { cn } from '../lib/utils';
import { useQuestManager } from '../lib/QuestManager';

export function Shop({ user }: { user: User }) {
  const { universalCoins, deductCoins, addXp } = useQuestManager();
  
  const handleBuy = (item: any) => {
    if (deductCoins(item.price)) {
      addXp(50, `Purchased ${item.name}`);
      alert(`Synthesis Complete: ${item.name} acquired.`);
    } else {
      alert(`Neural Credit Depletion. Insufficient funds.`);
    }
  };
  const categories = [
    { id: 'avatars', name: 'Avatars & Frames', icon: Crown },
    { id: 'blueprints', name: 'Architect Blueprints', icon: Globe },
    { id: 'themes', name: 'Editor Themes', icon: Sparkles },
    { id: 'materials', name: 'City Materials', icon: Package },
    { id: 'upgrades', name: 'City Upgrades', icon: Zap },
    { id: 'titles', name: 'Player Titles', icon: Shield },
    { id: 'marketplace', name: 'Marketplace', icon: Globe },
  ];

  const [activeCategory, setActiveCategory] = React.useState('avatars');

  const blueprints = [
    { id: 'b1', name: 'Cyberpunk Skyscraper', type: 'blueprint', price: 2500, rarity: 'legendary', color: 'brand-cyan', desc: 'A towering structure with neon veins and a data-hub core.' },
    { id: 'b2', name: 'Zen Garden Pavilion', type: 'blueprint', price: 1800, rarity: 'epic', color: 'brand-green', desc: 'A peaceful retreat for focused algorithmic meditation.' },
    { id: 'b3', name: 'Neural Nexus Library', type: 'blueprint', price: 1500, rarity: 'rare', color: 'brand-purple', desc: 'A central repository for all your city\'s earned knowledge.' },
    { id: 'b4', name: 'Orbit Station Beta', type: 'blueprint', price: 3000, rarity: 'legendary', color: 'brand-orange', desc: 'A low-orbit platform for monitoring global data streams.' },
  ];

  const marketplaceItems = [
    { id: 'm1', seller: 'UserX_99', item: 'Ancient Code Fragment', price: 4500, rarity: 'legendary', time: '2m ago' },
    { id: 'm2', seller: 'Data_Drifter', item: 'Glitch Aura', price: 2800, rarity: 'epic', time: '15m ago' },
    { id: 'm3', seller: 'Binary_Bard', item: 'Root Access Key', price: 850, rarity: 'rare', time: '1h ago' },
  ];

  const items = [
    { id: 1, name: 'Cyberpunk Frame', type: 'frame', price: 500, rarity: 'epic', color: 'brand-cyan' },
    { id: 2, name: 'Neon Synth Theme', type: 'theme', price: 800, rarity: 'legendary', color: 'brand-purple' },
    { id: 3, name: '2x XP Boost (24h)', type: 'boost', price: 300, rarity: 'rare', color: 'brand-green' },
    { id: 4, name: 'Neon Plasma Glass', type: 'material', price: 150, rarity: 'rare', color: 'brand-cyan' },
    { id: 5, name: 'Holo-Tree Pack', type: 'material', price: 400, rarity: 'epic', color: 'brand-green' },
    { id: 6, name: 'Skyscraper Blueprint', type: 'upgrade', price: 1200, rarity: 'legendary', color: 'brand-purple' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <Store className="text-brand-purple" size={32} />
            Item Shop
          </h1>
          <p className="text-gray-400">Spend your hard-earned coins on exclusive cosmetics and boosts.</p>
        </div>
        
        <div className="bg-black/40 border border-[#FFD700]/30 px-6 py-3 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] flex items-center justify-center font-bold text-black text-sm">
            C
          </div>
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Your Balance</div>
            <div className="text-xl font-mono font-bold text-[#FFD700]">{universalCoins.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="space-y-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 border rounded-xl transition-all text-left",
                activeCategory === cat.id 
                  ? "bg-brand-cyan/10 border-brand-cyan/50 text-brand-cyan" 
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-brand-cyan/50"
              )}
            >
              <cat.icon size={18} />
              <span className="font-bold">{cat.name}</span>
              {cat.id === 'marketplace' && (
                <span className="ml-auto flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCategory === 'marketplace' ? (
            marketplaceItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-6 border border-brand-border group hover:border-brand-orange/50 transition-all flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-gray-500 text-xs font-mono">
                      {item.seller[0]}
                    </div>
                    <div>
                      <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">{item.seller}</h4>
                      <p className="text-[8px] text-brand-orange uppercase font-bold mt-1">{item.time}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border",
                    item.rarity === 'legendary' ? "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30" : "bg-brand-purple/10 text-brand-purple border-brand-purple/30"
                  )}>
                    {item.rarity}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-heading font-bold text-white mb-2">{item.item}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-mono font-bold text-white">{item.price.toLocaleString()}</span>
                    <span className="text-[10px] text-brand-orange font-bold uppercase">Coins</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBuy(item)}
                    className="flex-1 py-2 bg-brand-orange text-black font-bold rounded-lg hover:bg-brand-orange/90 transition-all shadow-[0_0_15px_rgba(255,149,0,0.2)] text-xs"
                  >
                    Buy Now
                  </button>
                  <button className="px-3 py-2 border border-brand-border text-gray-500 font-bold rounded-lg hover:text-white hover:bg-white/5 transition-all text-xs">
                    Offer
                  </button>
                </div>
              </motion.div>
            ))
          ) : activeCategory === 'blueprints' ? (
            blueprints.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel overflow-hidden border border-white/10 hover:border-brand-cyan/50 transition-all group flex flex-col"
              >
                <div className="h-40 bg-black/40 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <Globe className="text-brand-cyan/20 w-32 h-32 absolute -right-8 -bottom-8 rotate-12" />
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="z-20 w-20 h-20 bg-brand-cyan/10 border-2 border-brand-cyan/30 rounded-2xl flex items-center justify-center text-brand-cyan shadow-[0_0_30px_rgba(0,217,255,0.2)]"
                  >
                    <Package size={40} />
                  </motion.div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-lg leading-tight group-hover:text-brand-cyan transition-colors">{item.name}</h3>
                    <span className={cn(
                      "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border",
                      item.rarity === 'legendary' ? "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30" : "bg-brand-purple/10 text-brand-purple border-brand-purple/30"
                    )}>
                      {item.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 italic">"{item.desc}"</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="font-mono font-bold text-[#FFD700] flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-[#FFD700] text-black flex items-center justify-center text-[10px]">C</span>
                      {item.price.toLocaleString()}
                    </div>
                    <button 
                      onClick={() => handleBuy(item)}
                      className="px-4 py-2 bg-brand-cyan hover:bg-brand-cyan/80 text-black font-bold rounded-lg transition-all text-xs"
                    >
                      Acquire
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-panel overflow-hidden flex flex-col border-white/10 hover:border-brand-purple/50 group"
            >
              <div className="h-32 bg-black/50 relative flex items-center justify-center p-4">
                <div className={`absolute inset-0 bg-gradient-to-br from-brand-bg to-brand-sidebar opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                
                {/* Simulated Item Graphic */}
                <div className={`relative z-10 w-16 h-16 rounded-lg flex items-center justify-center text-3xl font-bold bg-${item.color}/10 border border-${item.color}/30 text-${item.color} shadow-[0_0_15px_rgba(var(--color-${item.color}),0.5)]`}>
                  {item.type === 'theme' ? <Sparkles /> : item.type === 'boost' || item.type === 'upgrade' ? <Zap /> : item.type === 'title' ? 'T' : item.type === 'material' ? <Package /> : <Crown />}
                </div>

                <div className={`absolute top-2 right-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                  item.rarity === 'legendary' ? 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/50' :
                  item.rarity === 'epic' ? 'bg-brand-purple/20 text-brand-purple border-brand-purple/50' :
                  item.rarity === 'rare' ? 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/50' :
                  'bg-gray-500/20 text-gray-300 border-gray-500/50'
                }`}>
                  {item.rarity}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-xs text-gray-400 capitalize mb-4">{item.type}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="font-mono font-bold text-[#FFD700] flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-[#FFD700] text-black flex items-center justify-center text-[10px]">C</span>
                    {item.price}
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBuy(item)}
                    className="bg-brand-purple hover:bg-brand-purple/80 text-white font-bold py-1.5 px-3 rounded text-sm transition-colors"
                  >
                    Buy
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )))}
        </div>
      </div>
    </div>
  );
}
