import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Plus,
  Target,
  Check,
  CheckCircle2,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { GoalItem } from '../../types';

export const MetasView: React.FC = () => {
  const {
    setActiveTab,
    goals,
    toggleGoalStep,
    addGoal,
    deleteGoal
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'em_andamento' | 'concluida'>('em_andamento');

  // Modal for new goal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Casa');
  const [newDueDate, setNewDueDate] = useState('');
  const [stepInputs, setStepInputs] = useState<string[]>(['', '', '']);

  const handleStepInputChange = (index: number, value: string) => {
    const updated = [...stepInputs];
    updated[index] = value;
    setStepInputs(updated);
  };

  const handleAddStepField = () => {
    setStepInputs((prev) => [...prev, '']);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const validSteps = stepInputs
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t, idx) => ({
        id: `s-${Date.now()}-${idx}`,
        text: t,
        done: false
      }));

    addGoal({
      title: newTitle.trim(),
      category: newCategory.trim() || 'Pessoal',
      dueDate: newDueDate || undefined,
      status: 'em_andamento',
      steps: validSteps.length > 0 ? validSteps : [{ id: `s-${Date.now()}`, text: 'Iniciar planejamento', done: false }]
    });

    setNewTitle('');
    setNewDueDate('');
    setStepInputs(['', '', '']);
    setIsAddModalOpen(false);
  };

  const activeGoals = goals.filter((g) => g.status === 'em_andamento');
  const completedGoals = goals.filter((g) => g.status === 'concluida' || g.progressPercent >= 100);

  const displayedGoals = activeTabFilter === 'em_andamento' ? activeGoals : completedGoals;

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-2 pb-28 select-none">
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
          <h1 className="text-lg font-bold text-[#2C2C2C] tracking-tight">Minhas Metas</h1>
          <p className="text-[11px] text-[#8C7A6B]">Seus objetivos em passos possíveis</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-9 h-9 rounded-full bg-[#8C7A6B] hover:bg-[#786657] text-white flex items-center justify-center shadow-xs transition-colors"
          title="Nova Meta"
          aria-label="Adicionar nova meta"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Controller: Em andamento / Concluídas (Screen 8) */}
      <div className="flex bg-[#F4EDE2] p-1 rounded-2xl mb-4">
        <button
          onClick={() => setActiveTabFilter('em_andamento')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTabFilter === 'em_andamento'
              ? 'bg-[#FAF8F5] text-[#2C2C2C] shadow-xs'
              : 'text-[#8C7A6B] hover:text-[#2C2C2C]'
          }`}
        >
          Em andamento ({activeGoals.length})
        </button>
        <button
          onClick={() => setActiveTabFilter('concluida')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTabFilter === 'concluida'
              ? 'bg-[#FAF8F5] text-[#2C2C2C] shadow-xs'
              : 'text-[#8C7A6B] hover:text-[#2C2C2C]'
          }`}
        >
          Concluídas ({completedGoals.length})
        </button>
      </div>

      {/* Goals List (Screen 8) */}
      <div className="space-y-4 mb-5">
        {displayedGoals.length === 0 ? (
          <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl p-8 text-center space-y-2">
            <Target className="w-8 h-8 text-[#9E6C52] mx-auto opacity-70" />
            <h3 className="text-sm font-bold text-[#2C2C2C]">
              {activeTabFilter === 'em_andamento'
                ? 'Nenhuma meta em andamento no momento!'
                : 'Nenhuma meta concluída ainda.'}
            </h3>
            <p className="text-xs text-[#8C7A6B]">
              Defina pequenos passos para realizar grandes conquistas familiares.
            </p>
            {activeTabFilter === 'em_andamento' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 px-4 py-2 bg-[#8C7A6B] text-white text-xs font-bold rounded-xl"
              >
                Criar Primeira Meta
              </button>
            )}
          </div>
        ) : (
          displayedGoals.map((goal: GoalItem) => {
            const isCompleted = goal.status === 'concluida' || goal.progressPercent >= 100;
            const icon =
              goal.category.toLowerCase().includes('casa')
                ? '🔨'
                : goal.category.toLowerCase().includes('fam')
                ? '🛍️'
                : '🚪';

            return (
              <div
                key={goal.id}
                className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl p-5 shadow-[0_4px_20px_rgba(140,122,107,0.05)] space-y-3.5 transition-all"
              >
                {/* Header of Goal Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#F7EDE4] flex items-center justify-center text-xl shrink-0 shadow-2xs">
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#2C2C2C] leading-snug">
                          {goal.title}
                        </h3>
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-[#2C5230] bg-[#EEF5EF] px-2 py-0.5 rounded-full border border-[#B7D2B9]">
                            Concluída
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#8C7A6B] mt-0.5">
                        <span>{goal.category}</span>
                        {goal.dueDate && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Prazo: {goal.dueDate}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 text-[#B4A597] hover:text-[#8C3A24] rounded-lg hover:bg-[#F4EDE2] transition-colors"
                    title="Excluir meta"
                    aria-label={`Excluir meta ${goal.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress Bar (Screen 8: 40% concluído) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-[#5C4F44]">
                      {goal.progressPercent}% concluído
                    </span>
                    <span className="text-[11px] text-[#8C7A6B] font-semibold">
                      {goal.completedSteps} de {goal.totalSteps} passos
                    </span>
                  </div>
                  <div className="w-full bg-[#EFE8DE] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${goal.progressPercent}%`,
                        backgroundColor: isCompleted ? '#7D9D7F' : '#9E6C52'
                      }}
                    />
                  </div>
                </div>

                {/* Checklist Steps (Screen 8) */}
                {goal.steps && goal.steps.length > 0 && (
                  <div className="pt-1 space-y-2 border-t border-[#EFE8DE]/60">
                    <span className="text-[11px] font-bold text-[#8C7A6B] block">
                      Passos para realizar:
                    </span>
                    <div className="space-y-1.5">
                      {goal.steps.map((step) => (
                        <div
                          key={step.id}
                          onClick={() => toggleGoalStep(goal.id, step.id)}
                          className={`p-2.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-colors ${
                            step.done
                              ? 'bg-[#F2ECE2] border-[#DDD3C5] text-[#8C7A6B]'
                              : 'bg-white border-[#EFE8DE] text-[#2C2C2C] hover:bg-[#FDFBF7]'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                              step.done
                                ? 'bg-[#7D9D7F] border-[#7D9D7F] text-white'
                                : 'border-[#C8B8A6] bg-white'
                            }`}
                          >
                            {step.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              step.done ? 'line-through text-[#8C7A6B]' : 'text-[#2C2C2C]'
                            }`}
                          >
                            {step.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Encouragement Card (Screen 8: "Você está indo bem! Continue focada nas suas metas. >") */}
      <div className="bg-[#FAF5ED] border border-[#EAE0D2] rounded-3xl p-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-xl shrink-0">
            💡
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#4A3E34]">Você está indo bem!</h4>
            <p className="text-[11px] text-[#6E5D4F] leading-snug">
              Cada pequeno passo concluído é uma vitória para a tranquilidade da casa.
            </p>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-[#B78A58] shrink-0" />
      </div>

      {/* Modal: Nova Meta */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-5 shadow-2xl border border-[#EFE8DE] space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F7EDE4] flex items-center justify-center text-[#9E6C52]">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2C2C2C]">Nova Meta Familiar</h3>
                  <p className="text-[11px] text-[#8C7A6B]">Divida em pequenos passos fáceis</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#5C4F44]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                  Título da Meta:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pintar o quarto, Viagem das férias, Organizar armários..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Categoria:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#2C2C2C] focus:outline-none"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Família">Família</option>
                    <option value="Organização">Organização</option>
                    <option value="Saúde & Bem-estar">Saúde & Bem-estar</option>
                    <option value="Finanças">Finanças</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Prazo estimado:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 30/11 ou Dezembro"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs text-[#2C2C2C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#4A3E34]">
                    Passos práticos (Checklist):
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStepField}
                    className="text-[11px] font-semibold text-[#8C7A6B] hover:text-[#5C4F44] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Mais um passo</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {stepInputs.map((val, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Passo ${idx + 1}...`}
                      value={val}
                      onChange={(e) => handleStepInputChange(idx, e.target.value)}
                      className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-1.5 text-xs text-[#2C2C2C] focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8C7A6B] hover:bg-[#786657] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Salvar Meta
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
