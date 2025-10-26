import { 
  MonthlyMetrics, 
  MonthlyExpenses, 
  MonthlyDecision, 
  MonthlyEvent 
} from '../types/progression';
import { INITIAL_METRICS } from '../data/monthlyMetrics';

export const calculateMonthlyMetrics = (
  previousMetrics: MonthlyMetrics,
  expenses: MonthlyExpenses,
  decisions: MonthlyDecision,
  events: MonthlyEvent[],
  gameState: any // Replace with your GameState type
): MonthlyMetrics => {
  // Base calculations
  let newMetrics = { ...previousMetrics };

  // Calculate base growth from marketing spend
  const marketingEffectiveness = calculateMarketingEffectiveness(decisions.marketingBudget, gameState);
  newMetrics.userGrowth = marketingEffectiveness * 5; // 5% growth per effectiveness point

  // Calculate revenue
  const averageRevenuePerUser = 50; // You can adjust this
  newMetrics.revenue = (gameState.users * (1 + newMetrics.userGrowth/100)) * averageRevenuePerUser;

  // Calculate server uptime based on investment
  newMetrics.serverUptime = calculateServerUptime(decisions.serverInvestment, gameState.users);

  // Calculate customer satisfaction
  newMetrics.customerSatisfaction = calculateCustomerSatisfaction(
    previousMetrics.customerSatisfaction,
    newMetrics.serverUptime,
    expenses.customerSupport,
    gameState
  );

  // Calculate marketing ROI
  newMetrics.marketingROI = (newMetrics.revenue - previousMetrics.revenue) / decisions.marketingBudget;

  // Calculate churn rate
  newMetrics.churnRate = calculateChurnRate(newMetrics.customerSatisfaction, newMetrics.serverUptime);

  // Calculate cashflow
  newMetrics.cashflow = newMetrics.revenue - expenses.total;

  // Apply event impacts
  events.forEach(event => {
    if (event.impact.revenue) newMetrics.revenue *= (1 + event.impact.revenue);
    if (event.impact.userGrowth) newMetrics.userGrowth *= (1 + event.impact.userGrowth);
    if (event.impact.satisfaction) newMetrics.customerSatisfaction *= (1 + event.impact.satisfaction);
    if (event.impact.uptime) newMetrics.serverUptime *= (1 + event.impact.uptime);
    if (event.impact.churnRate) newMetrics.churnRate *= (1 + event.impact.churnRate);
  });

  return newMetrics;
};

export const calculateMonthlyExpenses = (
  decisions: MonthlyDecision,
  gameState: any
): MonthlyExpenses => {
  const expenses: MonthlyExpenses = {
    marketing: decisions.marketingBudget,
    servers: calculateServerCosts(decisions.serverInvestment, gameState.users),
    salaries: calculateTeamSalaries(gameState.teamMembers),
    maintenance: calculateMaintenanceCosts(gameState.features),
    customerSupport: calculateSupportCosts(gameState.users),
    total: 0
  };

  expenses.total = Object.values(expenses).reduce((sum, cost) => sum + cost, 0);
  return expenses;
};

// Helper functions
const calculateMarketingEffectiveness = (budget: number, gameState: any): number => {
  const baseEffectiveness = Math.log10(budget) - 2; // Logarithmic returns
  const teamBonus = gameState.teamMembers.filter((m: any) => m.role === 'marketer').length * 0.2;
  return Math.max(0, baseEffectiveness * (1 + teamBonus));
};

const calculateServerUptime = (investment: number, users: number): number => {
  const requiredInvestment = users * 0.1; // 10 cents per user required
  const investmentRatio = investment / requiredInvestment;
  return Math.min(99.99, 95 + (investmentRatio * 4)); // Max 99.99% uptime
};

const calculateCustomerSatisfaction = (
  previousSatisfaction: number,
  uptime: number,
  supportBudget: number,
  gameState: any
): number => {
  const uptimeImpact = (uptime - 95) * 2; // Each % above 95% adds 2 satisfaction points
  const supportImpact = Math.log10(supportBudget) - 2;
  const featureImpact = gameState.features.length * 0.5;
  
  const newSatisfaction = previousSatisfaction + uptimeImpact + supportImpact + featureImpact;
  return Math.min(100, Math.max(0, newSatisfaction));
};

const calculateChurnRate = (satisfaction: number, uptime: number): number => {
  const baseChurn = 5; // 5% base churn
  const satisfactionImpact = (100 - satisfaction) * 0.1;
  const uptimeImpact = (100 - uptime) * 0.2;
  
  return Math.max(0, baseChurn + satisfactionImpact + uptimeImpact);
};

const calculateServerCosts = (investment: number, users: number): number => {
  return investment + (users * 0.1); // Base investment + per-user cost
};

const calculateTeamSalaries = (teamMembers: any[]): number => {
  return teamMembers.reduce((total, member) => total + member.salary + member.benefits, 0);
};

const calculateMaintenanceCosts = (features: any[]): number => {
  return features.reduce((total, feature) => total + feature.maintenanceCost, 0);
};

const calculateSupportCosts = (users: number): number => {
  return Math.ceil(users / 1000) * 500; // $500 per 1000 users
};