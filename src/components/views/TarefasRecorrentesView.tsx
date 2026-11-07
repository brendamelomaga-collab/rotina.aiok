import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Plus,
  Repeat,
  Check,
  CheckCircle2,
  Trash2,
  Clock,
  X,
  AlertCircle,
  CalendarCheck
} from 'lucide-react';
import { RecurringTaskItem } from '../../types';

export const TarefasRecorrentesView: React.FC = () => {
  const {
    setActiveTab,
    recurringTasks,
    recurringHistory,
    completeRecurringTask,
    addRecurringTask,
    deleteRecurringTask
  } = useApp();

  // Strict vertical collapsible accordion state (no horizontal tabs)
  const [openSections, setOpenSections] = useState<{
    ativas: boolean;
    historico: boolean;
    prazos: boolean;
  }>({
    ativas: true,
    historico: true,
    prazos: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Modal for new recurring task
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRecurrence, setNewRecurrence] = useState('A cada 14 dias');
  const [newNextDate, setNewNextDate] = useState('Segunda-feira');
  const [newIcon, setNewIcon] = useState('sparkles');
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addRecurringTask({
      title: newTitle.trim(),
      recurrence: newRecurrence,
      nextDate: newNextDate,
      icon: newIcon
    });

    setToastNotification(`Tarefa "${newTitle.trim()}" criada com intervalo de ${newRecurrence.toLowerCase()}!`);
    setTimeout(() => setToastNotification(null), 3000);

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const handleCompleteWithToast = (task: RecurringTaskItem) => {
    completeRecurringTask(task.id);
    setToastNotification(`✓ "${task.title}" concluída e registrada no Histórico!`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  const getTaskEmoji = (task: RecurringTaskItem) => {
    const lower = task.title.toLowerCase();
    if (lower.includes('pneu') || lower.includes('moto') || lower.includes('carro')) return '🏍️';
    if (lower.includes('sapato') || lower.includes('tênis')) return '👟';
    if (lower.includes('cama') || lower.includes('lençol') || lower.includes('toalha')) return '🛏️';
    if (lower.includes('planta') || lower.includes('jardim')) return '🌱';
    if (lower.includes('filtro') || lower.includes('ar')) return '❄️';
    if (lower.includes('geladeira')) return '🧊';
    return '✨';
  };

  // Categorize tasks for state analysis
  const overdueCount = recurringTasks.filter(
    (t) => t.status === 'pendente' && (t.nextDate.includes('04') || t.nextDate.includes('Atrasad'))
  ).length;

  const todayCount = recurringTasks.filter((t) => t.status === 'hoje').length;

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-2 pb-32 select-none relative">
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-[#2C2C2C] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7D9D7F] shrink-0" />
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
          <h1 className="text-lg font-bold text-[#2C2C2C] tracking-tight">Tarefas Recorrentes</h1>
          <p className="text-[11px] text-[#8C7A6B]">Manutenção da casa e cuidados periódicos</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-9 h-9 rounded-full bg-[#8C7A6B] hover:bg-[#786657] text-white flex items-center justify-center shadow-xs transition-colors"
          title="Nova Tarefa Recorrente"
          aria-label="Adicionar tarefa recorrente"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Status Banner */}
      <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl p-4 sm:p-5 mb-4 shadow-[0_4px_20px_rgba(140,122,107,0.05)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-xl shrink-0">
            <Repeat className="w-5 h-5 text-[#8C7A6B]" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#2C2C2C]">
              {recurringTasks.length} Tarefas Monitoradas
            </h2>
            <p className="text-[11px] text-[#8C7A6B]">
              {todayCount > 0 ? `${todayCount} para hoje • ` : ''}
              {overdueCount > 0 ? `${overdueCount} atrasada(s) • ` : ''}
              {recurringHistory.length} execuções registradas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {overdueCount > 0 && (
            <span className="text-[10px] font-bold text-[#8C3A24] bg-[#FDF2EE] border border-[#E8C2B8] px-2 py-0.5 rounded-full">
              {overdueCount} atrasada
            </span>
          )}
          {todayCount > 0 && (
            <span className="text-[10px] font-bold text-[#5C4F44] bg-[#EAE0D2] px-2 py-0.5 rounded-full">
              {todayCount} hoje
            </span>
          )}
        </div>
      </div>

      {/* STRICTLY VERTICAL ACCORDION STRUCTURE (NO HORIZONTAL TABS) */}
      <div className="space-y-4">
        {/* ========================================================
            ACORDEÃO 1: TAREFAS RECORRENTES ATIVAS
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('ativas')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.ativas}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-lg text-[#B78A58]">
                🏠
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  1. Tarefas Recorrentes Ativas
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Pendente, Hoje, Atrasada e Concluídas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8C7A6B] bg-[#F4EDE2] px-2.5 py-1 rounded-full">
                {recurringTasks.length} itens
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                {openSections.ativas ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {openSections.ativas && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-[#4A3E34]">
                  Lista de cuidados periódicos:
                </span>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-xs font-semibold text-[#8C7A6B] hover:text-[#5C4F44] flex items-center gap-1 bg-[#F4EDE2] px-2.5 py-1 rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Tarefa</span>
                </button>
              </div>

              {recurringTasks.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8C7A6B] bg-white rounded-2xl border border-[#EFE8DE]">
                  Nenhuma tarefa recorrente ativa. Toque no botão acima para cadastrar.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recurringTasks.map((task: RecurringTaskItem) => {
                    const isDone = task.status === 'concluido';
                    const isToday = task.status === 'hoje';
                    const isLate = task.status === 'pendente' && (task.nextDate.includes('04') || task.nextDate.includes('Atrasad'));

                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-2xl border transition-all shadow-2xs flex items-center justify-between gap-3 ${
                          isDone
                            ? 'bg-[#F2ECE2] border-[#DDD3C5] opacity-75'
                            : 'bg-white border-[#EFE8DE] hover:bg-[#FDFBF7]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#EAE0D2] flex items-center justify-center text-xl shrink-0 shadow-2xs">
                            {getTaskEmoji(task)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-[#2C2C2C] truncate">
                              {task.title}
                            </h3>
                            <p className="text-[11px] text-[#8C7A6B] mt-0.5 truncate">
                              {task.recurrence} • Próximo: <strong>{task.nextDate}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Visual Status Badges (Pendente, Hoje, Atrasada) */}
                          {isToday && (
                            <span className="text-[10px] font-bold text-[#5C4F44] bg-[#EAE0D2] px-2.5 py-1 rounded-full border border-[#D8C7B4]">
                              Hoje
                            </span>
                          )}
                          {isLate && (
                            <span className="text-[10px] font-bold text-[#8C3A24] bg-[#FDF2EE] border border-[#E8C2B8] px-2.5 py-1 rounded-full">
                              Atrasada
                            </span>
                          )}
                          {!isToday && !isLate && !isDone && (
                            <span className="text-[10px] font-semibold text-[#8C7A6B] bg-[#F4EDE2] px-2.5 py-1 rounded-full">
                              Pendente
                            </span>
                          )}

                          {/* Interactive Action: Concluir */}
                          <button
                            type="button"
                            onClick={() => handleCompleteWithToast(task)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs ${
                              isDone
                                ? 'bg-[#7D9D7F] text-white'
                                : 'bg-[#EAE0D2] hover:bg-[#DFD3C3] text-[#5C4F44]'
                            }`}
                          >
                            {isDone ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Feito</span>
                              </>
                            ) : (
                              <span>Concluir</span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteRecurringTask(task.id)}
                            className="p-1.5 text-[#B4A597] hover:text-[#8C3A24] rounded-lg hover:bg-[#FDF2EE] transition-colors"
                            title="Excluir tarefa"
                            aria-label={`Excluir tarefa ${task.title}`}
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
            ACORDEÃO 2: HISTÓRICO DE EXECUÇÃO INTEGRADO
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('historico')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.historico}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-lg text-[#B78A58]">
                📜
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  2. Histórico de Execução Integrado
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Consultar datas passadas em que cada tarefa foi realizada
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8C7A6B] bg-[#F4EDE2] px-2.5 py-1 rounded-full">
                {recurringHistory.length} registros
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                {openSections.historico ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {openSections.historico && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-3">
              <p className="text-xs text-[#8C7A6B] leading-relaxed">
                Cada vez que uma tarefa periódica é concluída, um carimbo de data e hora é registrado aqui:
              </p>

              {recurringHistory.length === 0 ? (
                <div className="p-5 text-center text-xs text-[#8C7A6B] bg-white rounded-2xl border border-[#EFE8DE]">
                  Nenhum registro no histórico ainda. Conclua uma tarefa para gerar o primeiro histórico.
                </div>
              ) : (
                <div className="space-y-2">
                  {recurringHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-white border border-[#EFE8DE] rounded-2xl text-xs gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-[#7D9D7F] shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-[#2C2C2C] block truncate">
                            {item.displayDate} - {item.taskTitle}
                          </span>
                          <span className="text-[10px] text-[#8C7A6B]">
                            Registrado às{' '}
                            {new Date(item.completedAt).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-[#2C2C2C] bg-[#EEF5EF] px-2 py-0.5 rounded-full border border-[#B7D2B9] shrink-0">
                        ✓ Realizado
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================
            ACORDEÃO 3: PRAZOS & PERIODICIDADES INTELIGENTES
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('prazos')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.prazos}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-lg text-[#B78A58]">
                ⏱️
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  3. Prazos & Frequências Recomendadas
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Padrões de manutenção do lar e bem-estar
                </p>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
              {openSections.prazos ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {openSections.prazos && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-white border border-[#EFE8DE] rounded-2xl space-y-1">
                  <span className="font-bold text-[#2C2C2C] flex items-center gap-1.5">
                    <span>🛏️ Roupa de cama e toalhas</span>
                  </span>
                  <p className="text-[11px] text-[#8C7A6B]">
                    Semanalmente (toda segunda ou sexta-feira)
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#EFE8DE] rounded-2xl space-y-1">
                  <span className="font-bold text-[#2C2C2C] flex items-center gap-1.5">
                    <span>🏍️ Calibragem de pneus</span>
                  </span>
                  <p className="text-[11px] text-[#8C7A6B]">
                    A cada 14 dias para segurança e economia
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#EFE8DE] rounded-2xl space-y-1">
                  <span className="font-bold text-[#2C2C2C] flex items-center gap-1.5">
                    <span>❄️ Filtros de ar condicionado</span>
                  </span>
                  <p className="text-[11px] text-[#8C7A6B]">
                    Mensalmente para saúde respiratória da família
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#EFE8DE] rounded-2xl space-y-1">
                  <span className="font-bold text-[#2C2C2C] flex items-center gap-1.5">
                    <span>👟 Higienização de calçados</span>
                  </span>
                  <p className="text-[11px] text-[#8C7A6B]">
                    A cada 15 a 20 dias conforme o uso
                  </p>
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
          aria-label="Criar nova tarefa recorrente"
        >
          <Plus className="w-4 h-4 text-white" />
          <span className="text-xs font-bold">Nova Tarefa</span>
        </button>
      </div>

      {/* Modal: Nova Tarefa Recorrente */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-5 shadow-2xl border border-[#EFE8DE] space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F7EEE3] flex items-center justify-center text-[#8C7A6B]">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2C2C2C]">Nova Tarefa Recorrente</h3>
                  <p className="text-[11px] text-[#8C7A6B]">Tarefas periódicas da casa e família</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#5C4F44]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                  Título da Tarefa:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Calibrar pneu, Limpeza profunda da geladeira, Troca do filtro..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Periodicidade:
                  </label>
                  <select
                    value={newRecurrence}
                    onChange={(e) => setNewRecurrence(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#2C2C2C] focus:outline-none"
                  >
                    <option value="Semanalmente">Semanalmente</option>
                    <option value="A cada 14 dias">A cada 14 dias</option>
                    <option value="Todo dia 15">Todo dia 15</option>
                    <option value="Mensalmente">Mensalmente</option>
                    <option value="A cada 3 meses">A cada 3 meses</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Próxima data / dia:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 20/11 ou Segunda-feira"
                    value={newNextDate}
                    onChange={(e) => setNewNextDate(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs text-[#2C2C2C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8C7A6B] hover:bg-[#786657] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Salvar Tarefa
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
