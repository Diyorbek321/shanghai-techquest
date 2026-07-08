import React, { createContext, useContext, useState, useEffect } from 'react';
import { audioManager } from './audio';

interface QuestManagerContextType {
  universalXp: number;
  universalCoins: number;
  addXp: (amount: number, source: string) => void;
  addCoins: (amount: number, source: string) => void;
  deductCoins: (amount: number) => boolean;
  unlockedChapters: string[];
  unlockChapter: (chapterId: string) => void;
  quests: any[];
}

const QuestManagerContext = createContext<QuestManagerContextType>({
  universalXp: 0,
  universalCoins: 0,
  addXp: () => {},
  addCoins: () => {},
  deductCoins: () => false,
  unlockedChapters: [],
  unlockChapter: () => {},
  quests: [],
});

export function QuestManagerProvider({ children }: { children: React.ReactNode }) {
  const [universalXp, setUniversalXp] = useState(2450);
  const [universalCoins, setUniversalCoins] = useState(1500);
  const [unlockedChapters, setUnlockedChapters] = useState(['chapter_1', 'chapter_2']);
  const [quests, setQuests] = useState([
    { id: 'q1', title: 'First Steps', completed: true, xpReward: 500 },
    { id: 'q2', title: 'Enter the Arena', completed: false, xpReward: 1000 },
  ]);

  const addXp = (amount: number, source: string) => {
    setUniversalXp(prev => prev + amount);
    audioManager.playLevelUp();
    console.log(`Earned ${amount} XP from ${source}!`);
  };

  const addCoins = (amount: number, source: string) => {
    setUniversalCoins(prev => prev + amount);
    console.log(`Earned ${amount} Coins from ${source}!`);
  };

  const deductCoins = (amount: number) => {
    if (universalCoins >= amount) {
      setUniversalCoins(prev => prev - amount);
      return true;
    }
    return false;
  };

  const unlockChapter = (chapterId: string) => {
    setUnlockedChapters(prev => [...prev, chapterId]);
    audioManager.playNotification();
  };

  return (
    <QuestManagerContext.Provider value={{ 
      universalXp, 
      universalCoins, 
      addXp, 
      addCoins, 
      deductCoins, 
      unlockedChapters, 
      unlockChapter, 
      quests 
    }}>
      {children}
    </QuestManagerContext.Provider>
  );
}

export const useQuestManager = () => useContext(QuestManagerContext);
