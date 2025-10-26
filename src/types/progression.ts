export interface MonthlyMetrics {
  revenue: number;
  userGrowth: number;
  customerSatisfaction: number;
  serverUptime: number;
  marketingROI: number;
  cashflow: number;
  churnRate: number;
  conversionRate: number;
}

export interface MonthlyExpenses {
  marketing: number;
  servers: number;
  salaries: number;
  maintenance: number;
  customerSupport: number;
  total: number;
}

export interface MonthlyDecision {
  marketingBudget: number;
  serverInvestment: number;
  hiring: number;
  research: number;
}

export interface SuccessMetrics {
  minimumRevenue: number;
  minimumUsers: number;
  minimumSatisfaction: number;
  minimumUptime: number;
  minimumROI: number;
  maximumChurnRate: number;
}

export interface MonthlyEvent {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  impact: {
    revenue?: number;
    userGrowth?: number;
    satisfaction?: number;
    uptime?: number;
    churnRate?: number;
  };
  probability: number; // 0-1
  requiredFeatures?: string[]; // Features that must be present for this event
  requiredTeamSize?: number; // Minimum team size needed
}

export interface MonthlyReport {
  month: number;
  metrics: MonthlyMetrics;
  expenses: MonthlyExpenses;
  events: MonthlyEvent[];
  decisions: MonthlyDecision;
  success: boolean;
}