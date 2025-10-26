import { MonthlyMetrics } from '../types/progression';

export const INITIAL_METRICS: MonthlyMetrics = {
  revenue: 0,
  userGrowth: 0,
  customerSatisfaction: 100,
  serverUptime: 100,
  marketingROI: 0,
  cashflow: 0,
  churnRate: 0,
  conversionRate: 2
};

export const METRIC_FORMATTING = {
  revenue: (value: number) => `$${value.toLocaleString()}`,
  userGrowth: (value: number) => `${value.toFixed(1)}%`,
  customerSatisfaction: (value: number) => `${value.toFixed(1)}%`,
  serverUptime: (value: number) => `${value.toFixed(2)}%`,
  marketingROI: (value: number) => `${(value * 100).toFixed(1)}%`,
  cashflow: (value: number) => `$${value.toLocaleString()}`,
  churnRate: (value: number) => `${value.toFixed(1)}%`,
  conversionRate: (value: number) => `${value.toFixed(1)}%`
};


export const METRIC_WEIGHTS = {
  revenue: 0.25,
  userGrowth: 0.2,
  customerSatisfaction: 0.15,
  serverUptime: 0.15,
  marketingROI: 0.15,
  churnRate: 0.1
};

export const METRIC_DESCRIPTIONS = {
  revenue: 'Monthly recurring revenue from all customers',
  userGrowth: 'Percentage increase in user base',
  customerSatisfaction: 'Average customer satisfaction score (0-100)',
  serverUptime: 'Percentage of time servers are operational',
  marketingROI: 'Return on marketing investment',
  cashflow: 'Net cash flow for the month',
  churnRate: 'Percentage of users who discontinue service',
  conversionRate: 'Percentage of free users converting to paid'
};

