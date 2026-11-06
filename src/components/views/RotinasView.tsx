import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoutineTask } from '../../types';
import { ChevronLeft, Plus, Check, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';

export const RotinasView: React.FC = () => {
  const { setActiveTab, routineTasks, toggleRoutineTask, setActivePeriodModal } = useApp();
  const [activeSegment, setActiveSegment] = useState<'padrao' | 'dia'>('dia');

  const days = [
    { name: 'Segunda-feira', isActive: true },
    { name: 'Terça-feira', isActive: false },
    { name: 'Quarta-feira', isActive: false },
    { name: 'Quinta-feira', isActive: false },
    { name: 'Sexta-feira', isActive: false },
    { name: 'Sábado e Domingo', isActive: false }
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
        <h1 className="text-lg font-bold text-[#2C2C2C]">Minhas Rotinas</h1>
        <button
          onClick={() => setActivePeriodModal('manha')}
          className="w-8 h-8 rounded-full bg-[#8C7A6B] text-white flex items-center justify-center shadow-xs"
          title="Nova rotina"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Controller */}
      <div className="flex bg-[#F4EDE2] p-1 rounded-2xl mb-4">
        <button
          onClick={() => setActiveSegment('padrao')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSegment === 'padrao'
              ? 'bg-[#FAF8F5] text-[#2C2C2C] shadow-xs'
              : 'text-[#8C7A6B] hover:text-[#2C2C2C]'
          }`}
        >
          Rotina Padrão
        </button>
        <button
          onClick={() => setActiveSegment('dia')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSegment === 'dia'
              ? 'bg-[#FAF8F5] text-[#2C2C2C] shadow-xs'
              : 'text-[#8C7A6B] hover:text-[#2C2C2C]'
          }`}
        >
          Por Dia da Semana
        </button>
      </div>

      {/* Active Day Section */}
      <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl p-5 shadow-[0_4px_20px_rgba(140,122,107,0.05)] mb-3">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EFE8DE]/60">
          <h2 className="text-sm font-bold text-[#2C2C2C]">Segunda-feira</h2>
          <span className="text-[11px] font-bold text-[#5C4F44] bg-[#EAE0D2] px-2.5 py-1 rounded-full">
            Rotina ativa
          </span>
        </div>

        <div className="space-y-2.5">
          {routineTasks.map((task: RoutineTask) => (
            <div
              key={task.id}
              onClick={() => toggleRoutineTask(task.id)}
              className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
                task.completed
                  ? 'bg-[#F2ECE2] border-[#DDD3C5] opacity-75'
                  : 'bg-[#F7F4EE] border-[#EAE3D6] hover:bg-[#F3ECE0]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                    task.completed
                      ? 'bg-[#8C7A6B] border-[#8C7A6B] text-white'
                      : 'border-[#C4B6A6] bg-white'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      task.completed ? 'line-through text-[#8C7A6B]' : 'text-[#2C2C2C]'
                    }`}
                  >
                    {task.title}
                  </h4>
                  {task.subtitle && (
                    <p className="text-[11px] text-[#8C7A6B] mt-0.5">{task.subtitle}</p>
                  )}
                </div>
              </div>

              {task.time && (
                <span className="text-[10px] text-[#8C7A6B] bg-[#EFE8DE] px-2 py-0.5 rounded-md font-medium">
                  {task.time}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Other Days Accordion Cards */}
      <div className="space-y-2">
        {days.slice(1).map((d) => (
          <div
            key={d.name}
            className="p-4 bg-[#FAF8F5] border border-[#EFE8DE] rounded-2xl flex items-center justify-between text-xs font-bold text-[#4A3E34] hover:bg-[#F4EDE2] cursor-pointer transition-colors"
          >
            <span>{d.name}</span>
            <ChevronRight className="w-4 h-4 text-[#8C7A6B]" />
          </div>
        ))}
      </div>
    </div>
  );
};
