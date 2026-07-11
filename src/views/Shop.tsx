import React from 'react';
import { motion } from 'motion/react';
import { Store, Sparkles, Zap, Shield, Crown, Package, Globe, Star } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../types';
import { cn } from '../lib/utils';
import { useQuestManager } from '../lib/QuestManager';
import { api, ApiError } from '../lib/api';

type ItemType = 'FRAME' | 'THEME' | 'BOOST' | 'MATERIAL' | 'UPGRADE' | 'TITLE' | 'BLUEPRINT';
type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

interface Item {
  id: string;
  key: string;
  name: string;
  type: ItemType;
  price: number;
  rarity: Rarity;
}

interface UserInventory {
  id: string;
  userId: string;
  itemId: string;
  acquiredAt: string;
  item: Item;
}

interface PurchaseResult {
  inventory: UserInventory;
  user: User;
}

const rarityLabels: Record<Rarity, string> = {
  COMMON: 'Oddiy',
  RARE: 'Kamyob',
  EPIC: 'Epik',
  LEGENDARY: 'Afsonaviy',
};

const typeLabels: Record<ItemType, string> = {
  FRAME: 'Ramka',
  THEME: 'Mavzu',
  BOOST: 'Kuchaytirgich',
  MATERIAL: 'Material',
  UPGRADE: 'Yangilanish',
  TITLE: 'Unvon',
  BLUEPRINT: 'Chizma',
};

const typeIconColor: Record<ItemType, string> = {
  FRAME: 'brand-cyan',
  THEME: 'brand-purple',
  BOOST: 'brand-green',
  MATERIAL: 'brand-orange',
  UPGRADE: 'brand-purple',
  TITLE: 'brand-orange',
  BLUEPRINT: 'brand-cyan',
};

const categories: { id: string; name: string; icon: typeof Crown; type: ItemType }[] = [
  { id: 'avatars', name: 'Avatarlar va Ramkalar', icon: Crown, type: 'FRAME' },
  { id: 'blueprints', name: 'Arxitektor Chizmalari', icon: Globe, type: 'BLUEPRINT' },
  { id: 'themes', name: 'Muharrir Mavzulari', icon: Sparkles, type: 'THEME' },
  { id: 'materials', name: 'Shahar Materiallari', icon: Package, type: 'MATERIAL' },
  { id: 'boosts', name: 'Kuchaytirgichlar', icon: Zap, type: 'BOOST' },
  { id: 'upgrades', name: 'Shahar Yangilanishlari', icon: Shield, type: 'UPGRADE' },
  { id: 'titles', name: "O'yinchi Unvonlari", icon: Star, type: 'TITLE' },
];

export function Shop({ user }: { user: User }) {
  const { universalCoins, addXp } = useQuestManager();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['shop', 'items'],
    queryFn: () => api.get<Item[]>('/shop/items'),
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ['shop', 'inventory'],
    queryFn: () => api.get<UserInventory[]>('/shop/inventory'),
  });

  const purchaseMutation = useMutation({
    mutationFn: (itemId: string) => api.post<PurchaseResult>('/shop/purchase', { itemId }),
    onSuccess: ({ user: updatedUser }) => {
      queryClient.invalidateQueries({ queryKey: ['shop', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['shop', 'items'] });
      queryClient.setQueryData(['auth', 'me'], updatedUser);
    },
  });

  const isOwned = (itemId: string) => inventory.some((inv) => inv.itemId === itemId);

  const handleBuy = async (item: Item) => {
    try {
      await purchaseMutation.mutateAsync(item.id);
      addXp(50, `Purchased ${item.name}`);
      alert(`Sintez yakunlandi: ${item.name} qo'lga kiritildi.`);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        throw err;
      }
    }
  };

  const [activeCategory, setActiveCategory] = React.useState('avatars');

  const activeType = categories.find((c) => c.id === activeCategory)?.type;
  const visibleItems = items.filter((item) => item.type === activeType);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <Store className="text-brand-purple" size={32} />
            Buyumlar Do'koni
          </h1>
          <p className="text-gray-400">Halol topgan tangalaringizni maxsus bezaklar va kuchaytirgichlarga sarflang.</p>
        </div>

        <div className="bg-black/40 border border-[#FFD700]/30 px-6 py-3 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] flex items-center justify-center font-bold text-black text-sm">
            C
          </div>
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Balansingiz</div>
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
            </motion.button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {itemsLoading && <p className="text-sm text-gray-500 col-span-full">Mahsulotlar yuklanmoqda...</p>}
          {!itemsLoading && visibleItems.length === 0 && (
            <p className="text-sm text-gray-500 col-span-full">Bu toifada hozircha mahsulot yo'q.</p>
          )}

          {activeCategory === 'blueprints' ? (
            visibleItems.map((item, i) => {
              const owned = isOwned(item.id);
              return (
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
                        item.rarity === 'LEGENDARY' ? "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30" : "bg-brand-purple/10 text-brand-purple border-brand-purple/30"
                      )}>
                        {rarityLabels[item.rarity]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 italic">{typeLabels[item.type]}</p>
                    <div className="mt-auto flex items-center justify-between">
                      {owned ? (
                        <span className="font-mono font-bold text-brand-green text-xs uppercase tracking-widest">Sizda bor</span>
                      ) : (
                        <div className="font-mono font-bold text-[#FFD700] flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-[#FFD700] text-black flex items-center justify-center text-[10px]">C</span>
                          {item.price.toLocaleString()}
                        </div>
                      )}
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={owned || purchaseMutation.isPending}
                        className="px-4 py-2 bg-brand-cyan hover:bg-brand-cyan/80 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all text-xs"
                      >
                        {owned ? "Egallangan" : 'Olish'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            visibleItems.map((item, i) => {
              const owned = isOwned(item.id);
              const color = typeIconColor[item.type];
              return (
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
                  <div className={`relative z-10 w-16 h-16 rounded-lg flex items-center justify-center text-3xl font-bold bg-${color}/10 border border-${color}/30 text-${color}`}>
                    {item.type === 'THEME' ? <Sparkles /> : item.type === 'BOOST' || item.type === 'UPGRADE' ? <Zap /> : item.type === 'TITLE' ? 'T' : item.type === 'MATERIAL' ? <Package /> : <Crown />}
                  </div>

                  <div className={`absolute top-2 right-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    item.rarity === 'LEGENDARY' ? 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/50' :
                    item.rarity === 'EPIC' ? 'bg-brand-purple/20 text-brand-purple border-brand-purple/50' :
                    item.rarity === 'RARE' ? 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/50' :
                    'bg-gray-500/20 text-gray-300 border-gray-500/50'
                  }`}>
                    {rarityLabels[item.rarity]}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-400 capitalize mb-4">{typeLabels[item.type]}</p>

                  <div className="mt-auto flex items-center justify-between">
                    {owned ? (
                      <span className="font-mono font-bold text-brand-green text-xs uppercase tracking-widest">Sizda bor</span>
                    ) : (
                      <div className="font-mono font-bold text-[#FFD700] flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-[#FFD700] text-black flex items-center justify-center text-[10px]">C</span>
                        {item.price}
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: owned ? 1 : 1.05 }}
                      whileTap={{ scale: owned ? 1 : 0.95 }}
                      onClick={() => handleBuy(item)}
                      disabled={owned || purchaseMutation.isPending}
                      className="bg-brand-purple hover:bg-brand-purple/80 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-1.5 px-3 rounded text-sm transition-colors"
                    >
                      {owned ? "Egallangan" : 'Sotib olish'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
}
