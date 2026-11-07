import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoutineTask, PeriodKey } from '../../types';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Clock,
  Bell,
  Calendar,
  X
} from 'lucide-react';

export const RotinasView: React.FC = () => {
  const {
    setActiveTab,
    routineTasks,
    toggleRoutineTask,
    addRoutineTask,
    contextualReminders,
    dismissContextualReminder
  } = useApp();

  // Strict vertical collapsible accordion state (no horizontal tabs)
  const [openSections, setOpenSections] = useState<{
    semanal: boolean;
    periodos: boolean;
    lembretes: boolean;
  }>({
    semanal: true,
    periodos: true,
    lembretes: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Active day selection for the weekly view (0 = Seg, 1 = Ter, 2 = Qua, 3 = Qui, 4 = Sex, 5 = Sáb, 6 = Dom)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Modal for adding a new routine task
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newPeriod, setNewPeriod] = useState<PeriodKey>('manha');
  const [newTime, setNewTime] = useState('08:00');
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Week days definition (Segunda a Domingo)
  const weekDays = [
    { index: 0, name: 'Segunda-feira', short: 'Seg', isToday: true },
    { index: 1, name: 'Terça-feira', short: 'Ter', isToday: false },
    { index: 2, name: 'Quarta-feira', short: 'Qua', isToday: false },
    { index: 3, name: 'Quinta-feira', short: 'Qui', isToday: false },
    { index: 4, name: 'Sexta-feira', short: 'Sex', isToday: false },
    { index: 5, name: 'Sábado', short: 'Sáb', isToday: false },
    { index: 6, name: 'Domingo', short: 'Dom', isToday: false }
  ];

  // Specific planned routine activities by day of week for the weekly overview
  const plannedWeeklyActivities: Record<number, { title: string; subtitle: string; period: string; time: string; completed: boolean }[]> = {
    0: [
      { title: 'Pente fino nas crianças antes da escola', subtitle: 'Higiene e cuidado preventivo', period: 'Manhã', time: '08:00', completed: true },
      { title: 'Suplemento infantil com frutas', subtitle: '1 dose de vitaminas', period: 'Manhã', time: '09:00', completed: false },
      { title: 'Esfoliação corporal durante o banho da noite', subtitle: 'Rotina de autocuidado', period: 'Noite', time: '20:15', completed: false }
    ],
    1: [
      { title: 'Pente fino nas crianças antes da escola', subtitle: 'Verificação rápida matinal', period: 'Manhã', time: '08:00', completed: false },
      { title: 'Lição de casa e leitura com Bryan', subtitle: 'Foco de 30 minutos', period: 'Tarde', time: '14:30', completed: false },
      { title: 'Banho relaxante e pijama', subtitle: 'Desacelerar antes de dormir', period: 'Noite', time: '19:45', completed: false }
    ],
    2: [
      { title: 'Suplemento infantil com frutas', subtitle: '1 dose matinal', period: 'Manhã', time: '09:00', completed: false },
      { title: 'Esfoliação corporal durante o banho da noite', subtitle: 'Cuidado da pele', period: 'Noite', time: '20:15', completed: false },
      { title: 'História e oração para dormir', subtitle: 'Conexão e sono tranquilo', period: 'Noite', time: '21:30', completed: false }
    ],
    3: [
      { title: 'Pente fino nas crianças antes da escola', subtitle: 'Rotina escolar', period: 'Manhã', time: '08:00', completed: false },
      { title: 'Almoço nutritivo sem telas', subtitle: 'Conexão familiar', period: 'Tarde', time: '12:30', completed: false },
      { title: 'Skincare noturno', subtitle: 'Limpeza e hidratação', period: 'Noite', time: '21:00', completed: false }
    ],
    4: [
      { title: 'Suplemento infantil com frutas', subtitle: 'Vitamina de sexta', period: 'Manhã', time: '09:00', completed: false },
      { title: 'Esfoliação corporal durante o banho da noite', subtitle: 'Fechamento da semana', period: 'Noite', time: '20:15', completed: false },
      { title: 'Noite da pizza ou jogo em família', subtitle: 'Descompressão semanal', period: 'Noite', time: '19:30', completed: false }
    ],
    5: [
      { title: 'Passeio ao ar livre com as crianças', subtitle: 'Parque ou praça', period: 'Manhã', time: '09:30', completed: false },
      { title: 'Organização geral dos brinquedos', subtitle: 'Manutenção do quarto', period: 'Tarde', time: '15:00', completed: false },
      { title: 'Cinema em família', subtitle: 'Momento de lazer compartilhado', period: 'Noite', time: '20:00', completed: false }
    ],
    6: [
      { title: 'Café da manhã especial de domingo', subtitle: 'Sem pressa', period: 'Manhã', time: '09:00', completed: false },
      { title: 'Hidratação profunda capilar', subtitle: 'Máscara nutritiva 20 min', period: 'Tarde', time: '16:00', completed: true },
      { title: 'Planejamento da semana escolar', subtitle: 'Mochilas e uniformes prontos', period: 'Noite', time: '20:30', completed: false }
    ]
  };

  const handleCreateRoutineTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addRoutineTask({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      period: newPeriod,
      time: newTime
    });

    setToastNotification(`Rotina "${newTitle.trim()}" adicionada com sucesso!`);
    setTimeout(() => setToastNotification(null), 3000);

    setNewTitle('');
    setNewSubtitle('');
    setIsAddModalOpen(false);
  };

  const triggerReminderNotification = (text: string) => {
    setToastNotification(`🔔 Lembrete Contextual: ${text}`);
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Filter tasks by period
  const manhaTasks = routineTasks.filter((t) => t.period === 'manha');
  const tardeTasks = routineTasks.filter((t) => t.period === 'tarde');
  const noiteTasks = routineTasks.filter((t) => t.period === 'noite');
  const especiaisTasks = routineTasks.filter((t) => t.period === 'especiais');

  const totalTasksCount = routineTasks.length;
  const completedTasksCount = routineTasks.filter((t) => t.completed).length;
  const routinePercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-2 pb-32 select-none relative">
      {/* Toast Notification Banner */}
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
          <h1 className="text-lg font-bold text-[#2C2C2C] tracking-tight">Minhas Rotinas</h1>
          <p className="text-[11px] text-[#8C7A6B]">O ritmo harmonioso do dia a dia</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-9 h-9 rounded-full bg-[#8C7A6B] hover:bg-[#786657] text-white flex items-center justify-center shadow-xs transition-colors"
          title="Nova Rotina"
          aria-label="Adicionar nova atividade à rotina"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Daily Progress Overview Card */}
      <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl p-4 sm:p-5 mb-4 shadow-[0_4px_20px_rgba(140,122,107,0.05)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#2C2C2C]">Progresso das Rotinas de Hoje</h2>
              <p className="text-[11px] text-[#8C7A6B]">Segunda-feira • {completedTasksCount} de {totalTasksCount} concluídas</p>
            </div>
          </div>
          <span className="text-sm font-extrabold text-[#8C7A6B]">{routinePercentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-[#EAE0D2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#8C7A6B] rounded-full transition-all duration-300"
            style={{ width: `${routinePercentage}%` }}
          />
        </div>
      </div>

      {/* STRICTLY VERTICAL ACCORDION STRUCTURE (NO HORIZONTAL TABS) */}
      <div className="space-y-4">
        {/* ========================================================
            ACORDEÃO 1: VISUALIZAÇÃO SEMANAL (SEGUNDA A DOMINGO)
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('semanal')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.semanal}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-lg text-[#B78A58]">
                <Calendar className="w-5 h-5 text-[#B78A58]" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  1. Visualização Semanal (Segunda a Domingo)
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Atividades planejadas e distribuídas por dia da semana
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8C7A6B] bg-[#F4EDE2] px-2.5 py-1 rounded-full">
                {weekDays[selectedDayIndex].short}
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                {openSections.semanal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {openSections.semanal && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-3">
              <p className="text-xs text-[#8C7A6B] leading-relaxed">
                Selecione um dia da semana para consultar as atividades recorrentes planejadas:
              </p>

              {/* Vertical Stack of Days (No horizontal pills!) */}
              <div className="space-y-2">
                {weekDays.map((day) => {
                  const isSelected = selectedDayIndex === day.index;
                  const dayActivities = plannedWeeklyActivities[day.index] || [];

                  return (
                    <div
                      key={day.index}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isSelected
                          ? 'bg-white border-[#8C7A6B] shadow-2xs'
                          : 'bg-[#FAF8F5] border-[#EFE8DE] hover:bg-[#F7F4EE]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedDayIndex(day.index)}
                        className="w-full p-3 flex items-center justify-between text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isSelected
                                ? 'bg-[#8C7A6B] text-white'
                                : day.isToday
                                ? 'bg-[#EAE0D2] text-[#4A3E34]'
                                : 'bg-[#F4EDE2] text-[#8C7A6B]'
                            }`}
                          >
                            {day.short[0]}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-[#2C2C2C] block">
                              {day.name}
                            </span>
                            <span className="text-[10px] text-[#8C7A6B]">
                              {dayActivities.length} atividades cadastradas
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {day.isToday && (
                            <span className="text-[10px] font-bold text-[#5C4F44] bg-[#EAE0D2] px-2 py-0.5 rounded-full">
                              Hoje
                            </span>
                          )}
                          <span className="text-xs text-[#8C7A6B] font-semibold">
                            {isSelected ? 'Ativo' : 'Ver'}
                          </span>
                        </div>
                      </button>

                      {/* Expanded day details */}
                      {isSelected && (
                        <div className="px-3.5 pb-3.5 pt-1 border-t border-[#EFE8DE]/70 bg-[#FDFBF7] space-y-2">
                          <span className="text-[11px] font-bold text-[#6E5D4F] block">
                            Atividades de {day.name}:
                          </span>

                          <div className="space-y-1.5">
                            {dayActivities.map((act, actIdx) => (
                              <div
                                key={actIdx}
                                className="p-2.5 bg-white border border-[#EFE8DE] rounded-xl flex items-center justify-between text-xs gap-2"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-5 h-5 rounded-md bg-[#F4EDE2] border border-[#DDD3C5] flex items-center justify-center text-[#8C7A6B] shrink-0">
                                    <Clock className="w-3 h-3" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-[#2C2C2C] truncate">{act.title}</p>
                                    <p className="text-[10px] text-[#8C7A6B] truncate">{act.subtitle}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] text-[#8C7A6B] bg-[#F4EDE2] px-2 py-0.5 rounded-md font-medium">
                                    {act.time}
                                  </span>
                                  <span className="text-[10px] font-semibold text-[#5C4F44] bg-[#EAE0D2] px-2 py-0.5 rounded-full">
                                    {act.period}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            ACORDEÃO 2: BLOCOS POR MOMENTO DO DIA (MANHÃ, TARDE, NOITE, ESPECIAIS)
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('periodos')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.periodos}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-lg text-[#B78A58]">
                🌅
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  2. Momentos do Dia & Hábitos
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Manhã, Tarde, Noite e Cuidados Especiais
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8C7A6B]">
                {completedTasksCount}/{totalTasksCount}
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                {openSections.periodos ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {openSections.periodos && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-4">
              {/* Period 1: Manhã */}
              <div className="bg-white border border-[#EFE8DE] rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DE]/70">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#FFF6E5] flex items-center justify-center text-[#B78A58]">
                      <Sun className="w-4 h-4 text-[#B78A58]" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#2C2C2C]">Manhã</h3>
                      <p className="text-[10px] text-[#8C7A6B]">Início do dia, preparação e energia</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNewPeriod('manha');
                      setIsAddModalOpen(true);
                    }}
                    className="text-xs font-semibold text-[#8C7A6B] hover:text-[#5C4F44] flex items-center gap-1 bg-[#F4EDE2] px-2 py-1 rounded-xl transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {manhaTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleRoutineTask(task.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        task.completed
                          ? 'bg-[#F2ECE2] border-[#DDD3C5] opacity-75'
                          : 'bg-[#FDFBF7] border-[#EFE8DE] hover:bg-[#F7F4EE]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                            task.completed
                              ? 'bg-[#8C7A6B] border-[#8C7A6B] text-white'
                              : 'border-[#C4B6A6] bg-white'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <h4
                            className={`text-xs font-bold truncate ${
                              task.completed ? 'line-through text-[#8C7A6B]' : 'text-[#2C2C2C]'
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.subtitle && (
                            <p className="text-[10px] text-[#8C7A6B] truncate">{task.subtitle}</p>
                          )}
                        </div>
                      </div>

                      {task.time && (
                        <span className="text-[10px] text-[#8C7A6B] bg-[#EFE8DE] px-2 py-0.5 rounded-md font-medium shrink-0">
                          {task.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Period 2: Tarde */}
              <div className="bg-white border border-[#EFE8DE] rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DE]/70">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#FFF3EC] flex items-center justify-center text-[#C58B68]">
                      <Sunset className="w-4 h-4 text-[#C58B68]" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#2C2C2C]">Tarde</h3>
                      <p className="text-[10px] text-[#8C7A6B]">Almoço, estudos e tarefas da casa</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNewPeriod('tarde');
                      setIsAddModalOpen(true);
                    }}
                    className="text-xs font-semibold text-[#8C7A6B] hover:text-[#5C4F44] flex items-center gap-1 bg-[#F4EDE2] px-2 py-1 rounded-xl transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {tardeTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleRoutineTask(task.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        task.completed
                          ? 'bg-[#F2ECE2] border-[#DDD3C5] opacity-75'
                          : 'bg-[#FDFBF7] border-[#EFE8DE] hover:bg-[#F7F4EE]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                            task.completed
                              ? 'bg-[#8C7A6B] border-[#8C7A6B] text-white'
                              : 'border-[#C4B6A6] bg-white'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <h4
                            className={`text-xs font-bold truncate ${
                              task.completed ? 'line-through text-[#8C7A6B]' : 'text-[#2C2C2C]'
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.subtitle && (
                            <p className="text-[10px] text-[#8C7A6B] truncate">{task.subtitle}</p>
                          )}
                        </div>
                      </div>

                      {task.time && (
                        <span className="text-[10px] text-[#8C7A6B] bg-[#EFE8DE] px-2 py-0.5 rounded-md font-medium shrink-0">
                          {task.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Period 3: Noite */}
              <div className="bg-white border border-[#EFE8DE] rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DE]/70">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#F0EEFA] flex items-center justify-center text-[#6B5E8C]">
                      <Moon className="w-4 h-4 text-[#6B5E8C]" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#2C2C2C]">Noite</h3>
                      <p className="text-[10px] text-[#8C7A6B]">Desaceleração, banho relaxante e sono</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNewPeriod('noite');
                      setIsAddModalOpen(true);
                    }}
                    className="text-xs font-semibold text-[#8C7A6B] hover:text-[#5C4F44] flex items-center gap-1 bg-[#F4EDE2] px-2 py-1 rounded-xl transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {noiteTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleRoutineTask(task.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        task.completed
                          ? 'bg-[#F2ECE2] border-[#DDD3C5] opacity-75'
                          : 'bg-[#FDFBF7] border-[#EFE8DE] hover:bg-[#F7F4EE]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                            task.completed
                              ? 'bg-[#8C7A6B] border-[#8C7A6B] text-white'
                              : 'border-[#C4B6A6] bg-white'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <h4
                            className={`text-xs font-bold truncate ${
                              task.completed ? 'line-through text-[#8C7A6B]' : 'text-[#2C2C2C]'
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.subtitle && (
                            <p className="text-[10px] text-[#8C7A6B] truncate">{task.subtitle}</p>
                          )}
                        </div>
                      </div>

                      {task.time && (
                        <span className="text-[10px] text-[#8C7A6B] bg-[#EFE8DE] px-2 py-0.5 rounded-md font-medium shrink-0">
                          {task.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Period 4: Cuidados Especiais */}
              <div className="bg-white border border-[#EFE8DE] rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DE]/70">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#F7EEE3] flex items-center justify-center text-[#B78A58]">
                      <Sparkles className="w-4 h-4 text-[#B78A58]" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#2C2C2C]">Cuidados Especiais</h3>
                      <p className="text-[10px] text-[#8C7A6B]">Esfoliação corporal, máscaras, cuidados semanais</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNewPeriod('especiais');
                      setIsAddModalOpen(true);
                    }}
                    className="text-xs font-semibold text-[#8C7A6B] hover:text-[#5C4F44] flex items-center gap-1 bg-[#F4EDE2] px-2 py-1 rounded-xl transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {especiaisTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleRoutineTask(task.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        task.completed
                          ? 'bg-[#F2ECE2] border-[#DDD3C5] opacity-75'
                          : 'bg-[#FDFBF7] border-[#EFE8DE] hover:bg-[#F7F4EE]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                            task.completed
                              ? 'bg-[#8C7A6B] border-[#8C7A6B] text-white'
                              : 'border-[#C4B6A6] bg-white'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <h4
                            className={`text-xs font-bold truncate ${
                              task.completed ? 'line-through text-[#8C7A6B]' : 'text-[#2C2C2C]'
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.subtitle && (
                            <p className="text-[10px] text-[#8C7A6B] truncate">{task.subtitle}</p>
                          )}
                        </div>
                      </div>

                      {task.time && (
                        <span className="text-[10px] text-[#8C7A6B] bg-[#EFE8DE] px-2 py-0.5 rounded-md font-medium shrink-0">
                          {task.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            ACORDEÃO 3: LEMBRETES CONTEXTUAIS ATIVOS
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
                  3. Lembretes Contextuais Ativos
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Avisos suaves e inteligentes no momento certo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8C7A6B] bg-[#F4EDE2] px-2.5 py-1 rounded-full">
                {contextualReminders.length} ativos
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                {openSections.lembretes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {openSections.lembretes && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-3">
              <div className="bg-[#F7F1E6] p-3.5 rounded-2xl border border-[#EAE1D1] flex items-start gap-2.5 text-xs text-[#5C4F44]">
                <Bell className="w-4 h-4 text-[#8C7A6B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#4A3E34]">Lembretes Contextuais Inteligentes</p>
                  <p className="text-[11px] text-[#6E5D4F] mt-0.5 leading-relaxed">
                    O aplicativo envia avisos respeitosos baseados no seu ritmo diário e nos cuidados especiais marcados para hoje.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {contextualReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="p-3 bg-white border border-[#EFE8DE] rounded-2xl flex items-center justify-between text-xs gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Sparkles className="w-4 h-4 text-[#B78A58] shrink-0" />
                      <span className="font-semibold text-[#2C2C2C] truncate">{reminder.text}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => triggerReminderNotification(reminder.text)}
                        className="p-1.5 text-[#8C7A6B] hover:text-[#5C4F44] hover:bg-[#F4EDE2] rounded-lg transition-colors"
                        title="Testar notificação"
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => dismissContextualReminder(reminder.id)}
                        className="text-[10px] font-bold text-[#8C7A6B] hover:text-[#5C4F44] bg-[#F4EDE2] px-2 py-1 rounded-md transition-colors"
                      >
                        Dispensar
                      </button>
                    </div>
                  </div>
                ))}

                {/* Additional static sample contextual reminder */}
                <div className="p-3 bg-white border border-[#EFE8DE] rounded-2xl flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Sparkles className="w-4 h-4 text-[#B78A58] shrink-0" />
                    <span className="font-semibold text-[#2C2C2C] truncate">
                      Pente fino nas crianças antes da escola (08:00)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#7D9D7F] bg-[#EEF5EF] px-2 py-0.5 rounded-full border border-[#B7D2B9]">
                    Ativo
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
          aria-label="Adicionar atividade à rotina"
        >
          <Plus className="w-4 h-4 text-white" />
          <span className="text-xs font-bold">Nova Rotina</span>
        </button>
      </div>

      {/* Modal: Nova Atividade de Rotina */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-5 shadow-2xl border border-[#EFE8DE] space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F7EEE3] flex items-center justify-center text-[#8C7A6B]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2C2C2C]">Nova Atividade de Rotina</h3>
                  <p className="text-[11px] text-[#8C7A6B]">Adicione ao seu ritmo diário</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#5C4F44]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoutineTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                  Nome da atividade:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pente fino nas crianças, Esfoliação corporal, Suplemento..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                  Detalhe / Subtítulo:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Antes da escola, Durante o banho da noite..."
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs text-[#2C2C2C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Momento do dia:
                  </label>
                  <select
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value as PeriodKey)}
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#2C2C2C] focus:outline-none"
                  >
                    <option value="manha">Manhã</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                    <option value="especiais">Cuidados Especiais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Horário aproximado:
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-2.5 py-2 text-xs font-bold text-[#2C2C2C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8C7A6B] hover:bg-[#786657] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Salvar na Rotina
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
