import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, BarChart2, Calendar, CheckSquare, TrendingUp, Bot, Sparkles } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsMaisDrawerOpen,
    setIsAiChatOpen
  } = useApp();

  const navItems = [
    {
      id: 'inicio' as const,
      label: 'Início',
      icon: <Home className="w-5 h-5" />,
      onClick: () => setActiveTab('inicio')
    },
    {
      id: 'mapa' as const,
      label: 'Meu Mapa',
      icon: <BarChart2 className="w-5 h-5" />,
      onClick: () => setActiveTab('mapa')
    },
    {
      id: 'agenda' as const,
      label: 'Agenda',
      icon: <Calendar className="w-5 h-5" />,
      onClick: () => setActiveTab('agenda')
    },
    {
      id: 'rotinas' as const,
      label: 'Rotinas',
      icon: <CheckSquare className="w-5 h-5" />,
      onClick: () => setActiveTab('rotinas')
    },
    {
      id: 'relatorios' as const,
      label: 'Relatórios',
      icon: <TrendingUp className="w-5 h-5" />,
      onClick: () => setActiveTab('relatorios')
    }
  ];

  return (
    <>
      {/* Floating AI Assistant button */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="flex items-center gap-2 bg-[#FAF8F5] hover:bg-[#F2ECE0] text-[#5C4F44] border border-[#E4DACD] px-3.5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(140,122,107,0.18)] transition-all active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B]"
          aria-label="Conversar com a Assistente IA"
        >
          <div className="w-6 h-6 rounded-full bg-[#EFE8DE] flex items-center justify-center text-[#8C7A6B] group-hover:scale-110 transition-transform">
            <Bot className="w-4 h-4 text-[#8C7A6B]" />
          </div>
          <span className="text-xs font-bold text-[#2C2C2C] pr-1 flex items-center gap-1">
            <span>Assistente IA</span>
            <Sparkles className="w-3 h-3 text-[#B78A58]" />
          </span>
        </button>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Navegação Principal"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-md border-t border-[#EFE8DE] shadow-[0_-2px_12px_rgba(140,122,107,0.06)]"
      >
        <div className="max-w-xl mx-auto px-2 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`flex-1 py-1 px-1 flex flex-col items-center justify-center relative transition-colors focus:outline-none ${
                  isActive ? 'text-[#2C2C2C]' : 'text-[#8C7A6B] hover:text-[#5C4F44]'
                }`}
                aria-label={item.label}
              >
                <div className="relative p-1">
                  {item.icon}
                </div>
                <span
                  className={`text-[11px] tracking-tight mt-0.5 ${
                    isActive ? 'font-extrabold text-[#2C2C2C]' : 'font-medium text-[#8C7A6B]'
                  }`}
                >
                  {item.label}
                </span>

                {/* Underline indicator for active item */}
                {isActive && (
                  <span className="w-6 h-0.5 bg-[#8C7A6B] rounded-full mt-1 animate-in fade-in duration-200" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
