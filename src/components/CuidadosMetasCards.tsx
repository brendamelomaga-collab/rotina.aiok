import React from 'react';
import { useApp } from '../context/AppContext';
import { Pill, Target, ChevronRight } from 'lucide-react';
import { calculateHealthCompliance, calculateGoalSummary } from '../utils/routineCalculations';

export const CuidadosMetasCards: React.FC = () => {
  const { healthItems, goals, setIsMaisDrawerOpen } = useApp();

  const { percent: healthPercent } = calculateHealthCompliance(healthItems);
  const { completed, total, averageProgress } = calculateGoalSummary(goals);

  return (
    <section className="w-full max-w-xl mx-auto px-4 sm:px-6 my-3.5 select-none">
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Cuidados e Saúde */}
        <div
          onClick={() => setIsMaisDrawerOpen(true)}
          className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl p-4 shadow-[0_4px_20px_rgba(140,122,107,0.05)] hover:shadow-[0_6px_24px_rgba(140,122,107,0.08)] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#F7EEE3] flex items-center justify-center text-[#B78A58]">
                <Pill className="w-4 h-4 text-[#B78A58]" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C7A6B]" />
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-[#2C2C2C] leading-snug">
              Cuidados e Saúde
            </h3>
            <p className="text-[10px] text-[#8C7A6B] mt-0.5 line-clamp-1">
              Medicamentos e suplementos
            </p>
          </div>

          <div className="mt-3.5 pt-2 border-t border-[#EFE8DE]/60 flex items-center gap-2">
            {/* Soft terracotta ring */}
            <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 transform -rotate-90">
                <circle
                  stroke="#EFE8DE"
                  strokeWidth="3"
                  fill="transparent"
                  r="10"
                  cx="14"
                  cy="14"
                />
                <circle
                  stroke="#B78A58"
                  strokeWidth="3"
                  strokeDasharray="63"
                  strokeDashoffset={63 - (healthPercent / 100) * 63}
                  strokeLinecap="round"
                  fill="transparent"
                  r="10"
                  cx="14"
                  cy="14"
                />
              </svg>
              <span className="absolute text-[8px] font-bold text-[#5C4F44]">
                {healthPercent}%
              </span>
            </div>
            <div className="text-[10px] font-medium text-[#4A3E34] leading-tight">
              {healthPercent === 100 ? '100% Em dia' : `${healthPercent}% Feito`}
            </div>
          </div>
        </div>

        {/* Card 2: Minhas Metas */}
        <div
          onClick={() => setIsMaisDrawerOpen(true)}
          className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl p-4 shadow-[0_4px_20px_rgba(140,122,107,0.05)] hover:shadow-[0_6px_24px_rgba(140,122,107,0.08)] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#F7EDE4] flex items-center justify-center text-[#9E6C52]">
                <Target className="w-4 h-4 text-[#9E6C52]" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C7A6B]" />
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-[#2C2C2C] leading-snug">
              Minhas Metas
            </h3>
            <p className="text-[10px] text-[#8C7A6B] mt-0.5 line-clamp-1">
              Seus objetivos
            </p>
          </div>

          <div className="mt-3.5 pt-2 border-t border-[#EFE8DE]/60 flex items-center gap-2">
            <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 transform -rotate-90">
                <circle
                  stroke="#EFE8DE"
                  strokeWidth="3"
                  fill="transparent"
                  r="10"
                  cx="14"
                  cy="14"
                />
                <circle
                  stroke="#9E6C52"
                  strokeWidth="3"
                  strokeDasharray="63"
                  strokeDashoffset={63 - (averageProgress / 100) * 63}
                  strokeLinecap="round"
                  fill="transparent"
                  r="10"
                  cx="14"
                  cy="14"
                />
              </svg>
              <span className="absolute text-[8px] font-bold text-[#5C4F44]">
                {averageProgress}%
              </span>
            </div>
            <div className="text-[10px] font-medium text-[#4A3E34] leading-tight">
              {completed} de {total} metas
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
