import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  MoodEntry,
  MoodValue,
  AgendaItem,
  RoutineTask,
  PeriodKey,
  ContextualReminder,
  HealthMedication,
  GoalItem,
  RecurringTaskItem,
  AppNotification,
  DayPeriod,
  MoodType,
  MoodRecord,
  QuestionResponseValue,
  LifeArea,
  QuestionGroup,
  QuestionItem,
  QuestionResponse,
  QuestionChoice,
  NavTab,
  MonthlyReviewData,
  TaskExecutionRecord,
  NotificationPreferences
} from '../types';
import { resolveResponseValue } from '../utils/routineCalculations';

interface AppContextType {
  // Profiles
  profiles: UserProfile[];
  currentProfile: UserProfile;
  switchProfile: (profileId: string) => void;
  updateProfileName: (profileId: string, name: string) => void;
  addProfile: (profile: Omit<UserProfile, 'id'>) => void;
  deleteProfile: (id: string) => void;

  // Preferences & Data
  notificationPreferences: NotificationPreferences;
  toggleNotificationPreference: (key: keyof NotificationPreferences) => void;
  exportAppData: () => string;
  importAppData: (jsonString: string) => boolean;
  resetAppToDefaults: () => void;

  // Date selection
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Meu Mapa & Mood
  moodEntries: MoodEntry[];
  currentMood: MoodEntry | null;
  saveMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
  quickLogMood: (value: MoodValue, label: string) => void;

  // Meu Mapa (Parte 2: Complete Domain)
  moodRecords: MoodRecord[];
  savePeriodMood: (record: Omit<MoodRecord, 'id' | 'timestamp'>) => void;
  getMoodRecordsForDate: (date: string) => MoodRecord[];

  availableFactors: string[];
  addCustomFactor: (factor: string) => void;
  dayFactors: Record<string, string[]>;
  toggleDayFactor: (date: string, factor: string) => void;

  dayNotes: Record<string, string>;
  setDayNotesForDate: (date: string, notes: string) => void;

  lifeAreas: LifeArea[];
  createLifeArea: (name: string, icon?: string) => void;
  updateLifeArea: (id: string, name: string, icon?: string) => void;
  deleteLifeArea: (id: string) => void;
  reorderArea: (id: string, direction: 'up' | 'down') => void;

  questionGroups: QuestionGroup[];
  createQuestionGroup: (areaId: string, name: string) => void;
  updateQuestionGroup: (id: string, name: string) => void;
  deleteQuestionGroup: (id: string) => void;
  reorderGroup: (id: string, direction: 'up' | 'down') => void;

  questions: QuestionItem[];
  createQuestion: (question: Omit<QuestionItem, 'id'>) => void;
  updateQuestion: (id: string, updates: Partial<QuestionItem>) => void;
  deleteQuestion: (id: string) => void;
  duplicateQuestion: (id: string) => void;
  reorderQuestion: (id: string, direction: 'up' | 'down') => void;
  addQuestionFromAi: (data: {
    areaName: string;
    groupName: string;
    title: string;
    habitType: 'bom' | 'ruim';
    positiveIf?: 'sim' | 'nao';
    frequency?: 'todos_os_dias';
  }) => QuestionItem;

  questionResponses: QuestionResponse[];
  setQuestionResponse: (
    questionId: string,
    date: string,
    value: QuestionResponseValue,
    note?: string
  ) => void;
  recordChoiceResponse: (
    questionId: string,
    date: string,
    choice: QuestionChoice,
    note?: string
  ) => void;
  getQuestionResponse: (questionId: string, date: string) => QuestionResponse | undefined;

  isManageQuestionsModalOpen: boolean;
  setIsManageQuestionsModalOpen: (open: boolean) => void;
  isRelatoriosModalOpen: boolean;
  setIsRelatoriosModalOpen: (open: boolean) => void;

  // Agenda
  agendaItems: AgendaItem[];
  addAgendaItem: (item: Omit<AgendaItem, 'id' | 'completed'>) => void;
  toggleAgendaItem: (id: string) => void;
  deleteAgendaItem: (id: string) => void;

  // Rotinas
  routineTasks: RoutineTask[];
  toggleRoutineTask: (id: string) => void;
  addRoutineTask: (task: Omit<RoutineTask, 'id' | 'completed'>) => void;
  activePeriodModal: PeriodKey | null;
  setActivePeriodModal: (period: PeriodKey | null) => void;

  // Contextual Reminders
  contextualReminders: ContextualReminder[];
  dismissContextualReminder: (id: string) => void;

  // Cuidados & Saúde
  healthItems: HealthMedication[];
  toggleHealthItem: (id: string) => void;
  addHealthItem: (item: Omit<HealthMedication, 'id' | 'confirmed'>) => void;
  deleteHealthItem: (id: string) => void;

  // Metas
  goals: GoalItem[];
  toggleGoalStep: (goalId: string, stepId: string) => void;
  addGoal: (goal: Omit<GoalItem, 'id' | 'progressPercent' | 'completedSteps' | 'totalSteps'>) => void;
  deleteGoal: (id: string) => void;

