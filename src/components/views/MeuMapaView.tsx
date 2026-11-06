import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Smile,
  Sliders,
  Plus,
  Check,
  Calendar,
  Sparkles,
  Info,
  Clock,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import {
  calculatePerformanceMetrics,
  calculateAreaPerformance,
  formatBrazilianDate
} from '../../utils/routineCalculations';
import { DayPeriod, MoodType, QuestionResponseValue } from '../../types';

export const MeuMapaView: React.FC = () => {
  const {
    setActiveTab,
    selectedDate,
    setSelectedDate,
    lifeAreas,
    questionGroups,
    questions,
    questionResponses,
    setQuestionResponse,
    getQuestionResponse,
    availableFactors,
    addCustomFactor,
    dayFactors,
    toggleDayFactor,
    dayNotes,
    setDayNotesForDate,
    moodRecords,
    savePeriodMood,
    getMoodRecordsForDate,
    setIsManageQuestionsModalOpen,
    recordChoiceResponse,
    setIsRelatoriosModalOpen
  } = useApp();

  // 4 strictly vertical collapsible sections state
  const [openSections, setOpenSections] = useState<{
    humor: boolean;
    fatores: boolean;
    perguntas: boolean;
    resumo: boolean;
  }>({
    humor: true,
    fatores: true,
    perguntas: true,
    resumo: true
  });

  const toggleSection = (section: 'humor' | 'fatores' | 'perguntas' | 'resumo') => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // State for active mood logging form
  const [selectedPeriod, setSelectedPeriod] = useState<DayPeriod>('manha');
  const [selectedMood, setSelectedMood] = useState<MoodType>('bem');
  const [intensity, setIntensity] = useState<number>(3);
  const [moodNotes, setMoodNotes] = useState<string>('');
  const [customTime, setCustomTime] = useState<string>('12:00');

  // State for adding custom factor
  const [isAddingFactor, setIsAddingFactor] = useState(false);
  const [newFactorName, setNewFactorName] = useState('');

  // Expandable state for life areas inside questions section
  const [expandedAreaId, setExpandedAreaId] = useState<string>(lifeAreas[0]?.id || '');

  // Performance metrics calculated via MANDATORY RULE
  const metrics = calculatePerformanceMetrics(
    questionResponses.filter((r) => r.date === selectedDate),
    questions
  );

  const moodListForDay = getMoodRecordsForDate(selectedDate);
  const selectedFactorsForDay = dayFactors[selectedDate] || [];
  const currentDayNote = dayNotes[selectedDate] || '';

  const moodOptions: { type: MoodType; label: string; emoji: string }[] = [
    { type: 'muito_bem', label: 'Muito Bem', emoji: '😃' },
    { type: 'bem', label: 'Bem', emoji: '😊' },
    { type: 'neutro', label: 'Neutro', emoji: '😐' },
    { type: 'triste', label: 'Triste', emoji: '😔' },
    { type: 'irritado', label: 'Irritado', emoji: '😠' },
    { type: 'ansioso', label: 'Ansioso', emoji: '🥺' },
    { type: 'sobrecarregado', label: 'Sobrecarregado', emoji: '😫' }
  ];

  const periodOptions: { period: DayPeriod; label: string; icon: string }[] = [
    { period: 'manha', label: 'Manhã', icon: '☀️' },
    { period: 'tarde', label: 'Tarde', icon: '🏠' },
    { period: 'noite', label: 'Noite', icon: '🌙' },
    { period: 'personalizado', label: 'Horário Livre', icon: '⏰' }
  ];

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = moodOptions.find((m) => m.type === selectedMood) || moodOptions[1];
    savePeriodMood({
      date: selectedDate,
      period: selectedPeriod,
      customTime: selectedPeriod === 'personalizado' ? customTime : undefined,
      mood: selectedMood,
      label: chosen.label,
      intensity,
      notes: moodNotes.trim() || undefined
    });
    setMoodNotes('');
  };

  const handleCreateFactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactorName.trim()) return;
    addCustomFactor(newFactorName.trim());
    toggleDayFactor(selectedDate, newFactorName.trim());
    setNewFactorName('');
    setIsAddingFactor(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-2 pb-32 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 mb-3">
        <button
          onClick={() => setActiveTab('inicio')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#8C7A6B] hover:text-[#5C4F44] bg-[#F4EDE2] px-3 py-1.5 rounded-full transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Início</span>
        </button>

        <div className="text-center">
          <h1 className="text-lg font-bold text-[#2C2C2C] tracking-tight">Meu Mapa</h1>
          <p className="text-[11px] text-[#8C7A6B]">Acompanhamento & Bem-estar</p>
        </div>

        <button
          onClick={() => setIsManageQuestionsModalOpen(true)}
          className="flex items-center gap-1 text-xs font-bold text-[#5C4F44] bg-[#EFE8DE] hover:bg-[#E4DACD] px-3 py-1.5 rounded-full transition-colors shadow-2xs"
          title="Personalizar perguntas e áreas"
        >
          <Sliders className="w-3.5 h-3.5 text-[#8C7A6B]" />
          <span className="hidden sm:inline">Estrutura</span>
        </button>
      </div>

      {/* Date Navigation Bar (Allows viewing/editing previous days) */}
      <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-2xl p-2.5 mb-4 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => setSelectedDate('2026-11-15')}
          className="px-2.5 py-1 text-xs text-[#8C7A6B] hover:text-[#2C2C2C] hover:bg-[#F4EDE2] rounded-xl transition-colors font-medium"
        >
          ◀ Ontem
        </button>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#8C7A6B]" />
          <span className="text-xs font-bold text-[#2C2C2C]">
            {formatBrazilianDate(selectedDate)}
          </span>
          {selectedDate === '2026-11-16' && (
            <span className="text-[10px] font-bold text-[#5C4F44] bg-[#EAE0D2] px-2 py-0.5 rounded-full">
              Hoje
            </span>
          )}
        </div>

        <button
          onClick={() => setSelectedDate('2026-11-16')}
          className="px-2.5 py-1 text-xs text-[#8C7A6B] hover:text-[#2C2C2C] hover:bg-[#F4EDE2] rounded-xl transition-colors font-medium"
        >
          Hoje ▶
        </button>
      </div>

      {/* 4 STRICTLY VERTICAL COLLAPSIBLE ACCORDION SECTIONS */}
      <div className="space-y-4">
        {/* ========================================================
            SEÇÃO 1: REGISTO DE HUMOR (INDEPENDENTE DO DESEMPENHO)
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('humor')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.humor}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-xl">
                😊
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C] flex items-center gap-2">
                  <span>1. Registo de Humor</span>
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Sentimento independente de metas comportamentais
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8C7A6B]">
                {moodListForDay.length} {moodListForDay.length === 1 ? 'registo' : 'registos'}
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                {openSections.humor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {openSections.humor && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-4">
              {/* Existing day mood records list */}
              {moodListForDay.length > 0 && (
                <div className="bg-[#FDFBF7] border border-[#EFE8DE] rounded-2xl p-3 space-y-2">
                  <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider block">
                    Registos salvos para este dia:
                  </span>
                  <div className="space-y-1.5">
                    {moodListForDay.map((rec) => {
                      const emoji = moodOptions.find((m) => m.type === rec.mood)?.emoji || '😊';
                      return (
                        <div
                          key={rec.id}
                          className="flex items-center justify-between p-2.5 bg-[#FAF8F5] border border-[#EFE8DE] rounded-xl text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{emoji}</span>
                            <div>
                              <span className="font-bold text-[#2C2C2C]">
                                {rec.label}{' '}
                                <span className="font-normal text-[#8C7A6B]">
                                  ({rec.period === 'manha' ? 'Manhã' : rec.period === 'tarde' ? 'Tarde' : rec.period === 'noite' ? 'Noite' : rec.customTime || 'Livre'})
                                </span>
                              </span>
                              {rec.notes && (
                                <p className="text-[11px] text-[#6E5D4F] mt-0.5 line-clamp-1 italic">
                                  "{rec.notes}"
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-[#5C4F44] bg-[#EFE8DE] px-2 py-0.5 rounded-md">
                            Nível {rec.intensity}/5
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form to log new / update period mood */}
              <form onSubmit={handleSaveMood} className="space-y-3.5 bg-[#FBF9F6] p-3.5 rounded-2xl border border-[#EFE8DE]">
                {/* Period Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-2">
                    Momento do dia:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {periodOptions.map((opt) => (
                      <button
                        key={opt.period}
                        type="button"
                        onClick={() => setSelectedPeriod(opt.period)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          selectedPeriod === opt.period
                            ? 'bg-[#8C7A6B] text-white shadow-xs'
                            : 'bg-[#FAF8F5] border border-[#EAE3D6] text-[#4A3E34] hover:bg-[#F2ECE0]'
                        }`}
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {selectedPeriod === 'personalizado' && (
                    <div className="mt-2 flex items-center gap-2 bg-white border border-[#EFE8DE] rounded-xl px-3 py-1.5 text-xs">
                      <Clock className="w-4 h-4 text-[#8C7A6B]" />
                      <span className="text-[#8C7A6B]">Horário:</span>
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="bg-transparent font-bold text-[#2C2C2C] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Mood Emoji Buttons */}
                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-2">
                    Como você está se sentindo?
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {moodOptions.map((opt) => {
                      const isSelected = selectedMood === opt.type;
                      return (
                        <button
                          key={opt.type}
                          type="button"
                          onClick={() => setSelectedMood(opt.type)}
                          className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#EAE0D2] ring-2 ring-[#8C7A6B] shadow-xs scale-105'
                              : 'bg-white border border-[#EFE8DE] hover:bg-[#F8F4EE]'
                          }`}
                        >
                          <span className="text-2xl">{opt.emoji}</span>
                          <span
                            className={`text-[10px] mt-1 text-center leading-tight ${
                              isSelected ? 'font-bold text-[#2C2C2C]' : 'font-medium text-[#8C7A6B]'
                            }`}
                          >
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Intensity Selector (1 to 5) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#4A3E34]">
                      Intensidade emocional:
                    </label>
                    <span className="text-xs font-bold text-[#8C7A6B]">
                      {intensity === 1 && '1 - Bem sutil'}
                      {intensity === 2 && '2 - Leve'}
                      {intensity === 3 && '3 - Moderada'}
                      {intensity === 4 && '4 - Forte'}
                      {intensity === 5 && '5 - Muito intensa'}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setIntensity(lvl)}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          intensity === lvl
                            ? 'bg-[#8C7A6B] text-white shadow-2xs'
                            : 'bg-white border border-[#EAE3D6] text-[#5C4F44] hover:bg-[#F3EDE2]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Observation / Free notes */}
                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Acontecimentos ou observações do momento:
                  </label>
                  <textarea
                    value={moodNotes}
                    onChange={(e) => setMoodNotes(e.target.value)}
                    placeholder="Ex: Tivemos um momento afetuoso no café da manhã / Me senti um pouco ansiosa com o trabalho..."
                    className="w-full bg-white border border-[#EFE8DE] rounded-2xl p-3 text-xs text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] resize-none h-18 placeholder:text-[#B2A396]"
                  />
                </div>

                {/* Rule Reminder */}
                <div className="bg-[#FAF5ED] p-2.5 rounded-xl border border-[#EAE0D2] flex items-center gap-2 text-[11px] text-[#6E5D4F]">
                  <Info className="w-3.5 h-3.5 text-[#8C7A6B] shrink-0" />
                  <span>
                    O humor é um registo de acolhimento emocional e não altera suas métricas de desempenho.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#8C7A6B] hover:bg-[#786657] text-white text-xs font-bold rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Gravar Registo deste Momento</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ========================================================
            SEÇÃO 2: FATORES QUE INFLUENCIARAM O DIA
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('fatores')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.fatores}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-xl">
                🌱
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  2. Fatores do Dia
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Contextos que impactaram seu dia e sua rotina
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8C7A6B]">
                {selectedFactorsForDay.length} ativos
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                {openSections.fatores ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {openSections.fatores && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-3">
              <p className="text-xs text-[#6E5D4F]">
                Selecione os fatores presentes no dia ({formatBrazilianDate(selectedDate)}):
              </p>

              {/* Factors Grid */}
              <div className="flex flex-wrap gap-2">
                {availableFactors.map((f) => {
                  const isSelected = selectedFactorsForDay.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleDayFactor(selectedDate, f)}
                      className={`px-3 py-2 rounded-2xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#8C7A6B] text-white shadow-2xs font-semibold'
                          : 'bg-[#F4EDE2] text-[#4A3E34] hover:bg-[#EAE0D2] border border-[#EAE3D6]'
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Factor */}
              <div className="pt-2">
                {!isAddingFactor ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingFactor(true)}
                    className="text-xs font-bold text-[#8C7A6B] hover:text-[#5C4F44] flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#F4EDE2]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Criar novo fator personalizado</span>
                  </button>
                ) : (
                  <form onSubmit={handleCreateFactor} className="flex gap-2 bg-white border border-[#EFE8DE] p-2.5 rounded-2xl">
                    <input
                      type="text"
                      placeholder="Ex: Visita inesperada, Reforma, Noite excelente..."
                      value={newFactorName}
                      onChange={(e) => setNewFactorName(e.target.value)}
                      className="flex-1 bg-transparent text-xs text-[#2C2C2C] focus:outline-none px-2"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#8C7A6B] text-white text-xs font-bold rounded-xl"
                    >
                      Adicionar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingFactor(false)}
                      className="px-2 py-1 text-xs text-[#8C7A6B]"
                    >
                      Cancelar
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SEÇÃO 3: ESTRUTURA E PERGUNTAS (ÁREAS → GRUPOS → PERGUNTAS)
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('perguntas')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.perguntas}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-xl">
                📝
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  3. Estrutura e Perguntas Diárias
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Organizadas por Áreas da Vida → Grupos → Perguntas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8C7A6B]">
                {metrics.totalResponses}/{questions.length} respondidas
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                {openSections.perguntas ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {openSections.perguntas && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-4">
              {/* Legend of 4 Response States (strictly defined) */}
              <div className="bg-[#F7F2EA] border border-[#EAE0D2] p-3 rounded-2xl">
                <span className="text-[11px] font-bold text-[#4A3E34] block mb-1.5">
                  4 Opções de Resposta para cada pergunta:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
                  <div className="bg-[#EEF5EF] text-[#2C5230] border border-[#B7D2B9] px-2 py-1 rounded-lg font-semibold text-center">
                    [ Positivo ] Verde Sálvia
                  </div>
                  <div className="bg-[#FDF2EE] text-[#8C3A24] border border-[#E8C2B8] px-2 py-1 rounded-lg font-semibold text-center">
                    [ Negativo ] Terracota
                  </div>
                  <div className="bg-[#F7F4EE] text-[#5C4F44] border border-[#E2D8CA] px-2 py-1 rounded-lg font-medium text-center">
                    [ Não se aplica ] Neutro
                  </div>
                  <div className="bg-[#F7F4EE] text-[#5C4F44] border border-[#E2D8CA] px-2 py-1 rounded-lg font-medium text-center">
                    [ Não lembro ] Neutro
                  </div>
                </div>
                <p className="text-[10px] text-[#8C7A6B] mt-1.5 leading-snug">
                  * Respostas neutras nunca diminuem seu percentual nem contam como negativas.
                </p>
              </div>

              {/* Vertical Areas Accordion List */}
              <div className="space-y-3">
                {lifeAreas.map((area) => {
                  const areaGroups = questionGroups.filter((g) => g.areaId === area.id);
                  const areaQuestions = questions.filter((q) => q.areaId === area.id);
                  const areaPerf = calculateAreaPerformance(
                    area.id,
                    questionResponses.filter((r) => r.date === selectedDate),
                    questions
                  );
                  const isExpanded = expandedAreaId === area.id;

                  return (
                    <div
                      key={area.id}
                      className="bg-[#FDFBF7] border border-[#EFE8DE] rounded-2xl overflow-hidden transition-all"
                    >
                      {/* Area Header Bar */}
                      <button
                        type="button"
                        onClick={() => setExpandedAreaId(isExpanded ? '' : area.id)}
                        className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F9F6F0] transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{area.icon || '📌'}</span>
                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-[#2C2C2C]">
                              {area.name}
                            </h3>
                            <span className="text-[10px] text-[#8C7A6B]">
                              {areaQuestions.length} perguntas cadastradas
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {areaPerf.hasEvaluatedAnswers ? (
                            <span className="text-xs font-extrabold text-[#5C4F44] bg-[#EFE8DE] px-2.5 py-0.5 rounded-full">
                              {areaPerf.positivePercentage}% positivo
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#8C7A6B] bg-[#F7F4EE] px-2 py-0.5 rounded-full">
                              Sem avaliação
                            </span>
                          )}
                          <div className="w-6 h-6 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </button>

                      {/* Area Content: Groups and Questions */}
                      {isExpanded && (
                        <div className="p-3.5 border-t border-[#EFE8DE]/60 space-y-4 bg-[#FCFAF6]">
                          {areaGroups.length === 0 ? (
                            <p className="text-xs text-center text-[#8C7A6B] py-2">
                              Nenhum grupo cadastrado nesta área.
                            </p>
                          ) : (
                            areaGroups.map((grp) => {
                              const grpQuestions = questions.filter((q) => q.groupId === grp.id);
                              if (grpQuestions.length === 0) return null;

                              return (
                                <div key={grp.id} className="space-y-2.5">
                                  {/* Group Title with Quick Add */}
                                  <div className="flex items-center justify-between border-b border-[#EFE8DE]/70 pb-1">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#5C4F44]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#8C7A6B]" />
                                      <span>{grp.name}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setIsManageQuestionsModalOpen(true)}
                                      className="text-[10px] font-semibold text-[#8C7A6B] hover:text-[#5C4F44] flex items-center gap-1 bg-[#F4EDE2] hover:bg-[#EAE0D2] px-2 py-0.5 rounded-lg transition-colors"
                                      title="Adicionar pergunta neste grupo"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>+ Pergunta</span>
                                    </button>
                                  </div>

                                  {/* Questions inside Group */}
                                  <div className="space-y-3">
                                    {grpQuestions.map((q) => {
                                      const resp = getQuestionResponse(q.id, selectedDate);
                                      const isSimPositive = q.positiveIf === 'sim';
                                      const isSimActive =
                                        resp?.choice === 'sim' ||
                                        (!resp?.choice &&
                                          resp?.value === (isSimPositive ? 'positivo' : 'negativo'));
                                      const isNaoActive =
                                        resp?.choice === 'nao' ||
                                        (!resp?.choice &&
                                          resp?.value === (isSimPositive ? 'negativo' : 'positivo'));
                                      const isNaActive =
                                        resp?.choice === 'nao_se_aplica' || resp?.value === 'nao_se_aplica';
                                      const isNaoLembroActive =
                                        resp?.choice === 'nao_lembro' || resp?.value === 'nao_lembro';

                                      return (
                                        <div
                                          key={q.id}
                                          className="bg-white border border-[#EFE8DE] rounded-2xl p-3.5 space-y-2.5 shadow-2xs"
                                        >
                                          {/* Question Title & Habit Rule Badge */}
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-1">
                                              <h4 className="text-xs sm:text-sm font-bold text-[#2C2C2C] leading-snug">
                                                {q.title}
                                              </h4>
                                              <div className="flex items-center gap-2 flex-wrap">
                                                {isSimPositive ? (
                                                  <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-[#EEF5EF] text-[#2C5230] border border-[#B7D2B9] font-semibold">
                                                    Hábito desejável • [Sim] é Positivo
                                                  </span>
                                                ) : (
                                                  <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-[#FDF2EE] text-[#8C3A24] border border-[#E8C2B8] font-semibold">
                                                    Comportamento a evitar • [Sim] é Negativo
                                                  </span>
                                                )}
                                                {resp?.value === 'positivo' && (
                                                  <span className="text-[10px] font-bold text-[#2C5230]">
                                                    ✓ Registrado Positivo
                                                  </span>
                                                )}
                                                {resp?.value === 'negativo' && (
                                                  <span className="text-[10px] font-bold text-[#8C3A24]">
                                                    ✕ Registrado Negativo
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* 4 Interactive Response Buttons matching reference screenshots */}
                                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                                            {/* 1. [Sim] Button */}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                recordChoiceResponse(q.id, selectedDate, 'sim')
                                              }
                                              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1 ${
                                                isSimPositive
                                                  ? isSimActive
                                                    ? 'bg-[#EEF5EF] text-[#1E3B21] border-[#7D9D7F] ring-2 ring-[#7D9D7F]/40 shadow-xs font-bold'
                                                    : 'bg-[#FAF8F5] text-[#2C5230] border-[#D3E4D5] hover:bg-[#EEF5EF]'
                                                  : isSimActive
                                                    ? 'bg-[#FDF2EE] text-[#6E2A18] border-[#C06C54] ring-2 ring-[#C06C54]/40 shadow-xs font-bold'
                                                    : 'bg-[#FAF8F5] text-[#8C3A24] border-[#F0D5CD] hover:bg-[#FDF2EE]'
                                              }`}
                                            >
                                              <span>{isSimPositive ? '✓' : '✕'}</span>
                                              <span>Sim</span>
                                            </button>

                                            {/* 2. [Não] Button */}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                recordChoiceResponse(q.id, selectedDate, 'nao')
                                              }
                                              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1 ${
                                                !isSimPositive
                                                  ? isNaoActive
                                                    ? 'bg-[#EEF5EF] text-[#1E3B21] border-[#7D9D7F] ring-2 ring-[#7D9D7F]/40 shadow-xs font-bold'
                                                    : 'bg-[#FAF8F5] text-[#2C5230] border-[#D3E4D5] hover:bg-[#EEF5EF]'
                                                  : isNaoActive
                                                    ? 'bg-[#FDF2EE] text-[#6E2A18] border-[#C06C54] ring-2 ring-[#C06C54]/40 shadow-xs font-bold'
                                                    : 'bg-[#FAF8F5] text-[#8C3A24] border-[#F0D5CD] hover:bg-[#FDF2EE]'
                                              }`}
                                            >
                                              <span>{!isSimPositive ? '✓' : '✕'}</span>
                                              <span>Não</span>
                                            </button>

                                            {/* 3. [— N/A] (Não se aplica) Button */}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                recordChoiceResponse(q.id, selectedDate, 'nao_se_aplica')
                                              }
                                              className={`py-2 px-1 rounded-xl text-[11px] font-medium border transition-all flex items-center justify-center gap-1 ${
                                                isNaActive
                                                  ? 'bg-[#EAE0D2] text-[#2C2C2C] border-[#C8B8A6] ring-2 ring-[#8C7A6B]/30 font-bold shadow-xs'
                                                  : 'bg-[#FAF8F5] text-[#5C4F44] border-[#E8DFC8] hover:bg-[#F4EDE2]'
                                              }`}
                                              title="A situação não aconteceu ou não era pertinente"
                                            >
                                              <span>—</span>
                                              <span>N/A</span>
                                            </button>

                                            {/* 4. [? Não lembro] Button */}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                recordChoiceResponse(q.id, selectedDate, 'nao_lembro')
                                              }
                                              className={`py-2 px-1 rounded-xl text-[11px] font-medium border transition-all flex items-center justify-center gap-1 ${
                                                isNaoLembroActive
                                                  ? 'bg-[#EAE0D2] text-[#2C2C2C] border-[#C8B8A6] ring-2 ring-[#8C7A6B]/30 font-bold shadow-xs'
                                                  : 'bg-[#FAF8F5] text-[#5C4F44] border-[#E8DFC8] hover:bg-[#F4EDE2]'
                                              }`}
                                              title="Não lembro ou não registrei no momento"
                                            >
                                              <span>?</span>
                                              <span>Não lembro</span>
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Shortcut to customize questions */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsManageQuestionsModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#F4EDE2] hover:bg-[#EAE0D2] text-[#5C4F44] text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4 text-[#8C7A6B]" />
                  <span>Personalizar Áreas, Grupos e Perguntas</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SEÇÃO 4: RESUMO E EVOLUÇÃO DO DIA
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('resumo')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.resumo}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-xl">
                📊
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  4. Resumo & Evolução do Dia
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Desempenho comportamental consolidado
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#2C2C2C]">
                {metrics.hasEvaluatedAnswers ? `${metrics.positivePercentage}%` : 'Sem dados'}
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                {openSections.resumo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {openSections.resumo && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-4">
              {/* Circular Gauge and Metrics Breakdown */}
              <div className="bg-[#FDFBF7] border border-[#EFE8DE] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-around gap-4">
                {/* Circular ring */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg height="112" width="112" className="transform -rotate-90">
                    <circle
                      stroke="#EFE8DE"
                      fill="transparent"
                      strokeWidth="8"
                      r="40"
                      cx="56"
                      cy="56"
                    />
                    <circle
                      stroke="#C58B68"
                      fill="transparent"
                      strokeWidth="8"
                      strokeDasharray="251.3"
                      strokeDashoffset={
                        metrics.hasEvaluatedAnswers
                          ? 251.3 - (metrics.positivePercentage / 100) * 251.3
                          : 251.3
                      }
                      strokeLinecap="round"
                      r="40"
                      cx="56"
                      cy="56"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold text-[#2C2C2C] leading-none">
                      {metrics.hasEvaluatedAnswers ? `${metrics.positivePercentage}%` : '—'}
                    </span>
                    <span className="text-[10px] font-semibold text-[#8C7A6B] mt-1">
                      Positivo
                    </span>
                  </div>
                </div>

                {/* Response Breakdown Count */}
                <div className="space-y-1.5 w-full sm:w-auto text-xs">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#3C5B3F] font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#7D9D7F]" />
                      Respostas Positivas:
                    </span>
                    <span className="font-extrabold text-[#2C2C2C]">{metrics.positivoCount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#8C3A24] font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#C06C54]" />
                      Respostas Negativas:
                    </span>
                    <span className="font-extrabold text-[#2C2C2C]">{metrics.negativoCount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#EFE8DE]">
                    <span className="text-[#8C7A6B] font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#A8988B]" />
                      Neutras (Não se aplica / Não lembro):
                    </span>
                    <span className="font-bold text-[#8C7A6B]">
                      {metrics.naoSeAplicaCount + metrics.naoLembroCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance by Area */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-[#3C3C3C]">
                  Desempenho por Área da Vida
                </h4>
                <div className="space-y-2">
                  {lifeAreas.map((area) => {
                    const areaPerf = calculateAreaPerformance(
                      area.id,
                      questionResponses.filter((r) => r.date === selectedDate),
                      questions
                    );
                    return (
                      <div
                        key={area.id}
                        className="p-3 bg-[#FDFBF7] border border-[#EFE8DE] rounded-xl space-y-1.5"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-[#2C2C2C] flex items-center gap-1.5">
                            <span>{area.icon}</span>
                            <span>{area.name}</span>
                          </span>
                          <span className="font-extrabold text-[#5C4F44]">
                            {areaPerf.hasEvaluatedAnswers
                              ? `${areaPerf.positivePercentage}% positivo`
                              : 'Sem respostas'}
                          </span>
                        </div>
                        {areaPerf.hasEvaluatedAnswers && (
                          <div className="w-full bg-[#EFE8DE] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#A87053] h-full rounded-full transition-all duration-500"
                              style={{ width: `${areaPerf.positivePercentage}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insight & Correlation Card */}
              <div className="bg-[#F7F1E6] border border-[#EAE1D1] rounded-2xl p-3.5 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#B78A58] shrink-0 mt-0.5" />
                <p className="text-xs text-[#5C4F44] leading-relaxed">
                  {selectedFactorsForDay.length > 0 ? (
                    <>
                      Fatores ativos hoje: <strong>{selectedFactorsForDay.join(', ')}</strong>. Mesmo com esses contextos, você manteve <strong>{metrics.positivePercentage}%</strong> de ações alinhadas com seus valores familiares!
                    </>
                  ) : (
                    <>
                      Seu mapa comportamental está pronto para registrar seus dias. Lembre-se: ausência de registro ou 'não se aplica' nunca diminui o seu valor nem seu progresso.
                    </>
                  )}
                </p>
              </div>

              {/* Relatórios Completo Action */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsRelatoriosModalOpen(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-[#EFE8DE] hover:bg-[#E4DACD] text-[#4A3E34] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
                >
                  <BarChart2 className="w-4 h-4 text-[#8C7A6B]" />
                  <span>Ver Relatório Geral Completo (Semanal • Mensal • Anual)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Manage Questions Modal Triggered from Header or Section 3 */}
    </div>
  );
};
