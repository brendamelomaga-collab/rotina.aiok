export type PeriodKey = 'manha' | 'tarde' | 'noite' | 'especiais';

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  subtitle?: string;
  isPrimary?: boolean;
}

export type DayPeriod = 'manha' | 'tarde' | 'noite' | 'personalizado';

export type MoodType =
  | 'muito_bem'
  | 'bem'
  | 'neutro'
  | 'triste'
  | 'irritado'
  | 'ansioso'
  | 'sobrecarregado';

export interface MoodRecord {
  id: string;
  date: string; // YYYY-MM-DD
  period: DayPeriod;
  customTime?: string;
  mood: MoodType;
  label: string;
  intensity: number; // 1 to 5
  notes?: string;
  timestamp: string;
}

export type QuestionResponseValue =
  | 'positivo'
  | 'negativo'
  | 'nao_se_aplica'
  | 'nao_lembro';

export interface LifeArea {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  order: number;
}

export interface QuestionGroup {
  id: string;
  areaId: string;
  name: string;
  order: number;
}

export interface QuestionItem {
  id: string;
  groupId: string;
  areaId: string;
  title: string;
  habitType: 'bom' | 'ruim'; // 'bom' = hábito desejável (Sim é positivo); 'ruim' = comportamento a evitar (Sim é negativo)
  positiveIf: 'sim' | 'nao' | 'positivo';
  positiveLabel: string;
  negativeLabel: string;
  frequency: 'todos_os_dias' | 'dias_uteis' | 'fins_de_semana' | 'personalizado';
  activeDays?: number[]; // [0=Dom, 1=Seg, ...]
  order?: number;
}

export type QuestionChoice = 'sim' | 'nao' | 'nao_se_aplica' | 'nao_lembro';

export interface QuestionResponse {
  id: string;
  questionId: string;
  date: string; // YYYY-MM-DD
  choice?: QuestionChoice;
  value: QuestionResponseValue;
  note?: string;
  updatedAt: string;
}

export interface DayMapaRecord {
  date: string;
  factors: string[];
  notes?: string;
}

export type MoodValue = 'otimo' | 'bem' | 'neutro' | 'triste' | 'ansiosa';

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  value: MoodValue;
  label: string;
  factors: string[];
  notes?: string;
  positiveScore: number; // 0 - 100
  timestamp: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  displayDay: string; // ex: 'Terça-feira'
  isRecurring: boolean;
  recurrenceLabel?: string;
  completed: boolean;
  category: 'familia' | 'esporte' | 'pessoal' | 'saude' | 'trabalho';
  icon: string;
  reminderMinutes?: number;
  hasVisualNotification?: boolean;
  location?: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  subtitle?: string;
  period: PeriodKey;
  completed: boolean;
  time?: string;
  iconName?: string;
  tag?: string;
  daysOfWeek?: number[];
  activeDaysLabel?: string;
}

export interface ContextualReminder {
  id: string;
  text: string;
  period: PeriodKey;
  active: boolean;
  date: string;
}

export interface HealthMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  memberId: string;
  memberName: string;
  time: string;
  confirmed: boolean;
  category: 'medicamento' | 'suplemento' | 'cuidado';
}

export interface GoalStep {
  id: string;
  text: string;
  done: boolean;
}

export interface GoalItem {
  id: string;
  title: string;
  category: string;
  progressPercent: number;
  totalSteps: number;
  completedSteps: number;
  steps: GoalStep[];
  dueDate?: string;
  status: 'em_andamento' | 'concluida';
}

export interface RecurringTaskItem {
  id: string;
  title: string;
  recurrence: string;
  nextDate: string;
  status: 'pendente' | 'hoje' | 'concluido';
  icon: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'lembrete' | 'familia' | 'rotina';
}

export interface TaskExecutionRecord {
  id: string;
  taskId: string;
  taskTitle: string;
  displayDate: string;
  completedAt: string;
}

export interface NotificationPreferences {
  routineReminders: boolean;
  agendaReminders: boolean;
  mapaDailyReminder: boolean;
  soundAlerts: boolean;
}

export type NavTab =
  | 'inicio'
  | 'mapa'
  | 'agenda'
  | 'rotinas'
  | 'relatorios'
  | 'cuidados'
  | 'metas'
  | 'recorrentes'
  | 'mais'
  | 'ia'
  | 'configuracoes';

export interface MonthlyReviewData {
  period: string;
  positiveRate: number;
  mapSummary: {
    evaluatedCount: number;
    positiveCount: number;
    negativeCount: number;
    topArea: string;
    topAreaScore: number;
  };
  routineRegularity: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    bestPeriod: string;
  };
  agendaSummary: {
    totalEvents: number;
    completedEvents: number;
    complianceRate: number;
  };
  healthCompliance: {
    totalDoses: number;
    confirmedDoses: number;
    complianceRate: number;
  };
  goalsSummary: {
    totalGoals: number;
    completedGoals: number;
    activeGoals: number;
    completedNames: string[];
  };
  pendingTasks: string[];
  patternsDetected: string[];
  warmAnalysisText: string;
  suggestionsNextMonth: string[];
}

