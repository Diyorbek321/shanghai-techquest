import React, { createContext, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { audioManager } from './audio';
import { api, ApiError } from './api';
import { useAuth } from './AuthContext';
import { User } from '../types';

interface QuestManagerContextType {
  universalXp: number;
  universalCoins: number;
  addXp: (amount: number, source: string) => void;
  addCoins: (amount: number, source: string) => void;
  deductCoins: (amount: number) => Promise<boolean>;
}

const QuestManagerContext = createContext<QuestManagerContextType>({
  universalXp: 0,
  universalCoins: 0,
  addXp: () => {},
  addCoins: () => {},
  deductCoins: async () => false,
});

export function QuestManagerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const rewardMutation = useMutation({
    mutationFn: (params: { xp?: number; coins?: number }) => api.post<User>('/users/me/reward', params),
    onSuccess: (updatedUser) => queryClient.setQueryData(['auth', 'me'], updatedUser),
  });

  const spendMutation = useMutation({
    mutationFn: (coins: number) => api.post<User>('/users/me/spend', { coins }),
    onSuccess: (updatedUser) => queryClient.setQueryData(['auth', 'me'], updatedUser),
  });

  const addXp = (amount: number) => {
    rewardMutation.mutate({ xp: amount });
    audioManager.playLevelUp();
  };

  const addCoins = (amount: number) => {
    rewardMutation.mutate({ coins: amount });
  };

  const deductCoins = async (amount: number): Promise<boolean> => {
    try {
      await spendMutation.mutateAsync(amount);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) return false;
      throw err;
    }
  };

  return (
    <QuestManagerContext.Provider
      value={{
        universalXp: user?.xp ?? 0,
        universalCoins: user?.coins ?? 0,
        addXp,
        addCoins,
        deductCoins,
      }}
    >
      {children}
    </QuestManagerContext.Provider>
  );
}

export const useQuestManager = () => useContext(QuestManagerContext);
