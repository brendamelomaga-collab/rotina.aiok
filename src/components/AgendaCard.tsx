import React from 'react';
import { useApp } from '../context/AppContext';
import { CalendarCheck, ChevronRight, Plus } from 'lucide-react';

export const AgendaCard: React.FC = () => {
  const { agendaItems, setIsAgendaModalOpen, setActiveTab } = useApp();

  const nextItem = agendaItems[0] || {
    id: 'placeholder',
    title: 'Futebol das crianças',
    displayDay: 'Terça-feira',
    time: '17:00',
    isRecurring: true,
    recurrenceLabel: 'Recorrente',
    icon: '⚽'
  };

  return (
    <section className="w-full max-w-xl mx-auto px-4 sm:px-6 my-3.5 select-none">
      <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl p-5 shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all hover:shadow-[0_6px_24px_rgba(140,122,107,0.08)]">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4EDE2] flex items-center justify-center text-[#B78A58]">
              <CalendarCheck className="w-5 h-5 text-[#B78A58]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#2C2C2C] tracking-tight">
                Minha Agenda
              </h2>
              <p className="text-xs text-[#8C7A6B]">Próximos compromissos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAgendaModalOpen(true)}
              className="w-7 h-7 rounded-full bg-[#EFE8DE] hover:bg-[#E4DACD] flex items-center justify-center text-[#5C4F44] transition-colors"
              aria-label="Adicionar compromisso"
              title="Adicionar compromisso"
            >
              <Plus className="w-3.5 h-3.5 text-[#5C4F44]" />
            </button>
            <button
              onClick={() => setActiveTab('agenda')}
              className="w-8 h-8 rounded-full bg-[#F4EDE2] hover:bg-[#EAE0D2] flex items-center justify-center text-[#8C7A6B] transition-colors"
              aria-label="Abrir agenda completa"
            >
              <ChevronRight className="w-4 h-4 text-[#8C7A6B]" />
            </button>
          </div>
        </div>

        {/* Appointment Row */}
        <div
          onClick={() => setIsAgendaModalOpen(true)}
          className="flex items-center justify-between p-3.5 bg-[#F7F4EE] hover:bg-[#F3EDE2] border border-[#EAE3D6] rounded-2xl cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E2D8CA] flex items-center justify-center text-xl shadow-xs">
              {nextItem.icon || '⚽'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2C2C2C] leading-tight">
                {nextItem.title}
              </h3>
              <p className="text-xs text-[#8C7A6B] mt-0.5 font-medium">
                {nextItem.displayDay} • {nextItem.time ? `${nextItem.time}h` : '17h'}
              </p>
            </div>
          </div>

          {nextItem.isRecurring && (
            <span className="text-[11px] font-semibold text-[#6E5D4F] bg-[#EFE8DE] px-3 py-1 rounded-full border border-[#E2D8CA]">
              {nextItem.recurrenceLabel || 'Recorrente'}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
