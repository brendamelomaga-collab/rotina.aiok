import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, Bot, Sparkles, Check, CheckCircle2 } from 'lucide-react';

interface QuestionProposal {
  areaName: string;
  groupName: string;
  title: string;
  habitType: 'bom' | 'ruim';
  status: 'pending' | 'saved' | 'cancelled';
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  proposal?: QuestionProposal;
}

export const AiAssistantModal: React.FC = () => {
  const {
    isAiChatOpen,
    setIsAiChatOpen,
    currentProfile,
    routineTasks,
    agendaItems,
    addQuestionFromAi
  } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: `Oi, ${currentProfile.name}! Como posso ajudar a tornar seu dia mais leve e organizado hoje? Você também pode me pedir para criar novas perguntas e hábitos para o seu Meu Mapa! ✨`,
      time: 'Agora'
    }
  ]);

  if (!isAiChatOpen) return null;

  const quickPrompts = [
    'O que tenho para fazer hoje?',
    "Cria pergunta no Mapa: 'Gritei com as crianças?', onde o Sim é negativo",
    'Como foi meu mês?',
    "Cria pergunta: 'Preparei o almoço no horário?', onde Sim é positivo"
  ];

  const parseQuestionIntent = (query: string): QuestionProposal | null => {
    const lower = query.toLowerCase();
    const isCreateIntent =
      lower.includes('cria uma pergunta') ||
      lower.includes('criar pergunta') ||
      lower.includes('cria pergunta') ||
      lower.includes('cadastra uma pergunta') ||
      lower.includes('adicionar pergunta') ||
      lower.includes('adiciona pergunta') ||
      (lower.includes('pergunta') && (lower.includes('sim é negativo') || lower.includes('sim é positivo') || lower.includes('sim é bom') || lower.includes('sim é ruim')));

    if (!isCreateIntent) return null;

    // 1. Rule determination
    const isNegativeHabit =
      lower.includes('negativo') ||
      lower.includes('ruim') ||
      lower.includes('evitar') ||
      lower.includes('perdi a paciência') ||
      lower.includes('gritei');
    const habitType: 'bom' | 'ruim' = isNegativeHabit ? 'ruim' : 'bom';

    // 2. Extract Question Title (inside quotes, or after colon, or question mark)
    let title = '';
    const quoteMatch = query.match(/['"“](.+?)['"”]/);
    if (quoteMatch && quoteMatch[1]) {
      title = quoteMatch[1].trim();
    } else {
      const qmarkMatch = query.match(/([^:.,\n]+\?)/);
      if (qmarkMatch && qmarkMatch[1]) {
        title = qmarkMatch[1].trim();
      } else if (lower.includes('gritei')) {
        title = 'Gritei com as crianças?';
      } else if (lower.includes('almoço')) {
        title = 'Preparei o almoço no horário?';
      } else {
        title = 'Consegui manter a paciência hoje?';
      }
    }
    if (!title.endsWith('?')) title += '?';

    // 3. Extract Area
    let areaName = 'Maternidade';
    const areaMatch = query.match(/área(?:\s+de)?\s+([A-Za-zÀ-ÖØ-öø-ÿ\s&]+?)(?:,|$|\sgrupo|\spergunta|:)/i);
    if (areaMatch && areaMatch[1]) {
      const cleanArea = areaMatch[1].trim();
      if (cleanArea.length > 2) areaName = cleanArea;
    } else if (lower.includes('alimentação') || lower.includes('almoço') || lower.includes('jantar')) {
      areaName = 'Alimentação da Casa';
    } else if (lower.includes('casa') || lower.includes('organização')) {
      areaName = 'Organização da Casa';
    } else if (lower.includes('emocional') || lower.includes('mente')) {
      areaName = 'Meu Emocional';
    }

    // 4. Extract Group
    let groupName = 'Meu Comportamento';
    const groupMatch = query.match(/grupo(?:\s+de)?\s+([A-Za-zÀ-ÖØ-öø-ÿ\s&]+?)(?:,|$|\spergunta|:|onde)/i);
    if (groupMatch && groupMatch[1]) {
      const cleanGroup = groupMatch[1].trim();
      if (cleanGroup.length > 2) groupName = cleanGroup;
    } else if (lower.includes('almoço') || lower.includes('comida')) {
      groupName = 'Refeições da Família';
    } else if (lower.includes('sono')) {
      groupName = 'Atenção & Sono';
    }

    return {
      areaName,
      groupName,
      title,
      habitType,
      status: 'pending'
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Check for question creation command via natural language
    const proposal = parseQuestionIntent(query);

    setTimeout(() => {
      let reply = '';
      const lower = query.toLowerCase();

      if (proposal) {
        reply = `Entendido perfeitamente, ${currentProfile.name}! Preparei a configuração desta nova pergunta para o seu Meu Mapa. Por favor, confira os detalhes abaixo e confirme:`;
      } else if (lower.includes('hoje') || lower.includes('fazer')) {
        const remainingRoutines = routineTasks.filter((t) => !t.completed).length;
        const nextAgenda = agendaItems[0]?.title || 'Futebol das crianças';
        reply = `Hoje você tem ${remainingRoutines} atividades na sua lista de rotinas (lembrando da esfoliação corporal à noite!) e o próximo compromisso da agenda é "${nextAgenda}". Respire fundo, você está fazendo um ótimo trabalho com o Bryan e o Benício! 💛`;
      } else if (lower.includes('lembre') || lower.includes('importante')) {
        reply = `Lembrete especial: Não se esqueça de reservar 15 minutos para você mesma no final da tarde, além de dar os suplementos das crianças às 09:00. Pequenas pausas transformam o seu dia. ✨`;
      } else if (lower.includes('mês') || lower.includes('mapa')) {
        reply = `Seu mapa registrou 78% de momentos positivos este mês! Notamos que os dias com sono regulado e tempo de qualidade em família foram os mais felizes. Parabéns pela dedicação diária.`;
      } else {
        reply = `Compreendo, ${currentProfile.name}. Estou aqui para apoiar você em tudo: organizar o dia, cadastrar novos hábitos no Meu Mapa ou aliviar sua carga mental. Como prefere prosseguir?`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        proposal: proposal || undefined
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  const handleConfirmProposal = (msgId: string, proposal: QuestionProposal) => {
    addQuestionFromAi({
      areaName: proposal.areaName,
      groupName: proposal.groupName,
      title: proposal.title,
      habitType: proposal.habitType
    });

    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.proposal
          ? { ...m, proposal: { ...m.proposal, status: 'saved' } }
          : m
      )
    );

    // AI confirms saving
    setTimeout(() => {
      const confirmMsg: ChatMessage = {
        id: `ai-confirm-${Date.now()}`,
        sender: 'ai',
        text: `Prontinho! A pergunta "${proposal.title}" foi cadastrada com sucesso na área "${proposal.areaName}" > "${proposal.groupName}". Você já pode visualizá-la e registrar suas respostas no Meu Mapa! 🌿`,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, confirmMsg]);
    }, 400);
  };

  const handleCancelProposal = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.proposal
          ? { ...m, proposal: { ...m.proposal, status: 'cancelled' } }
          : m
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-5 shadow-2xl border border-[#EFE8DE] h-[90vh] flex flex-col justify-between animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DE]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4EDE2] flex items-center justify-center text-[#B78A58]">
              <Bot className="w-5 h-5 text-[#8C7A6B]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2C2C2C] flex items-center gap-1.5">
                <span>Assistente IA</span>
                <Sparkles className="w-3.5 h-3.5 text-[#B78A58]" />
              </h2>
              <p className="text-xs text-[#8C7A6B]">Gestão Inteligente de Rotinas & Hábitos</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiChatOpen(false)}
            className="w-8 h-8 rounded-full bg-[#F4EDE2] hover:bg-[#EAE0D2] flex items-center justify-center text-[#5C4F44]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {/* Friendly Robot Avatar */}
          <div className="flex flex-col items-center justify-center py-2 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#F4EDE2] border border-[#E8DFC8] flex items-center justify-center shadow-xs">
              <span className="text-3xl">🤖</span>
            </div>
            <p className="text-xs font-bold text-[#4A3E34] mt-2">
              Rotina.ai Inteligência Familiar
            </p>
          </div>

          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isAi
                      ? 'bg-[#FAF8F5] text-[#2C2C2C] border border-[#EFE8DE] shadow-xs'
                      : 'bg-[#8C7A6B] text-white shadow-xs'
                  }`}
                >
                  {m.text}

                  {/* Interactive Question Creation Confirmation Card */}
                  {m.proposal && (
                    <div className="mt-3 bg-white border border-[#EFE8DE] rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#5C4F44] border-b border-[#EFE8DE] pb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#B78A58]" />
                        <span>Novo Indicador Proposto</span>
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        <div>
                          <span className="text-[#8C7A6B]">Área: </span>
                          <strong className="text-[#2C2C2C]">{m.proposal.areaName}</strong>
                        </div>
                        <div>
                          <span className="text-[#8C7A6B]">Grupo: </span>
                          <strong className="text-[#2C2C2C]">{m.proposal.groupName}</strong>
                        </div>
                        <div>
                          <span className="text-[#8C7A6B]">Pergunta: </span>
                          <strong className="text-[#2C2C2C]">{m.proposal.title}</strong>
                        </div>
                        <div>
                          <span className="text-[#8C7A6B]">Regra: </span>
                          {m.proposal.habitType === 'ruim' ? (
                            <span className="font-bold text-[#8C3A24] bg-[#FDF2EE] px-2 py-0.5 rounded-full border border-[#E8C2B8]">
                              Comportamento a Evitar • [Sim] é Negativo
                            </span>
                          ) : (
                            <span className="font-bold text-[#2C5230] bg-[#EEF5EF] px-2 py-0.5 rounded-full border border-[#B7D2B9]">
                              Hábito Desejável • [Sim] é Positivo
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons on proposal */}
                      {m.proposal.status === 'pending' && (
                        <div className="flex gap-2 pt-1 border-t border-[#EFE8DE]">
                          <button
                            type="button"
                            onClick={() => handleConfirmProposal(m.id, m.proposal!)}
                            className="flex-1 py-2 px-2.5 rounded-xl bg-[#8C7A6B] hover:bg-[#786657] text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirmar e Salvar no Mapa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelProposal(m.id)}
                            className="py-2 px-2.5 rounded-xl bg-[#F4EDE2] hover:bg-[#EAE0D2] text-[#6E5D4F] text-[11px] transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}

                      {m.proposal.status === 'saved' && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2C5230] pt-1">
                          <CheckCircle2 className="w-4 h-4 text-[#7D9D7F]" />
                          <span>Cadastrado no Meu Mapa!</span>
                        </div>
                      )}

                      {m.proposal.status === 'cancelled' && (
                        <div className="text-[11px] text-[#8C7A6B] pt-1 italic">
                          Proposta cancelada.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-[#A8988B] mt-1 px-1">{m.time}</span>
              </div>
            );
          })}
        </div>

        {/* Quick prompt suggestions */}
        <div className="pt-2 pb-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#F4EDE2] hover:bg-[#EAE0D2] text-[#5C4F44] text-[11px] font-semibold transition-colors shrink-0 max-w-[260px] truncate"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="pt-2 border-t border-[#EFE8DE]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ex: Cria uma pergunta: Gritei com as crianças? Onde Sim é negativo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#FAF8F5] border border-[#EFE8DE] rounded-2xl px-4 py-3 text-xs text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] placeholder:text-[#A8988B]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-11 h-11 rounded-2xl bg-[#8C7A6B] hover:bg-[#786657] disabled:opacity-50 text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
