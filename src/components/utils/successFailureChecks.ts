import { MonthlyMetrics } from '@/types/progression';
import { GameState } from '@/types/game';

// Interfaces
interface MetricData {
  current: number;
  required: number;
  achieved: boolean;
}

interface GameMetrics {
  [key: string]: MetricData;
  revenue: MetricData;
  userGrowth: MetricData;
  customerSatisfaction: MetricData;
  serverUptime: MetricData;
  marketingROI: MetricData;
  churnRate: MetricData;
  conversionRate: MetricData;
}

export interface SuccessCheckResult {
  success: boolean;
  overallScore: number;
  metrics: GameMetrics;
  successFactors: string[];
  failureReasons: string[];
}

// Success thresholds could be moved to a separate constant
const SUCCESS_THRESHOLDS = {
  revenue: 15000,
  userGrowth: 12,
  customerSatisfaction: 85,
  serverUptime: 99,
  marketingROI: 0.3,
  churnRate: 8,
  conversionRate: 15
};

export const checkSuccessConditions = (
  monthlyMetrics: MonthlyMetrics, 
  currentMonth: number, 
  gameState: GameState
): SuccessCheckResult => {
  // Create metrics object
  const metrics: GameMetrics = {
    revenue: {
      current: monthlyMetrics.revenue,
      required: SUCCESS_THRESHOLDS.revenue,
      achieved: monthlyMetrics.revenue >= SUCCESS_THRESHOLDS.revenue
    },
    userGrowth: {
      current: monthlyMetrics.userGrowth,
      required: SUCCESS_THRESHOLDS.userGrowth,
      achieved: monthlyMetrics.userGrowth >= SUCCESS_THRESHOLDS.userGrowth
    },
    customerSatisfaction: {
      current: monthlyMetrics.customerSatisfaction,
      required: SUCCESS_THRESHOLDS.customerSatisfaction,
      achieved: monthlyMetrics.customerSatisfaction >= SUCCESS_THRESHOLDS.customerSatisfaction
    },
    serverUptime: {
      current: monthlyMetrics.serverUptime,
      required: SUCCESS_THRESHOLDS.serverUptime,
      achieved: monthlyMetrics.serverUptime >= SUCCESS_THRESHOLDS.serverUptime
    },
    marketingROI: {
      current: monthlyMetrics.marketingROI,
      required: SUCCESS_THRESHOLDS.marketingROI,
      achieved: monthlyMetrics.marketingROI >= SUCCESS_THRESHOLDS.marketingROI
    },
    churnRate: {
      current: monthlyMetrics.churnRate,
      required: SUCCESS_THRESHOLDS.churnRate,
      achieved: monthlyMetrics.churnRate <= SUCCESS_THRESHOLDS.churnRate
    },
    conversionRate: {
      current: monthlyMetrics.conversionRate,
      required: SUCCESS_THRESHOLDS.conversionRate,
      achieved: monthlyMetrics.conversionRate >= SUCCESS_THRESHOLDS.conversionRate
    }
  };

  const successFactors: string[] = [];
  const failureReasons: string[] = [];

  // Add messages for each metric
  if (metrics.revenue.achieved) {
    successFactors.push(`Achieved revenue target of $${SUCCESS_THRESHOLDS.revenue.toLocaleString()}`);
  } else {
    failureReasons.push(`Revenue of $${monthlyMetrics.revenue.toLocaleString()} below target of $${SUCCESS_THRESHOLDS.revenue.toLocaleString()}`);
  }

  if (metrics.userGrowth.achieved) {
    successFactors.push(`Strong user growth of ${monthlyMetrics.userGrowth.toFixed(1)}%`);
  } else {
    failureReasons.push(`User growth of ${monthlyMetrics.userGrowth.toFixed(1)}% below target of ${SUCCESS_THRESHOLDS.userGrowth}%`);
  }

  if (metrics.customerSatisfaction.achieved) {
    successFactors.push(`High customer satisfaction at ${monthlyMetrics.customerSatisfaction.toFixed(1)}%`);
  } else {
    failureReasons.push(`Customer satisfaction at ${monthlyMetrics.customerSatisfaction.toFixed(1)}% below target of ${SUCCESS_THRESHOLDS.customerSatisfaction}%`);
  }

  if (metrics.serverUptime.achieved) {
    successFactors.push(`Excellent server uptime at ${monthlyMetrics.serverUptime.toFixed(2)}%`);
  } else {
    failureReasons.push(`Server uptime at ${monthlyMetrics.serverUptime.toFixed(2)}% below target of ${SUCCESS_THRESHOLDS.serverUptime}%`);
  }

  if (metrics.marketingROI.achieved) {
    successFactors.push(`Strong marketing ROI at ${(monthlyMetrics.marketingROI * 100).toFixed(1)}%`);
  } else {
    failureReasons.push(`Marketing ROI at ${(monthlyMetrics.marketingROI * 100).toFixed(1)}% below target of ${(SUCCESS_THRESHOLDS.marketingROI * 100).toFixed(1)}%`);
  }

  if (metrics.churnRate.achieved) {
    successFactors.push(`Low churn rate at ${monthlyMetrics.churnRate.toFixed(1)}%`);
  } else {
    failureReasons.push(`High churn rate at ${monthlyMetrics.churnRate.toFixed(1)}% above target of ${SUCCESS_THRESHOLDS.churnRate}%`);
  }

  if (metrics.conversionRate.achieved) {
    successFactors.push(`Good conversion rate at ${monthlyMetrics.conversionRate.toFixed(1)}%`);
  } else {
    failureReasons.push(`Conversion rate at ${monthlyMetrics.conversionRate.toFixed(1)}% below target of ${SUCCESS_THRESHOLDS.conversionRate}%`);
  }

  // Calculate overall score
  const achievedMetrics = Object.values(metrics).filter(m => m.achieved).length;
  const totalMetrics = Object.keys(metrics).length;
  const overallScore = Math.round((achievedMetrics / totalMetrics) * 100);

  // Determine overall success
  const success = overallScore >= 70;

  return {
    success,
    overallScore,
    metrics,
    successFactors,
    failureReasons
  };
};