/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MeuMapaCard } from './components/MeuMapaCard';
import { AgendaCard } from './components/AgendaCard';
import { RotinasCard } from './components/RotinasCard';
import { CuidadosMetasCards } from './components/CuidadosMetasCards';
import { BottomNav } from './components/BottomNav';
import { MaisDrawer } from './components/MaisDrawer';
import { AiAssistantModal } from './components/AiAssistantModal';
import { MoodModal } from './components/MoodModal';
import { RoutineModal } from './components/RoutineModal';
import { AgendaModal } from './components/AgendaModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';
import { ManageQuestionsModal } from './components/ManageQuestionsModal';
import { RelatoriosModal } from './components/RelatoriosModal';
import { MeuMapaView } from './components/views/MeuMapaView';
import { AgendaView } from './components/views/AgendaView';
import { RotinasView } from './components/views/RotinasView';
import { RelatoriosView } from './components/views/RelatoriosView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2C2C] flex flex-col justify-between selection:bg-[#EAE0D2]">
      {/* Dynamic Screen Routing based on active bottom navigation tab */}
      <main className="flex-1 w-full max-w-xl mx-auto pb-32 sm:pb-36">
        {activeTab === 'inicio' && (
          <div className="animate-in fade-in duration-200">
            <Header />
            <MeuMapaCard />
            <AgendaCard />
            <RotinasCard />
            <CuidadosMetasCards />
          </div>
        )}

        {activeTab === 'mapa' && <MeuMapaView />}
        {activeTab === 'agenda' && <AgendaView />}
        {activeTab === 'rotinas' && <RotinasView />}
        {activeTab === 'relatorios' && <RelatoriosView />}
      </main>

      {/* Fixed bottom navigation */}
      <BottomNav />

      {/* Global Interactive Modals and Drawers */}
      <MaisDrawer />
      <AiAssistantModal />
      <MoodModal />
      <RoutineModal />
      <AgendaModal />
      <NotificationsModal />
      <AuthModal />
      <ManageQuestionsModal />
      <RelatoriosModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
