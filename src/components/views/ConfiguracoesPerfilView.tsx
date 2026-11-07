import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, NotificationPreferences } from '../../types';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Users,
  Bell,
  Database,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  User,
  X
} from 'lucide-react';

export const ConfiguracoesPerfilView: React.FC = () => {
  const {
    setActiveTab,
    profiles,
    currentProfile,
    switchProfile,
    updateProfileName,
    addProfile,
    deleteProfile,
    notificationPreferences,
    toggleNotificationPreference,
    exportAppData,
    importAppData,
    resetAppToDefaults,
    userEmail,
    isLoggedIn
  } = useApp();

  // Strict vertical accordion state (no horizontal tabs)
  const [openSections, setOpenSections] = useState<{
    perfis: boolean;
    notificacoes: boolean;
    dados: boolean;
  }>({
    perfis: true,
    notificacoes: true,
    dados: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // State for adding a new profile
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileRole, setNewProfileRole] = useState('Filho(a)');
  const [newProfileSubtitle, setNewProfileSubtitle] = useState('');

  // Editing profile name
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState('');

  // Toast notification
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3500);
  };

  // State for backup / import
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isResetConfirmModalOpen, setIsResetConfirmModalOpen] = useState(false);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    addProfile({
      name: newProfileName.trim(),
      role: newProfileRole.trim(),
      subtitle: newProfileSubtitle.trim() || undefined
    });

    showToast(`Perfil de ${newProfileName.trim()} criado com sucesso!`);
    setNewProfileName('');
    setNewProfileSubtitle('');
    setIsAddProfileModalOpen(false);
  };

  const handleSaveProfileName = (id: string) => {
    if (!editingNameValue.trim()) return;
    updateProfileName(id, editingNameValue.trim());
    setEditingProfileId(null);
    showToast('Nome atualizado com sucesso!');
  };

  const handleExportData = () => {
    const jsonStr = exportAppData();
    // Copy to clipboard and trigger download
    try {
      navigator.clipboard.writeText(jsonStr);
    } catch {}

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rotina_ai_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('✓ Backup baixado e copiado para a área de transferência!');
  };

  const handleImportData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;

    const ok = importAppData(importJsonText.trim());
    if (ok) {
      showToast('✓ Dados restaurados com sucesso!');
      setIsImportModalOpen(false);
      setImportJsonText('');
    } else {
      showToast('Erro: Arquivo ou formato JSON inválido.');
    }
  };

  const handleResetConfirm = () => {
    resetAppToDefaults();
    setIsResetConfirmModalOpen(false);
    showToast('✓ Dados restaurados para os padrões originais de fábrica.');
  };

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
          <h1 className="text-lg font-bold text-[#2C2C2C] tracking-tight">Configurações & Perfil</h1>
          <p className="text-[11px] text-[#8C7A6B]">Gestão familiar, lembretes e dados</p>
        </div>

        <div className="w-9 h-9" />
      </div>

      {/* Overview Card: Active Profile */}
      <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl p-5 mb-4 shadow-[0_4px_20px_rgba(140,122,107,0.05)] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EAE0D2] border border-[#D8C7B4] flex items-center justify-center text-lg font-bold text-[#5C4F44] shadow-xs">
            {currentProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                {currentProfile.name}
              </h2>
              <span className="text-[10px] font-bold text-[#5C4F44] bg-[#EAE0D2] px-2 py-0.5 rounded-full">
                Perfil Ativo
              </span>
            </div>
            <p className="text-xs text-[#8C7A6B]">
              {currentProfile.role} • {isLoggedIn ? userEmail : 'Armazenamento Local'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddProfileModalOpen(true)}
          className="text-xs font-bold text-[#8C7A6B] hover:text-[#5C4F44] flex items-center gap-1 bg-[#F4EDE2] hover:bg-[#EAE0D2] px-3 py-1.5 rounded-xl transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Membro</span>
        </button>
      </div>

      {/* STRICTLY VERTICAL ACCORDION STRUCTURE (NO HORIZONTAL TABS) */}
      <div className="space-y-4">
        {/* ========================================================
            ACORDEÃO 1: GESTÃO DE PERFIL FAMILIAR
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('perfis')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.perfis}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-lg text-[#B78A58]">
                <Users className="w-5 h-5 text-[#B78A58]" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  1. Perfis da Família
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Brenda, Bryan, Benício, Lucas e novos membros
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8C7A6B] bg-[#F4EDE2] px-2.5 py-1 rounded-full">
                {profiles.length} membros
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                {openSections.perfis ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {openSections.perfis && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-[#4A3E34]">
                  Selecione quem está usando o app:
                </span>
                <button
                  onClick={() => setIsAddProfileModalOpen(true)}
                  className="text-xs font-bold text-[#8C7A6B] hover:text-[#5C4F44] flex items-center gap-1 bg-[#F4EDE2] px-2.5 py-1 rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Membro</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {profiles.map((p) => {
                  const isSelected = p.id === currentProfile.id;
                  const isEditing = editingProfileId === p.id;

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-white border-[#8C7A6B] shadow-2xs'
                          : 'bg-[#FAF8F5] border-[#EFE8DE] hover:bg-[#F9F6F1]'
                      }`}
                    >
                      <div
                        onClick={() => !isEditing && switchProfile(p.id)}
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                            isSelected
                              ? 'bg-[#8C7A6B] text-white shadow-2xs'
                              : 'bg-[#EAE0D2] text-[#5C4F44]'
                          }`}
                        >
                          {p.name.charAt(0)}
                        </div>

                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editingNameValue}
                                onChange={(e) => setEditingNameValue(e.target.value)}
                                className="bg-white border border-[#8C7A6B] rounded-lg px-2 py-1 text-xs font-bold text-[#2C2C2C] focus:outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveProfileName(p.id)}
                                className="p-1 bg-[#8C7A6B] text-white rounded-lg text-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingProfileId(null)}
                                className="p-1 bg-[#F4EDE2] text-[#5C4F44] rounded-lg text-xs"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xs sm:text-sm font-bold text-[#2C2C2C] truncate">
                                  {p.name}
                                </h3>
                                {p.isPrimary && (
                                  <span className="text-[9px] font-bold text-[#8C7A6B] bg-[#F4EDE2] px-1.5 py-0.5 rounded-md">
                                    Principal
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#8C7A6B] truncate">
                                {p.role} {p.subtitle ? `• ${p.subtitle}` : ''}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected ? (
                          <span className="text-[10px] font-bold text-[#2C5230] bg-[#EEF5EF] px-2.5 py-1 rounded-full border border-[#B7D2B9]">
                            ✓ Em uso
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => switchProfile(p.id)}
                            className="text-xs font-semibold text-[#8C7A6B] hover:text-[#5C4F44] bg-[#F4EDE2] px-2.5 py-1 rounded-xl transition-colors"
                          >
                            Alternar
                          </button>
                        )}

                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProfileId(p.id);
                              setEditingNameValue(p.name);
                            }}
                            className="p-1.5 text-[#8C7A6B] hover:text-[#5C4F44] hover:bg-[#F4EDE2] rounded-lg transition-colors text-xs"
                            title="Editar nome"
                          >
                            ✏️
                          </button>
                        )}

                        {!p.isPrimary && profiles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteProfile(p.id)}
                            className="p-1.5 text-[#B4A597] hover:text-[#8C3A24] rounded-lg hover:bg-[#FDF2EE] transition-colors"
                            title="Remover perfil"
                            aria-label={`Remover perfil de ${p.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            ACORDEÃO 2: PREFERÊNCIAS DE NOTIFICAÇÕES & LEMBRETES
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('notificacoes')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.notificacoes}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-lg text-[#B78A58]">
                <Bell className="w-5 h-5 text-[#B78A58]" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  2. Notificações & Lembretes
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Alertas de rotinas, agenda e reflexão diária
                </p>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
              {openSections.notificacoes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {openSections.notificacoes && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-3">
              {/* Setting 1: Rotinas */}
              <div className="p-3.5 bg-white border border-[#EFE8DE] rounded-2xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#2C2C2C]">
                    Lembretes de Rotinas Matinais e Noturnas
                  </h4>
                  <p className="text-[11px] text-[#8C7A6B] mt-0.5">
                    Avisos pontuais (pente fino, suplemento, esfoliação corporal).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotificationPreference('routineReminders')}
                  className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                    notificationPreferences.routineReminders ? 'bg-[#8C7A6B]' : 'bg-[#DDD3C5]'
                  }`}
                  aria-label="Alternar lembretes de rotinas"
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                      notificationPreferences.routineReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Setting 2: Agenda */}
              <div className="p-3.5 bg-white border border-[#EFE8DE] rounded-2xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#2C2C2C]">
                    Alertas da Agenda (15 min antes)
                  </h4>
                  <p className="text-[11px] text-[#8C7A6B] mt-0.5">
                    Notificações antes de futebol, aniversários e compromissos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotificationPreference('agendaReminders')}
                  className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                    notificationPreferences.agendaReminders ? 'bg-[#8C7A6B]' : 'bg-[#DDD3C5]'
                  }`}
                  aria-label="Alternar alertas da agenda"
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                      notificationPreferences.agendaReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Setting 3: Meu Mapa Noturno */}
              <div className="p-3.5 bg-white border border-[#EFE8DE] rounded-2xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#2C2C2C]">
                    Lembrete Noturno do Meu Mapa (21:00)
                  </h4>
                  <p className="text-[11px] text-[#8C7A6B] mt-0.5">
                    Convite gentil para reflexão do humor e hábitos do dia.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotificationPreference('mapaDailyReminder')}
                  className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                    notificationPreferences.mapaDailyReminder ? 'bg-[#8C7A6B]' : 'bg-[#DDD3C5]'
                  }`}
                  aria-label="Alternar lembrete diário do mapa"
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                      notificationPreferences.mapaDailyReminder ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Setting 4: Alertas Sonoros */}
              <div className="p-3.5 bg-white border border-[#EFE8DE] rounded-2xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#2C2C2C]">
                    Sons Suaves de Notificação
                  </h4>
                  <p className="text-[11px] text-[#8C7A6B] mt-0.5">
                    Chimes delicados que não perturbam o descanso da família.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotificationPreference('soundAlerts')}
                  className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                    notificationPreferences.soundAlerts ? 'bg-[#8C7A6B]' : 'bg-[#DDD3C5]'
                  }`}
                  aria-label="Alternar alertas sonoros"
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                      notificationPreferences.soundAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            ACORDEÃO 3: DADOS, BACKUP & LIMPEZA LOCAL
           ======================================================== */}
        <div className="bg-[#FAF8F5] border border-[#EFE8DE] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(140,122,107,0.05)] transition-all">
          <button
            onClick={() => toggleSection('dados')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
            aria-expanded={openSections.dados}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F7EEE3] flex items-center justify-center text-lg text-[#B78A58]">
                <Database className="w-5 h-5 text-[#B78A58]" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                  3. Gestão de Dados & Segurança
                </h2>
                <p className="text-xs text-[#8C7A6B]">
                  Exportar relatórios, backup, restauração e privacidade
                </p>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
              {openSections.dados ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {openSections.dados && (
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#EFE8DE]/60 space-y-3">
              <div className="bg-[#F7F2EA] p-3.5 rounded-2xl border border-[#ECE3D5] flex items-start gap-2.5 text-xs text-[#5C4F44]">
                <ShieldCheck className="w-4 h-4 text-[#8C7A6B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#4A3E34]">Armazenamento Privado e Seguro</p>
                  <p className="text-[11px] text-[#6E5D4F] mt-0.5 leading-relaxed">
                    Todas as informações da sua família ficam salvas localmente no navegador e são sincronizadas em tempo real. Você é dona absoluta dos seus dados.
                  </p>
                </div>
              </div>

              {/* Data actions */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="w-full p-3.5 bg-white hover:bg-[#FDFBF7] border border-[#EFE8DE] rounded-2xl flex items-center justify-between text-left text-xs transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-[#2C2C2C] block">Fazer Backup Completo (Exportar JSON)</span>
                      <span className="text-[11px] text-[#8C7A6B]">Baixa arquivo com histórico, rotinas e mapa</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#8C7A6B]">Baixar &gt;</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="w-full p-3.5 bg-white hover:bg-[#FDFBF7] border border-[#EFE8DE] rounded-2xl flex items-center justify-between text-left text-xs transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#F4EDE2] flex items-center justify-center text-[#8C7A6B]">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-[#2C2C2C] block">Restaurar Cópia de Segurança</span>
                      <span className="text-[11px] text-[#8C7A6B]">Carregar dados a partir de arquivo JSON</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#8C7A6B]">Restaurar &gt;</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsResetConfirmModalOpen(true)}
                  className="w-full p-3.5 bg-white hover:bg-[#FDF2EE] border border-[#EFE8DE] rounded-2xl flex items-center justify-between text-left text-xs transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#FDF2EE] flex items-center justify-center text-[#8C3A24]">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-[#8C3A24] block">Limpeza & Restaurar Padrões de Fábrica</span>
                      <span className="text-[11px] text-[#A85B48]">Reinicia os dados familiares para o modelo inicial</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#8C3A24]">Limpar &gt;</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Adicionar Membro da Família */}
      {isAddProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-5 shadow-2xl border border-[#EFE8DE] space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F7EEE3] flex items-center justify-center text-[#8C7A6B]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2C2C2C]">Novo Membro da Família</h3>
                  <p className="text-[11px] text-[#8C7A6B]">Crie um perfil para acompanhar a rotina</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddProfileModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#5C4F44]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                  Nome do membro:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Beatriz, Vovó Maria, Tia Clara..."
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Papel familiar:
                  </label>
                  <select
                    value={newProfileRole}
                    onChange={(e) => setNewProfileRole(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#2C2C2C] focus:outline-none"
                  >
                    <option value="Mãe">Mãe</option>
                    <option value="Pai">Pai</option>
                    <option value="Filho">Filho</option>
                    <option value="Filha">Filha</option>
                    <option value="Bebê">Bebê</option>
                    <option value="Avó/Avô">Avó / Avô</option>
                    <option value="Outro">Outro familiar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                    Detalhe / Idade:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 5 anos • Carinhosa"
                    value={newProfileSubtitle}
                    onChange={(e) => setNewProfileSubtitle(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs text-[#2C2C2C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8C7A6B] hover:bg-[#786657] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Salvar Perfil
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddProfileModalOpen(false)}
                  className="px-4 py-2.5 bg-[#F4EDE2] hover:bg-[#EAE0D2] text-[#5C4F44] text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Restaurar Cópia de Segurança */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-5 shadow-2xl border border-[#EFE8DE] space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F7EEE3] flex items-center justify-center text-[#8C7A6B]">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2C2C2C]">Restaurar Cópia de Segurança</h3>
                  <p className="text-[11px] text-[#8C7A6B]">Cole o conteúdo do arquivo JSON de backup</p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4EDE2] flex items-center justify-center text-[#5C4F44]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportData} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4A3E34] mb-1">
                  Conteúdo JSON:
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Cole aqui o texto JSON exportado anteriormente..."
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full bg-white border border-[#EFE8DE] rounded-xl p-3 text-xs text-[#2C2C2C] font-mono focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8C7A6B] hover:bg-[#786657] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Confirmar Restauração
                </button>
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2.5 bg-[#F4EDE2] hover:bg-[#EAE0D2] text-[#5C4F44] text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmação de Limpeza de Dados */}
      {isResetConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-5 shadow-2xl border border-[#EFE8DE] space-y-4 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2 pt-2">
              <div className="w-12 h-12 rounded-full bg-[#FDF2EE] text-[#8C3A24] flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#2C2C2C]">
                Restaurar Padrões de Fábrica?
              </h3>
              <p className="text-xs text-[#8C7A6B] leading-relaxed">
                Essa ação irá redefinir as perguntas, rotinas, tarefas e perfis para o modelo original pré-configurado.
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleResetConfirm}
                className="flex-1 py-2.5 bg-[#8C3A24] hover:bg-[#722F1D] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Sim, Limpar e Restaurar
              </button>
              <button
                type="button"
                onClick={() => setIsResetConfirmModalOpen(false)}
                className="px-4 py-2.5 bg-[#F4EDE2] hover:bg-[#EAE0D2] text-[#5C4F44] text-xs font-semibold rounded-xl"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
