import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgendaItem } from '../../types';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
  Clock,
  Bell,
  Check,
  CheckCircle2,
  Trash2,
  Sparkles,
  MapPin,
  Repeat,
  X
} from 'lucide-react';
import { formatBrazilianDate } from '../../utils/routineCalculations';

export const AgendaView: React.FC = () => {
  const {
    setActiveTab,
    agendaItems,
    addAgendaItem,
    toggleAgendaItem,
    deleteAgendaItem,
    selectedDate,
    setSelectedDate
  } = useApp();

  // Strict 100% vertical collapsible accordion state (no horizontal tabs)
  const [openSections, setOpenSections] = useState<{
    calendario: boolean;
    compromissos: boolean;
    lembretes: boolean;
  }>({
    calendario: true,
    compromissos: true,
    lembretes: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // State for active calendar day selection in view
  const [activeDayNum, setActiveDayNum] = useState<number>(16); // Day 16 = Hoje (Novembro 2026)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new event
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-11-17');
  const [newDayLabel, setNewDayLabel] = useState('Terça-feira');
  const [newTime, setNewTime] = useState('17:00');
  const [newCategory, setNewCategory] = useState<'familia' | 'esporte' | 'pessoal' | 'saude' | 'trabalho'>('familia');
  const [newIcon, setNewIcon] = useState('⚽');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceLabel, setRecurrenceLabel] = useState('Semanalmente');
  const [reminderMinutes, setReminderMinutes] = useState<number>(15);
  const [hasVisualNotification, setHasVisualNotification] = useState<boolean>(true);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Days with registered events in November 2026 for indicator dots
  const eventDays = [17, 20, 22, 24];

  const calendarDays = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    hasEvent: eventDays.includes(i + 1)
  }));

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAgendaItem({
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      displayDay: newDayLabel,
      isRecurring,
      recurrenceLabel: isRecurring ? recurrenceLabel : undefined,
      category: newCategory,
      icon: newIcon,
      reminderMinutes,
      hasVisualNotification
    });

    setToastNotification(`Compromisso "${newTitle.trim()}" agendado com lembrete ativado!`);
    setTimeout(() => setToastNotification(null), 3000);

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const handleTriggerTestReminder = (item: AgendaItem) => {
    setToastNotification(`🔔 Notificação de Alerta: "${item.title}" está agendado para ${item.displayDay} às ${item.time}!`);
    setTimeout(() => setToastNotification(null), 4000);
  };

  const icons = ['⚽', '🎂', '💅', '🩺', '📚', '🎒', '🛒', '🚗', '🌿', '🏥'];

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-2 pb-32 select-none relative">
      {/* Visual Toast Notification Banner */}
      {toastNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-[#2C2C2C] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#C58B68] shrink-0" />
            <span className="font-semibold">{toastNotification}</span>
          </div>
          <button onClick={() => setToastNotification(null)} className="text-white/70 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between py-2 mb-3">
        <button
          onClick={() => setActiveTab('inicio')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#8C7A6B] hover:text-[#5C4F44] bg-[#F4EDE2] hover:bg-[#EAE0D2] px-3.5 py-1.5 rounded-full transition-colors"
          aria-label="Voltar ao início"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Início</span>
        </button>

        <div className="text-center">
          <h1 className="text-lg font-bold text-[#2C2C2C] tracking-tight">Minha Agenda</h1>
          <p className="text-[11px] text-[#8C7A6B]">Compromissos & Calendário Familiar</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-9 h-9 rounded-full bg-[#8C7A6B] hover:bg-[#786657] text-white flex items-center justify-center shadow-xs transition-colors"
          title="Adicionar novo compromisso"
          aria-label="Adicionar compromisso"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* STRICTLY VERTICAL ACCORDION STRUCTURE (NO HORIZONTAL TABS) */}
      <div className="space-y-4">
        {/* ========================================================
            ACORDEÃO 1: CALENDÁRIO & SELETOR DE DATAS
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('calendario')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.calendario}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-lg text-[#B78A58]">
                <Calendar className="w-5 h-5 text-[#B78A58]" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C] flex items-center gap-2">
                  <span>1. Calendário & Seletor de Datas</span>
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Novembro de 2026 • Visualização interativa
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8C7A6B] bg-[#F4EDE2] px-2.5 py-1 rounded-full">
                Dia {activeDayNum}
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                {openSections.calendario ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {openSections.calendario && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-[#2C2C2C] flex items-center gap-1.5">
                  <span>Novembro 2026</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveDayNum(16)}
                  className="text-[11px] font-bold text-[#5C4F44] bg-[#EAE0D2] hover:bg-[#E4DACD] px-2.5 py-1 rounded-full transition-colors"
                >
                  Ir para Hoje (Dia 16)
                </button>
              </div>

              {/* Days of week header */}
              <div className="grid grid-cols-7 text-center mb-1">
                {daysOfWeek.map((d, i) => (
                  <span key={i} className="text-xs font-bold text-[#8C7A6B]">
                    {d}
                  </span>
                ))}
              </div>

              {/* Calendar days grid (dias 1 a 30) */}
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {calendarDays.map((cd) => {
                  const isSelected = activeDayNum === cd.day;
                  const isToday = cd.day === 16;
                  return (
                    <button
                      key={cd.day}
                      type="button"
                      onClick={() => setActiveDayNum(cd.day)}
                      className={`h-10 flex flex-col items-center justify-center rounded-2xl text-xs font-semibold transition-all relative ${
                        isSelected
                          ? 'bg-[#8C7A6B] text-white shadow-xs font-bold scale-105'
                          : isToday
                          ? 'bg-[#EAE0D2] text-[#2C2C2C] font-bold border border-[#D8C7B4]'
                          : 'text-[#4A3E34] hover:bg-[#F4EDE2] bg-white border border-[#EFE8DE]'
                      }`}
                    >
                      <span>{cd.day}</span>
                      {cd.hasEvent && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                            isSelected ? 'bg-white' : 'bg-[#B78A58]'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#8C7A6B] pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B78A58]" />
                  <span>Pontinho indica dia com compromisso</span>
                </span>
                <span className="font-medium">
                  {agendaItems.length} compromissos agendados
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            ACORDEÃO 2: PRÓXIMOS COMPROMISSOS
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('compromissos')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.compromissos}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-lg text-[#B78A58]">
                📅
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  2. Próximos Compromissos
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Futebol das crianças, aniversários, consultas e eventos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8C7A6B]">
                {agendaItems.filter((i) => !i.completed).length} pendentes
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                {openSections.compromissos ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {openSections.compromissos && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-[#4A3E34]">
                  Lista de eventos da família:
                </span>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-xs font-bold text-[#8C7A6B] hover:text-[#5C4F44] flex items-center gap-1 bg-[#F4EDE2] px-2.5 py-1 rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Compromisso</span>
                </button>
              </div>

              {agendaItems.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8C7A6B] bg-white rounded-2xl border border-[#EFE8DE]">
                  Nenhum compromisso cadastrado. Toque no botão acima para adicionar.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {agendaItems.map((item: AgendaItem) => {
                    const isDone = item.completed;
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all shadow-2xs ${
                          isDone
                            ? 'bg-[#F2ECE2] border-[#DDD3C5] opacity-75'
                            : 'bg-white border-[#EFE8DE] hover:bg-[#FDFBF7]'
                        }`}
                      >
                        <div
                          onClick={() => toggleAgendaItem(item.id)}
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                        >
                          <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#EAE0D2] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                            {item.icon || '⚽'}
                          </div>
                          <div className="min-w-0">
                            <h4
                              className={`text-xs sm:text-sm font-bold truncate ${
                                isDone ? 'line-through text-[#8C7A6B]' : 'text-[#2C2C2C]'
                              }`}
                            >
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-[#8C7A6B] flex items-center gap-1.5 mt-0.5 truncate">
                              <span>{item.displayDay}</span>
                              <span>•</span>
                              <Clock className="w-3 h-3 shrink-0" />
                              <span>{item.time}h</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.isRecurring && (
                            <span className="text-[10px] font-semibold text-[#6E5D4F] bg-[#EFE8DE] px-2.5 py-1 rounded-full border border-[#E2D8CA] flex items-center gap-1">
                              <Repeat className="w-3 h-3 text-[#8C7A6B]" />
                              <span>Recorrente</span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleTriggerTestReminder(item)}
                            className="p-1.5 text-[#8C7A6B] hover:text-[#5C4F44] hover:bg-[#F4EDE2] rounded-xl transition-colors"
                            title="Disparar lembrete visual"
                            aria-label={`Testar lembrete de ${item.title}`}
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleAgendaItem(item.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                              isDone
                                ? 'bg-[#7D9D7F] text-white'
                                : 'bg-[#EAE0D2] text-[#5C4F44] hover:bg-[#E4DACD]'
                            }`}
                          >
                            {isDone ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Realizado</span>
                              </>
                            ) : (
                              <span>Concluir</span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteAgendaItem(item.id)}
                            className="p-1.5 text-[#B4A597] hover:text-[#8C3A24] rounded-lg hover:bg-[#FDF2EE] transition-colors"
                            title="Excluir compromisso"
                            aria-label={`Excluir compromisso ${item.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================
            ACORDEÃO 3: LEMBRETES & NOTIFICAÇÕES ATIVADAS
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('lembretes')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.lembretes}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-lg text-[#B78A58]">
                🔔
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  3. Lembretes & Notificações Ativadas
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Alertas com antecedência e notificações sonoras suaves
                </p>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
              {openSections.lembretes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {openSections.lembretes && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-3">
              <div className="bg-[#F7F1E6] p-3.5 rounded-2xl border border-[#EAE1D1] flex items-start gap-2.5 text-xs text-[#5C4F44]">
                <Bell className="w-4 h-4 text-[#8C7A6B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#4A3E34]">
                    Lembretes visuais ativados
                  </p>
                  <p className="text-[11px] text-[#6E5D4F] mt-0.5 leading-relaxed">
                    Você receberá alertas antes de cada compromisso (15 min antes por padrão) para que você e sua família não se esqueçam de nada importante.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#8C7A6B] block">
                  Alertas configurados:
                </span>
                <div className="bg-white border border-[#EFE8DE] rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7D9D7F]" />
                    <span className="font-semibold text-[#2C2C2C]">Futebol das crianças (⚽)</span>
                  </div>
                  <span className="text-[10px] text-[#8C7A6B] bg-[#F4EDE2] px-2 py-0.5 rounded-lg">
                    15 min antes
                  </span>
                </div>
                <div className="bg-white border border-[#EFE8DE] rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7D9D7F]" />
                    <span className="font-semibold text-[#2C2C2C]">Aniversário da vovó (🎂)</span>
                  </div>
                  <span className="text-[10px] text-[#8C7A6B] bg-[#F4EDE2] px-2 py-0.5 rounded-lg">
                    1 dia antes
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (+) */}
      <div className="fixed bottom-20 left-4 sm:left-6 z-40">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#8C7A6B] hover:bg-[#786657] text-white px-4 py-2.5 rounded-full shadow-[0_4px_16px_rgba(140,122,107,0.25)] transition-all active:scale-95 group focus:outline-none"
          aria-label="Adicionar compromisso na agenda"
        >
          <Plus className="w-4 h-4 text-white" />
          <span className="text-xs font-bold">Novo Evento</span>
        </button>
      </div>

      {/* Modal: Novo Evento / Compromisso */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-5 shadow-2xl border border-[#EFE8DE] space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F4EDE2] flex items-center justify-center text-[#B78A58]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2C2C2C]">Novo Compromisso</h3>
                  <p className="text-[11px] text-[#8C7A6B]">Defina data, horário e lembretes</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#5C4F44]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                  Título do compromisso:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Futebol das crianças, Consulta médica, Natação..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Dia da semana:
                  </label>
                  <input
                    type="text"
                    value={newDayLabel}
                    onChange={(e) => setNewDayLabel(e.target.value)}
                    placeholder="Ex: Terça-feira"
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#2C2C2C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Horário:
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-2.5 py-2 text-xs font-bold text-[#2C2C2C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                  Ícone representativo:
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {icons.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewIcon(ic)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform ${
                        newIcon === ic ? 'bg-[#8C7A6B] text-white scale-110 shadow-xs' : 'bg-[#F4EDE2] hover:bg-[#EAE0D2]'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Categoria:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#2C2C2C] focus:outline-none"
                  >
                    <option value="familia">Família</option>
                    <option value="esporte">Esporte</option>
                    <option value="saude">Saúde</option>
                    <option value="pessoal">Pessoal</option>
                    <option value="trabalho">Trabalho</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Lembrete prévio:
                  </label>
                  <select
                    value={reminderMinutes}
                    onChange={(e) => setReminderMinutes(Number(e.target.value))}
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#2C2C2C] focus:outline-none"
                  >
                    <option value={15}>15 minutos antes</option>
                    <option value={30}>30 minutos antes</option>
                    <option value={60}>1 hora antes</option>
                    <option value={1440}>1 dia antes</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EFE8DE] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded border-[#C4B6A6] text-[#8C7A6B] focus:ring-[#8C7A6B]"
                  />
                  <span className="text-xs font-medium text-[#4A3E34]">
                    Compromisso recorrente
                  </span>
                </label>

                {isRecurring && (
                  <input
                    type="text"
                    value={recurrenceLabel}
                    onChange={(e) => setRecurrenceLabel(e.target.value)}
                    placeholder="Ex: Terça e Quinta • Semanalmente"
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-1.5 text-xs text-[#2C2C2C] focus:outline-none"
                  />
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8C7A6B] hover:bg-[#786657] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Salvar Compromisso
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-[#F4EDE2] hover:bg-[#EAE0D2] text-[#5C4F44] text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
