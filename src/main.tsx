import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { QuestManagerProvider } from './lib/QuestManager.tsx';
import { AuthProvider } from './lib/AuthContext.tsx';
import { AuthGate } from './AuthGate.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <QuestManagerProvider>
          <AuthGate />
        </QuestManagerProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