  // Tarefas Recorrentes
  recurringTasks: RecurringTaskItem[];
  recurringHistory: TaskExecutionRecord[];
  completeRecurringTask: (id: string) => void;
  addRecurringTask: (task: Omit<RecurringTaskItem, 'id' | 'status'>) => void;
  deleteRecurringTask: (id: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Modals & Navigation
  isMaisDrawerOpen: boolean;
  setIsMaisDrawerOpen: (open: boolean) => void;
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  isMoodModalOpen: boolean;
  setIsMoodModalOpen: (open: boolean) => void;
  isAgendaModalOpen: boolean;
  setIsAgendaModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // User Auth State
  userEmail: string;
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const STORAGE_KEY = 'rotina_ai_app_data_v2';

const defaultProfiles: UserProfile[] = [
  {
    id: 'p1',
    name: 'Brenda',
    role: 'Mãe',
    subtitle: 'Administradora da Família',
    isPrimary: true
  },
  {
    id: 'p2',
    name: 'Bryan',
    role: 'Filho (6 anos)',
    subtitle: 'Ruivo alegre e esperto'
  },
  {
    id: 'p3',
    name: 'Benício',
    role: 'Filho (3 anos)',
    subtitle: 'Moreno carinhoso e curioso'
  },
  {
    id: 'p4',
    name: 'Lucas',
    role: 'Pai / Cônjuge',
    subtitle: 'Parceiro de rotina'
  }
];

const defaultNotificationPreferences: NotificationPreferences = {
  routineReminders: true,
  agendaReminders: true,
  mapaDailyReminder: true,
  soundAlerts: true
};

const defaultLifeAreas: LifeArea[] = [
  { id: 'area-maternidade', name: 'Maternidade', icon: '👶', order: 1 },
  { id: 'area-emocional', name: 'Meu Emocional', icon: '💖', order: 2 },
  { id: 'area-casa', name: 'Organização da Casa', icon: '🏠', order: 3 },
  { id: 'area-saude', name: 'Saúde & Autocuidado', icon: '🌿', order: 4 },
  { id: 'area-financas', name: 'Finanças & Família', icon: '💰', order: 5 }
];

const defaultQuestionGroups: QuestionGroup[] = [
  { id: 'grp-mae-comportamento', areaId: 'area-maternidade', name: 'Meu Comportamento com os Filhos', order: 1 },
  { id: 'grp-atencao-criancas', areaId: 'area-maternidade', name: 'Atenção & Sono das Crianças', order: 2 },
  { id: 'grp-emocional-limites', areaId: 'area-emocional', name: 'Equilíbrio & Limites', order: 1 },
  { id: 'grp-casa-rotina', areaId: 'area-casa', name: 'Rotina e Harmonia do Lar', order: 1 },
  { id: 'grp-saude-habitos', areaId: 'area-saude', name: 'Hábitos do Corpo e Mente', order: 1 }
];

const defaultQuestions: QuestionItem[] = [
  {
    id: 'q-paciencia',
    groupId: 'grp-mae-comportamento',
    areaId: 'area-maternidade',
    title: 'Gritei ou perdi a paciência com as crianças?',
    habitType: 'ruim',
    positiveIf: 'nao',
    positiveLabel: 'Mantive a calma / Não gritei',
    negativeLabel: 'Perdi a paciência',
    frequency: 'todos_os_dias',
    order: 1
  },
  {
    id: 'q-tempo-afeto',
    groupId: 'grp-mae-comportamento',
    areaId: 'area-maternidade',
    title: 'Dediquei tempo exclusivo de afeto/brincadeira com os meninos?',
    habitType: 'bom',
    positiveIf: 'sim',
    positiveLabel: 'Sim, momento de conexão',
    negativeLabel: 'Não consegui hoje',
    frequency: 'todos_os_dias',
    order: 2
  },
  {
    id: 'q-sono-criancas',
    groupId: 'grp-atencao-criancas',
    areaId: 'area-maternidade',
    title: 'As crianças foram para a cama no horário estipulado?',
    habitType: 'bom',
    positiveIf: 'sim',
    positiveLabel: 'Dormiram no horário',
    negativeLabel: 'Atrasaram muito',
    frequency: 'todos_os_dias',
    order: 1
  },
  {
    id: 'q-pausa-pessoal',
    groupId: 'grp-emocional-limites',
    areaId: 'area-emocional',
    title: 'Reservei ao menos 15 minutos para mim mesma sem culpa?',
    habitType: 'bom',
    positiveIf: 'sim',
    positiveLabel: 'Sim, tive minha pausa',
    negativeLabel: 'Sem descanso pessoal',
    frequency: 'todos_os_dias',
    order: 1
  },
  {
    id: 'q-sobrecarga-emocional',
    groupId: 'grp-emocional-limites',
    areaId: 'area-emocional',
    title: 'Senti-me sobrecarregada a ponto de paralisar?',
    habitType: 'ruim',
    positiveIf: 'nao',
    positiveLabel: 'Lidei bem com o fluxo',
    negativeLabel: 'Sensação de exaustão',
    frequency: 'todos_os_dias',
    order: 2
  },
  {
    id: 'q-cozinha-noite',
    groupId: 'grp-casa-rotina',
    areaId: 'area-casa',
    title: 'A pia e bancadas ficaram limpas ao final do dia?',
    habitType: 'bom',
    positiveIf: 'sim',
    positiveLabel: 'Cozinha em ordem',
    negativeLabel: 'Acúmulo para amanhã',
    frequency: 'todos_os_dias',
    order: 1
  },
  {
    id: 'q-agua-saude',
    groupId: 'grp-saude-habitos',
    areaId: 'area-saude',
    title: 'Bebi pelo menos 2 litros de água ao longo do dia?',
    habitType: 'bom',
    positiveIf: 'sim',
    positiveLabel: 'Hidratação em dia',
    negativeLabel: 'Pouca água',
    frequency: 'todos_os_dias',
    order: 1
  }
];

const defaultQuestionResponses: QuestionResponse[] = [
  { id: 'qr-1', questionId: 'q-paciencia', date: '2026-11-16', value: 'positivo', updatedAt: '2026-11-16T10:00:00Z' },
  { id: 'qr-2', questionId: 'q-tempo-afeto', date: '2026-11-16', value: 'positivo', updatedAt: '2026-11-16T10:00:00Z' },
  { id: 'qr-3', questionId: 'q-sono-criancas', date: '2026-11-16', value: 'positivo', updatedAt: '2026-11-16T10:00:00Z' },
  { id: 'qr-4', questionId: 'q-pausa-pessoal', date: '2026-11-16', value: 'positivo', updatedAt: '2026-11-16T10:00:00Z' },
  { id: 'qr-5', questionId: 'q-sobrecarga-emocional', date: '2026-11-16', value: 'negativo', updatedAt: '2026-11-16T10:00:00Z' },
  { id: 'qr-6', questionId: 'q-cozinha-noite', date: '2026-11-16', value: 'positivo', updatedAt: '2026-11-16T10:00:00Z' },
  { id: 'qr-7', questionId: 'q-agua-saude', date: '2026-11-16', value: 'nao_se_aplica', updatedAt: '2026-11-16T10:00:00Z' }
];

const defaultAvailableFactors: string[] = [
  'Noite mal dormida',
  'Cansaço físico',
  'Sobrecarga com as crianças',
  'Preocupações financeiras',
  'Falta de tempo pessoal',
  'Discussões',
  'Dor/desconforto',
  'Dia tranquilo',
  'Passeio ao ar livre',
  'Apoio do parceiro'
];

const defaultDayFactors: Record<string, string[]> = {
  '2026-11-16': ['Dia tranquilo', 'Passeio ao ar livre']
};

const defaultMoodRecords: MoodRecord[] = [
  {
    id: 'mr-1',
    date: '2026-11-16',
    period: 'manha',
    mood: 'muito_bem',
    label: 'Muito Bem',
    intensity: 4,
    notes: 'Acordei com disposição e as crianças brincaram alegremente.',
    timestamp: '08:30'
  },
  {
    id: 'mr-2',
    date: '2026-11-16',
    period: 'tarde',
    mood: 'bem',
    label: 'Bem',
    intensity: 3,
    notes: 'Almoço nutritivo e lição de casa tranquila.',
    timestamp: '15:00'
  }
];

const defaultAgendaItems: AgendaItem[] = [
  {
    id: 'ag-1',
    title: 'Futebol das crianças',
    date: '2026-11-17',
    time: '17:00',
    displayDay: 'Terça-feira',
    isRecurring: true,
    recurrenceLabel: 'Recorrente',
    completed: false,
    category: 'esporte',
    icon: '⚽'
  },
  {
    id: 'ag-2',
    title: 'Aniversário da vovó',
    date: '2026-11-20',
    time: '19:00',
    displayDay: 'Sexta-feira',
    isRecurring: false,
    recurrenceLabel: 'Dia 20/11',
    completed: false,
    category: 'familia',
    icon: '🎂'
  },
  {
    id: 'ag-3',
    title: 'Dia de fazer as unhas e autocuidado',
    date: '2026-11-22',
    time: '14:30',
    displayDay: 'Domingo',
    isRecurring: false,
    recurrenceLabel: 'Dia 22/11',
    completed: false,
    category: 'pessoal',
    icon: '💅'
  }
];

const defaultRoutineTasks: RoutineTask[] = [
  {
    id: 'rt-1',
    title: 'Skincare matinal com protetor solar',
    subtitle: 'Autocuidado essencial',
    period: 'manha',
    completed: true,
    time: '07:30',
    iconName: 'sparkles'
  },
  {
    id: 'rt-2',
    title: 'Pente fino nas crianças',
    subtitle: 'Antes de sair para a escola',
    period: 'manha',
    completed: true,
    time: '08:00',
    iconName: 'scissors'
  },
  {
    id: 'rt-3',
    title: 'Suplemento infantil',
    subtitle: '09:00 • 1 dose com frutas',
    period: 'manha',
    completed: false,
    time: '09:00',
    iconName: 'pill'
  },
  {
    id: 'rt-4',
    title: 'Almoço nutritivo em família',
    subtitle: 'Momento de desconectar telas',
    period: 'tarde',
    completed: true,
    time: '12:30',
    iconName: 'utensils'
  },
  {
    id: 'rt-5',
    title: 'Acompanhar lição de casa do Bryan',
    subtitle: 'Incentivo e leitura diária',
    period: 'tarde',
    completed: false,
    time: '14:30',
    iconName: 'book-open'
  },
  {
    id: 'rt-6',
    title: 'Organizar a sala e brinquedos',
    subtitle: '15 minutos com as crianças',
    period: 'tarde',
    completed: false,
    time: '16:00',
    iconName: 'home'
  },
  {
    id: 'rt-7',
    title: 'Banho relaxante das crianças',
    subtitle: 'Água morna e pijama',
    period: 'noite',
    completed: false,
    time: '19:45',
    iconName: 'bath'
  },
  {
    id: 'rt-8',
    title: 'Skincare noturno',
    subtitle: 'Limpeza e hidratação profunda',
    period: 'noite',
    completed: false,
    time: '21:00',
    iconName: 'moon'
  },
  {
    id: 'rt-9',
    title: 'História e oração para dormir',
    subtitle: 'Carinho e sono tranquilo',
    period: 'noite',
    completed: false,
    time: '21:30',
    iconName: 'heart'
  },
  {
    id: 'rt-10',
    title: 'Esfoliação corporal',
    subtitle: 'Durante o banho da noite • Seg, Qua e Sex',
    period: 'especiais',
    completed: false,
    time: '20:15',
    iconName: 'sparkles'
  },
  {
    id: 'rt-11',
    title: 'Hidratação profunda capilar',
    subtitle: 'Máscara nutritiva de 20 min',
    period: 'especiais',
    completed: true,
    time: 'Domingo',
    iconName: 'smile'
  }
];

const defaultContextualReminders: ContextualReminder[] = [
  {
    id: 'cr-1',
    text: 'Hoje é dia de esfoliação corporal durante o banho da noite!',
    period: 'noite',
    active: true,
    date: '2026-11-16'
  }
];

const defaultHealthItems: HealthMedication[] = [
  {
    id: 'hm-1',
    name: 'Ômega 3',
    dosage: '1 cápsula',
    frequency: 'Todos os dias • 9h',
    memberId: 'p1',
    memberName: 'Brenda',
    time: '09:00',
    confirmed: true,
    category: 'suplemento'
  },
  {
    id: 'hm-2',
    name: 'Ferro quelato',
    dosage: '1 cápsula com suco de laranja',
    frequency: '2x por semana • Seg e Qui',
    memberId: 'p1',
    memberName: 'Brenda',
    time: '12:00',
    confirmed: true,
    category: 'medicamento'
  },
  {
    id: 'hm-3',
    name: 'Suplemento infantil multivitaminas',
    dosage: '1 dose (5ml)',
    frequency: 'Todos os dias • 9h',
    memberId: 'p2',
    memberName: 'Bryan',
    time: '09:00',
    confirmed: true,
    category: 'suplemento'
  }
];

const defaultGoals: GoalItem[] = [
  {
    id: 'g-1',
    title: 'Pintar o quarto das crianças',
    category: 'Casa',
    progressPercent: 40,
    totalSteps: 3,
    completedSteps: 1,
    status: 'em_andamento',
    dueDate: '2026-11-25',
    steps: [
      { id: 's1', text: 'Escolher a cor suave com as crianças', done: true },
      { id: 's2', text: 'Comprar material e fitas protetoras', done: false },
      { id: 's3', text: 'Pintar e organizar a nova decoração', done: false }
    ]
  },
  {
    id: 'g-2',
    title: 'Comprar roupas das crianças',
    category: 'Família',
    progressPercent: 100,
    totalSteps: 2,
    completedSteps: 2,
    status: 'concluida',
    dueDate: '2026-10-18',
    steps: [
      { id: 's4', text: 'Checar peças que não servem mais', done: true },
      { id: 's5', text: 'Comprar novos conjuntos confortáveis', done: true }
    ]
  },
  {
    id: 'g-3',
    title: 'Organizar os armários',
    category: 'Organização',
    progressPercent: 20,
    totalSteps: 4,
    completedSteps: 1,
    status: 'em_andamento',
    dueDate: '2026-11-30',
    steps: [
      { id: 's6', text: 'Separar descarte e doação', done: true },
      { id: 's7', text: 'Caixas organizadoras etiquetadas', done: false },
      { id: 's8', text: 'Roupas de cama e toalhas', done: false },
      { id: 's9', text: 'Gaveta de documentos', done: false }
    ]
  }
];

const defaultRecurringTasks: RecurringTaskItem[] = [
  {
    id: 'rec-1',
    title: 'Calibrar pneu do carro/moto',
    recurrence: 'A cada 14 dias',
    nextDate: '04/11',
    status: 'pendente',
    icon: 'wrench'
  },
  {
    id: 'rec-2',
    title: 'Lavar os sapatos e tênis das crianças',
    recurrence: 'Todo dia 15',
    nextDate: '15/11',
    status: 'hoje',
    icon: 'sparkles'
  },
  {
    id: 'rec-3',
    title: 'Trocar roupa de cama e toalhas',
    recurrence: 'Semanalmente',
    nextDate: 'Sexta-feira',
    status: 'pendente',
    icon: 'bed'
  }
];

const defaultRecurringHistory: TaskExecutionRecord[] = [
  {
    id: 'th-1',
    taskId: 'rec-1',
    taskTitle: 'Calibrar pneu do carro/moto',
    displayDate: '17/10',
    completedAt: '2026-10-17T10:00:00Z'
  },
  {
    id: 'th-2',
    taskId: 'rec-3',
    taskTitle: 'Trocar roupa de cama e toalhas',
    displayDate: '10/10',
    completedAt: '2026-10-10T09:30:00Z'
  },
  {
    id: 'th-3',
    taskId: 'rec-2',
    taskTitle: 'Lavar os sapatos e tênis das crianças',
    displayDate: '03/10',
    completedAt: '2026-10-03T15:00:00Z'
  }
];

const defaultNotifications: AppNotification[] = [
  {
    id: 'n-1',
    title: 'Lembrete de autocuidado',
    message: 'Hoje é dia de esfoliação corporal durante o banho da noite!',
    time: 'Há 25 minutos',
    read: false,
    type: 'lembrete'
  },
  {
    id: 'n-2',
    title: 'Agenda de amanhã',
    message: 'Futebol das crianças agendado para Terça-feira às 17h.',
    time: 'Há 2 horas',
    read: false,
    type: 'familia'
  },
  {
    id: 'n-3',
    title: 'Evolução da semana',
    message: 'Seu mapa registrou 80% de momentos positivos. Continue assim! 💛',
    time: 'Ontem',
    read: true,
    type: 'rotina'
  }
];

const defaultMoodEntries: MoodEntry[] = [
  {
    id: 'm-1',
    date: '2026-11-16',
    value: 'bem',
    label: 'Bem',
    factors: ['Família', 'Tempo de qualidade', 'Casa em ordem'],
    positiveScore: 80,
    timestamp: '11:00'
  },
  {
    id: 'm-2',
    date: '2026-11-15',
    value: 'otimo',
    label: 'Ótimo',
    factors: ['Passeio ao ar livre', 'Boa noite de sono'],
    positiveScore: 88,
    timestamp: '20:30'
  },
  {
    id: 'm-3',
    date: '2026-11-14',
    value: 'bem',
    label: 'Bem',
    factors: ['Crianças calmas', 'Rotina cumprida'],
    positiveScore: 75,
    timestamp: '19:00'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Profiles
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profiles`);
      return saved ? JSON.parse(saved) : defaultProfiles;
    } catch {
      return defaultProfiles;
    }
  });

  const [currentProfileId, setCurrentProfileId] = useState<string>(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_current_profile`) || 'p1';
    } catch {
      return 'p1';
    }
  });

  const [selectedDate, setSelectedDate] = useState<string>('2026-11-16');

  // Mood Entries (legacy / quick)
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_moods`);
      return saved ? JSON.parse(saved) : defaultMoodEntries;
    } catch {
      return defaultMoodEntries;
    }
  });

  // Meu Mapa (Parte 2: Domain state)
  const [moodRecords, setMoodRecords] = useState<MoodRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_mood_records`);
      return saved ? JSON.parse(saved) : defaultMoodRecords;
    } catch {
      return defaultMoodRecords;
    }
  });

  const [availableFactors, setAvailableFactors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_available_factors`);
      return saved ? JSON.parse(saved) : defaultAvailableFactors;
    } catch {
      return defaultAvailableFactors;
    }
  });

  const [dayFactors, setDayFactors] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_day_factors`);
      return saved ? JSON.parse(saved) : defaultDayFactors;
    } catch {
      return defaultDayFactors;
    }
  });

  const [dayNotes, setDayNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_day_notes`);
      return saved ? JSON.parse(saved) : { '2026-11-16': 'Dia muito agradável com as crianças.' };
    } catch {
      return {};
    }
  });

  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_life_areas`);
      return saved ? JSON.parse(saved) : defaultLifeAreas;
    } catch {
      return defaultLifeAreas;
    }
  });

  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_question_groups`);
      return saved ? JSON.parse(saved) : defaultQuestionGroups;
    } catch {
      return defaultQuestionGroups;
    }
  });

  const [questions, setQuestions] = useState<QuestionItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_questions`);
      return saved ? JSON.parse(saved) : defaultQuestions;
    } catch {
      return defaultQuestions;
    }
  });

  const [questionResponses, setQuestionResponses] = useState<QuestionResponse[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_question_responses`);
      return saved ? JSON.parse(saved) : defaultQuestionResponses;
    } catch {
      return defaultQuestionResponses;
    }
  });

  const [isManageQuestionsModalOpen, setIsManageQuestionsModalOpen] = useState(false);

  // Agenda & Rotinas
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_agenda`);
      return saved ? JSON.parse(saved) : defaultAgendaItems;
    } catch {
      return defaultAgendaItems;
    }
  });

  const [routineTasks, setRoutineTasks] = useState<RoutineTask[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_routines`);
      return saved ? JSON.parse(saved) : defaultRoutineTasks;
    } catch {
      return defaultRoutineTasks;
    }
  });

  const [contextualReminders, setContextualReminders] = useState<ContextualReminder[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reminders`);
      return saved ? JSON.parse(saved) : defaultContextualReminders;
    } catch {
      return defaultContextualReminders;
    }
  });

  const [healthItems, setHealthItems] = useState<HealthMedication[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_health`);
      return saved ? JSON.parse(saved) : defaultHealthItems;
    } catch {
      return defaultHealthItems;
    }
  });

  const [goals, setGoals] = useState<GoalItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
      return saved ? JSON.parse(saved) : defaultGoals;
    } catch {
      return defaultGoals;
    }
  });

  const [recurringTasks, setRecurringTasks] = useState<RecurringTaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_recurring`);
      return saved ? JSON.parse(saved) : defaultRecurringTasks;
    } catch {
      return defaultRecurringTasks;
    }
  });

  const [recurringHistory, setRecurringHistory] = useState<TaskExecutionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_recurring_history`);
      return saved ? JSON.parse(saved) : defaultRecurringHistory;
    } catch {
      return defaultRecurringHistory;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  });

  // Modals & tabs
  const [activeTab, setActiveTab] = useState<NavTab>('inicio');
  const [isMaisDrawerOpen, setIsMaisDrawerOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activePeriodModal, setActivePeriodModal] = useState<PeriodKey | null>(null);
  const [isRelatoriosModalOpen, setIsRelatoriosModalOpen] = useState(false);

  // Preferences
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notif_prefs`);
      return saved ? JSON.parse(saved) : defaultNotificationPreferences;
    } catch {
      return defaultNotificationPreferences;
    }
  });

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userEmail, setUserEmail] = useState('brenda.moura@exemplo.com');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profiles`, JSON.stringify(profiles));
      localStorage.setItem(`${STORAGE_KEY}_current_profile`, currentProfileId);
      localStorage.setItem(`${STORAGE_KEY}_moods`, JSON.stringify(moodEntries));
      localStorage.setItem(`${STORAGE_KEY}_mood_records`, JSON.stringify(moodRecords));
      localStorage.setItem(`${STORAGE_KEY}_available_factors`, JSON.stringify(availableFactors));
      localStorage.setItem(`${STORAGE_KEY}_day_factors`, JSON.stringify(dayFactors));
      localStorage.setItem(`${STORAGE_KEY}_day_notes`, JSON.stringify(dayNotes));
      localStorage.setItem(`${STORAGE_KEY}_life_areas`, JSON.stringify(lifeAreas));
      localStorage.setItem(`${STORAGE_KEY}_question_groups`, JSON.stringify(questionGroups));
      localStorage.setItem(`${STORAGE_KEY}_questions`, JSON.stringify(questions));
      localStorage.setItem(`${STORAGE_KEY}_question_responses`, JSON.stringify(questionResponses));
      localStorage.setItem(`${STORAGE_KEY}_agenda`, JSON.stringify(agendaItems));
      localStorage.setItem(`${STORAGE_KEY}_routines`, JSON.stringify(routineTasks));
      localStorage.setItem(`${STORAGE_KEY}_reminders`, JSON.stringify(contextualReminders));
      localStorage.setItem(`${STORAGE_KEY}_health`, JSON.stringify(healthItems));
      localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(goals));
      localStorage.setItem(`${STORAGE_KEY}_recurring`, JSON.stringify(recurringTasks));
      localStorage.setItem(`${STORAGE_KEY}_recurring_history`, JSON.stringify(recurringHistory));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_notif_prefs`, JSON.stringify(notificationPreferences));
    } catch {
      // Ignore quota errors in restricted contexts
    }
  }, [
    profiles,
    currentProfileId,
    moodEntries,
    moodRecords,
    availableFactors,
    dayFactors,
    dayNotes,
    lifeAreas,
    questionGroups,
    questions,
    questionResponses,
    agendaItems,
    routineTasks,
    contextualReminders,
    healthItems,
    goals,
    recurringTasks,
    notifications
  ]);

  const currentProfile = profiles.find((p) => p.id === currentProfileId) || profiles[0];

  const switchProfile = (profileId: string) => {
    setCurrentProfileId(profileId);
  };

  const updateProfileName = (profileId: string, name: string) => {
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? { ...p, name } : p)));
  };

  const addProfile = (profile: Omit<UserProfile, 'id'>) => {
    const newP: UserProfile = {
      ...profile,
      id: `p-${Date.now()}`
    };
    setProfiles((prev) => [...prev, newP]);
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (currentProfileId === id) {
      const remaining = profiles.filter((p) => p.id !== id);
      if (remaining.length > 0) setCurrentProfileId(remaining[0].id);
    }
  };

  const currentMood = moodEntries.find((m) => m.date === selectedDate) || moodEntries[0] || null;

  const saveMoodEntry = (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: `mood-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMoodEntries((prev) => [newEntry, ...prev.filter((m) => m.date !== entry.date)]);
  };

  const quickLogMood = (value: MoodValue, label: string) => {
    const scoreMap: Record<MoodValue, number> = {
      otimo: 95,
      bem: 78,
      neutro: 50,
      triste: 30,
      ansiosa: 25
    };
    saveMoodEntry({
      date: selectedDate,
      value,
      label,
      factors: dayFactors[selectedDate] || ['Família', 'Dia a dia'],
      positiveScore: scoreMap[value]
    });
  };

  // Meu Mapa: Mood Record by Period
  const savePeriodMood = (record: Omit<MoodRecord, 'id' | 'timestamp'>) => {
    const newRecord: MoodRecord = {
      ...record,
      id: `mr-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMoodRecords((prev) => [
      newRecord,
      ...prev.filter((r) => !(r.date === record.date && r.period === record.period))
    ]);
  };

  const getMoodRecordsForDate = (date: string) => {
    return moodRecords.filter((r) => r.date === date);
  };

  // Meu Mapa: Factors
  const addCustomFactor = (factor: string) => {
    const clean = factor.trim();
    if (!clean || availableFactors.includes(clean)) return;
    setAvailableFactors((prev) => [...prev, clean]);
  };

  const toggleDayFactor = (date: string, factor: string) => {
    setDayFactors((prev) => {
      const current = prev[date] || [];
      const updated = current.includes(factor)
        ? current.filter((f) => f !== factor)
        : [...current, factor];
      return { ...prev, [date]: updated };
    });
  };

  const setDayNotesForDate = (date: string, notes: string) => {
    setDayNotes((prev) => ({ ...prev, [date]: notes }));
  };

  // Meu Mapa: Structure (Areas, Groups, Questions)
  const createLifeArea = (name: string, icon = '✨') => {
    const newArea: LifeArea = {
      id: `area-${Date.now()}`,
      name: name.trim(),
      icon,
      order: lifeAreas.length + 1
    };
    setLifeAreas((prev) => [...prev, newArea]);
  };

  const updateLifeArea = (id: string, name: string, icon?: string) => {
    setLifeAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, name: name.trim(), ...(icon ? { icon } : {}) } : a))
    );
  };

  const deleteLifeArea = (id: string) => {
    setLifeAreas((prev) => prev.filter((a) => a.id !== id));
    // Cascade remove groups and questions
    setQuestionGroups((prev) => prev.filter((g) => g.areaId !== id));
    setQuestions((prev) => prev.filter((q) => q.areaId !== id));
  };

  const reorderArea = (id: string, direction: 'up' | 'down') => {
    setLifeAreas((prev) => {
      const index = prev.findIndex((a) => a.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((a, i) => ({ ...a, order: i + 1 }));
    });
  };

  const createQuestionGroup = (areaId: string, name: string) => {
    const newGroup: QuestionGroup = {
      id: `grp-${Date.now()}`,
      areaId,
      name: name.trim(),
      order: questionGroups.filter((g) => g.areaId === areaId).length + 1
    };
    setQuestionGroups((prev) => [...prev, newGroup]);
  };

  const updateQuestionGroup = (id: string, name: string) => {
    setQuestionGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name: name.trim() } : g))
    );
  };

  const deleteQuestionGroup = (id: string) => {
    setQuestionGroups((prev) => prev.filter((g) => g.id !== id));
    setQuestions((prev) => prev.filter((q) => q.groupId !== id));
  };

  const reorderGroup = (id: string, direction: 'up' | 'down') => {
    setQuestionGroups((prev) => {
      const grp = prev.find((g) => g.id === id);
      if (!grp) return prev;
      const areaGroups = prev.filter((g) => g.areaId === grp.areaId);
      const index = areaGroups.findIndex((g) => g.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === areaGroups.length - 1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const copy = [...areaGroups];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      const reorderedAreaGroups = copy.map((g, i) => ({ ...g, order: i + 1 }));
      return prev.map((g) => {
        const found = reorderedAreaGroups.find((rg) => rg.id === g.id);
        return found || g;
      });
    });
  };

  const createQuestion = (question: Omit<QuestionItem, 'id'>) => {
    const newQ: QuestionItem = {
      ...question,
      id: `q-${Date.now()}`,
      order: questions.filter((q) => q.groupId === question.groupId).length + 1
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const updateQuestion = (id: string, updates: Partial<QuestionItem>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setQuestionResponses((prev) => prev.filter((r) => r.questionId !== id));
  };

  const duplicateQuestion = (id: string) => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === id);
      if (index === -1) return prev;
      const source = prev[index];
      const duplicate: QuestionItem = {
        ...source,
        id: `q-${Date.now()}`,
        title: `${source.title} (Cópia)`,
        order: (source.order || 0) + 1
      };
      const copy = [...prev];
      copy.splice(index + 1, 0, duplicate);
      return copy;
    });
  };

  const reorderQuestion = (id: string, direction: 'up' | 'down') => {
    setQuestions((prev) => {
      const q = prev.find((item) => item.id === id);
      if (!q) return prev;
      const groupQuestions = prev.filter((item) => item.groupId === q.groupId);
      const index = groupQuestions.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === groupQuestions.length - 1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const copy = [...groupQuestions];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      const reorderedGroup = copy.map((item, i) => ({ ...item, order: i + 1 }));
      return prev.map((item) => {
        const found = reorderedGroup.find((rg) => rg.id === item.id);
        return found || item;
      });
    });
  };

  const addQuestionFromAi = (data: {
    areaName: string;
    groupName: string;
    title: string;
    habitType: 'bom' | 'ruim';
    positiveIf?: 'sim' | 'nao';
    frequency?: 'todos_os_dias';
  }): QuestionItem => {
    // 1. Area: find or create
    let area = lifeAreas.find(
      (a) => a.name.trim().toLowerCase() === data.areaName.trim().toLowerCase()
    );
    let areaId = area?.id;
    if (!area) {
      areaId = `area-${Date.now()}`;
      const newArea: LifeArea = {
        id: areaId,
        name: data.areaName.trim(),
        icon: '✨',
        order: lifeAreas.length + 1
      };
      setLifeAreas((prev) => [...prev, newArea]);
    }

    // 2. Group: find or create in that area
    let group = questionGroups.find(
      (g) =>
        g.areaId === areaId &&
        g.name.trim().toLowerCase() === data.groupName.trim().toLowerCase()
    );
    let groupId = group?.id;
    if (!group) {
      groupId = `grp-${Date.now()}`;
      const newGroup: QuestionGroup = {
        id: groupId,
        areaId: areaId!,
        name: data.groupName.trim(),
        order: questionGroups.filter((g) => g.areaId === areaId).length + 1
      };
      setQuestionGroups((prev) => [...prev, newGroup]);
    }

    const posIf: 'sim' | 'nao' =
      data.positiveIf || (data.habitType === 'bom' ? 'sim' : 'nao');
    const newQ: QuestionItem = {
      id: `q-${Date.now()}`,
      groupId: groupId!,
      areaId: areaId!,
      title: data.title.trim(),
      habitType: data.habitType,
      positiveIf: posIf,
      positiveLabel: posIf === 'sim' ? 'Sim' : 'Não',
      negativeLabel: posIf === 'sim' ? 'Não' : 'Sim',
      frequency: data.frequency || 'todos_os_dias',
      order: 99
    };
    setQuestions((prev) => [...prev, newQ]);
    return newQ;
  };

  // Meu Mapa: Responses
  const setQuestionResponse = (
    questionId: string,
    date: string,
    value: QuestionResponseValue,
    note?: string
  ) => {
    setQuestionResponses((prev) => {
      const existing = prev.find((r) => r.questionId === questionId && r.date === date);
      if (existing) {
        return prev.map((r) =>
          r.id === existing.id
            ? { ...r, value, note: note ?? r.note, updatedAt: new Date().toISOString() }
            : r
        );
      }
      const newResponse: QuestionResponse = {
        id: `qr-${Date.now()}`,
        questionId,
        date,
        value,
        note,
        updatedAt: new Date().toISOString()
      };
      return [...prev, newResponse];
    });
  };

  const recordChoiceResponse = (
    questionId: string,
    date: string,
    choice: QuestionChoice,
    note?: string
  ) => {
    const q = questions.find((item) => item.id === questionId);
    const positiveIf = q?.positiveIf || 'sim';
    const value = resolveResponseValue(choice, positiveIf);

    setQuestionResponses((prev) => {
      const existing = prev.find((r) => r.questionId === questionId && r.date === date);
      if (existing) {
        return prev.map((r) =>
          r.id === existing.id
            ? { ...r, choice, value, note: note ?? r.note, updatedAt: new Date().toISOString() }
            : r
        );
      }
      const newResponse: QuestionResponse = {
        id: `qr-${Date.now()}`,
        questionId,
        date,
        choice,
        value,
        note,
        updatedAt: new Date().toISOString()
      };
      return [...prev, newResponse];
    });
  };

  const getQuestionResponse = (questionId: string, date: string) => {
    return questionResponses.find((r) => r.questionId === questionId && r.date === date);
  };

  // Agenda
  const addAgendaItem = (item: Omit<AgendaItem, 'id' | 'completed'>) => {
    const newItem: AgendaItem = {
      ...item,
      id: `ag-${Date.now()}`,
      completed: false
    };
    setAgendaItems((prev) => [...prev, newItem]);
  };

  const toggleAgendaItem = (id: string) => {
    setAgendaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const deleteAgendaItem = (id: string) => {
    setAgendaItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Rotinas
  const toggleRoutineTask = (id: string) => {
    setRoutineTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const addRoutineTask = (task: Omit<RoutineTask, 'id' | 'completed'>) => {
    const newTask: RoutineTask = {
      ...task,
      id: `rt-${Date.now()}`,
      completed: false
    };
    setRoutineTasks((prev) => [...prev, newTask]);
  };

  const dismissContextualReminder = (id: string) => {
    setContextualReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // Cuidados & Saúde
  const toggleHealthItem = (id: string) => {
    setHealthItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, confirmed: !item.confirmed } : item))
    );
  };

  const addHealthItem = (item: Omit<HealthMedication, 'id' | 'confirmed'>) => {
    const newItem: HealthMedication = {
      ...item,
      id: `hm-${Date.now()}`,
      confirmed: false
    };
    setHealthItems((prev) => [...prev, newItem]);
  };

  const deleteHealthItem = (id: string) => {
    setHealthItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Metas
  const toggleGoalStep = (goalId: string, stepId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;
        const newSteps = goal.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s));
        const completedCount = newSteps.filter((s) => s.done).length;
        const total = newSteps.length;
        const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
        return {
          ...goal,
          steps: newSteps,
          completedSteps: completedCount,
          progressPercent: progress,
          status: progress >= 100 ? 'concluida' : 'em_andamento'
        };
      })
    );
  };

  const addGoal = (goal: Omit<GoalItem, 'id' | 'progressPercent' | 'completedSteps' | 'totalSteps'>) => {
    const completedCount = goal.steps.filter((s) => s.done).length;
    const total = goal.steps.length;
    const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    const newGoal: GoalItem = {
      ...goal,
      id: `goal-${Date.now()}`,
      completedSteps: completedCount,
      totalSteps: total,
      progressPercent: progress
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Recurring Tasks
  const addRecurringTask = (task: Omit<RecurringTaskItem, 'id' | 'status'>) => {
    const newTask: RecurringTaskItem = {
      ...task,
      id: `rec-${Date.now()}`,
      status: 'pendente'
    };
    setRecurringTasks((prev) => [...prev, newTask]);
  };

  const deleteRecurringTask = (id: string) => {
    setRecurringTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const completeRecurringTask = (id: string) => {
    const task = recurringTasks.find((t) => t.id === id);
    if (!task) return;
    setRecurringTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'concluido' } : t))
    );
    const now = new Date();
    const dayStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const newRecord: TaskExecutionRecord = {
      id: `th-${Date.now()}`,
      taskId: task.id,
      taskTitle: task.title,
      displayDate: dayStr,
      completedAt: now.toISOString()
    };
    setRecurringHistory((prev) => [newRecord, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const login = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const toggleNotificationPreference = (key: keyof NotificationPreferences) => {
    setNotificationPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(`${STORAGE_KEY}_notif_prefs`, JSON.stringify(updated));
      } catch {
        // Ignore quota error
      }
      return updated;
    });
  };

  const exportAppData = () => {
    const data = {
      profiles,
      currentProfileId,
      moodEntries,
      moodRecords,
      availableFactors,
      dayFactors,
      dayNotes,
      lifeAreas,
      questionGroups,
      questions,
      questionResponses,
      agendaItems,
      routineTasks,
      contextualReminders,
      healthItems,
      goals,
      recurringTasks,
      recurringHistory,
      notificationPreferences,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importAppData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.profiles)) setProfiles(data.profiles);
      if (Array.isArray(data.moodRecords)) setMoodRecords(data.moodRecords);
      if (Array.isArray(data.questions)) setQuestions(data.questions);
      if (Array.isArray(data.questionResponses)) setQuestionResponses(data.questionResponses);
      if (Array.isArray(data.agendaItems)) setAgendaItems(data.agendaItems);
      if (Array.isArray(data.routineTasks)) setRoutineTasks(data.routineTasks);
      if (Array.isArray(data.healthItems)) setHealthItems(data.healthItems);
      if (Array.isArray(data.goals)) setGoals(data.goals);
      if (Array.isArray(data.recurringTasks)) setRecurringTasks(data.recurringTasks);
      if (Array.isArray(data.recurringHistory)) setRecurringHistory(data.recurringHistory);
      if (data.notificationPreferences) setNotificationPreferences(data.notificationPreferences);
      return true;
    } catch (err) {
      console.error('Falha ao restaurar dados', err);
      return false;
    }
  };

  const resetAppToDefaults = () => {
    try {
      localStorage.clear();
    } catch {}
    setProfiles(defaultProfiles);
    setCurrentProfileId('p1');
    setMoodEntries(defaultMoodEntries);
    setMoodRecords(defaultMoodRecords);
    setAvailableFactors(defaultAvailableFactors);
    setDayFactors(defaultDayFactors);
    setDayNotes({});
    setLifeAreas(defaultLifeAreas);
    setQuestionGroups(defaultQuestionGroups);
    setQuestions(defaultQuestions);
    setQuestionResponses(defaultQuestionResponses);
    setAgendaItems(defaultAgendaItems);
    setRoutineTasks(defaultRoutineTasks);
    setContextualReminders(defaultContextualReminders);
    setHealthItems(defaultHealthItems);
    setGoals(defaultGoals);
    setRecurringTasks(defaultRecurringTasks);
    setRecurringHistory(defaultRecurringHistory);
    setNotificationPreferences(defaultNotificationPreferences);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AppContext.Provider
      value={{
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
        selectedDate,
        setSelectedDate,
        moodEntries,
        currentMood,
        saveMoodEntry,
        quickLogMood,
        moodRecords,
        savePeriodMood,
        getMoodRecordsForDate,
        availableFactors,
        addCustomFactor,
        dayFactors,
        toggleDayFactor,
        dayNotes,
        setDayNotesForDate,
        lifeAreas,
        createLifeArea,
        updateLifeArea,
        deleteLifeArea,
        reorderArea,
        questionGroups,
        createQuestionGroup,
        updateQuestionGroup,
        deleteQuestionGroup,
        reorderGroup,
        questions,
        createQuestion,
        updateQuestion,
        deleteQuestion,
        duplicateQuestion,
        reorderQuestion,
        addQuestionFromAi,
        questionResponses,
        setQuestionResponse,
        recordChoiceResponse,
        getQuestionResponse,
        isManageQuestionsModalOpen,
        setIsManageQuestionsModalOpen,
        isRelatoriosModalOpen,
        setIsRelatoriosModalOpen,
        agendaItems,
        addAgendaItem,
        toggleAgendaItem,
        deleteAgendaItem,
        routineTasks,
        toggleRoutineTask,
        addRoutineTask,
        activePeriodModal,
        setActivePeriodModal,
        contextualReminders,
        dismissContextualReminder,
        healthItems,
        toggleHealthItem,
        addHealthItem,
        deleteHealthItem,
        goals,
        toggleGoalStep,
        addGoal,
        deleteGoal,
        recurringTasks,
        recurringHistory,
        completeRecurringTask,
        addRecurringTask,
        deleteRecurringTask,
        notifications,
        markNotificationRead,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isMaisDrawerOpen,
        setIsMaisDrawerOpen,
        isAiChatOpen,
        setIsAiChatOpen,
        isMoodModalOpen,
        setIsMoodModalOpen,
        isAgendaModalOpen,
        setIsAgendaModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activeTab,
        setActiveTab,
        userEmail,
        isLoggedIn,
        login,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
