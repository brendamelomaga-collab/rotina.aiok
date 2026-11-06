import React from 'react';
import { useApp } from '../../context/AppContext';
import { AgendaItem } from '../../types';
import { ChevronLeft, Plus, Calendar, Bell, ChevronRight } from 'lucide-react';

export const AgendaView: React.FC = () => {
  const { setActiveTab, agendaItems, setIsAgendaModalOpen } = useApp();

  const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const calendarDays = [
    { day: 1, active: false },
    { day: 2, active: false },
    { day: 3, active: false },
    { day: 4, active: false },
    { day: 5, active: false },
    { day: 6, active: false },
    { day: 7, active: false },
    { day: 8, active: false },
    { day: 9, active: false },
    { day: 10, active: false },
    { day: 11, active: false },
    { day: 12, active: false },
    { day: 13, active: false },
    { day: 14, active: false },
    { day: 15, active: false },
    { day: 16, active: true }, // Current selected day (Hoje)
    { day: 17, active: false },
    { day: 18, active: false },
    { day: 19, active: false },
    { day: 20, active: false },
    { day: 21, active: false },
    { day: 22, active: false },
    { day: 23, active: false },
    { day: 24, active: false },
    { day: 25, active: false },
    { day: 26, active: false },
    { day: 27, active: false },
    { day: 28, active: false },
    { day: 29, active: false },
    { day: 30, active: false }
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-2 pb-24 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 mb-4">
        <button
          onClick={() => setActiveTab('inicio')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#8C7A6B] hover:text-[#5C4F44] bg-[#F4EDE2] px-3 py-1.5 rounded-full"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </button>
        <h1 className="text-lg font-bold text-[#2C2C2C]">Minha Agenda</h1>
        <button
          onClick={() => setIsAgendaModalOpen(true)}
          className="w-8 h-8 rounded-full bg-[#8C7A6B] text-white flex items-center justify-center shadow-xs"
          title="Novo evento"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Card */}
      <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl p-5 shadow-[0_4px_20px_rgba(140,122,107,0.05)] mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#2C2C2C]">Novembro 2026</h2>
          <span className="text-xs text-[#8C7A6B] bg-[#F4EDE2] px-2.5 py-1 rounded-full font-semibold">
            Hoje: Dia 16
          </span>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center mb-2">
          {daysOfWeek.map((d, i) => (
            <span key={i} className="text-xs font-bold text-[#8C7A6B]">
              {d}
            </span>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((cd) => (
            <div
              key={cd.day}
              className={`h-9 flex items-center justify-center rounded-xl text-xs font-semibold ${
                cd.active
                  ? 'bg-[#8C7A6B] text-white shadow-xs font-bold'
                  : 'text-[#4A3E34] hover:bg-[#F4EDE2]'
              }`}
            >
              {cd.day}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming events list */}
      <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl p-5 shadow-[0_4px_20px_rgba(140,122,107,0.05)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#2C2C2C]">Próximos compromissos</h3>
          <button
            onClick={() => setIsAgendaModalOpen(true)}
            className="text-xs text-[#8C7A6B] hover:text-[#2C2C2C] font-semibold"
          >
            Adicionar +
          </button>
        </div>

        <div className="space-y-3">
          {agendaItems.map((item: AgendaItem) => (
            <div
              key={item.id}
              className="p-3 bg-[#F7F4EE] border border-[#EAE3D6] rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-[#2C2C2C]">{item.title}</h4>
                  <p className="text-[11px] text-[#8C7A6B]">
                    {item.displayDay} • {item.time}
                  </p>
                </div>
              </div>
              {item.isRecurring && (
                <span className="text-[10px] font-semibold text-[#6E5D4F] bg-[#EFE8DE] px-2.5 py-1 rounded-full">
                  Recorrente
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Reminder alert note */}
        <div className="mt-4 p-3 bg-[#F7F1E6] rounded-2xl flex items-center gap-2.5 text-xs text-[#5C4F44]">
          <Bell className="w-4 h-4 text-[#8C7A6B] shrink-0" />
          <span>Lembretes ativados: Você receberá notificações no horário marcado.</span>
        </div>
      </div>
    </div>
  );
};
