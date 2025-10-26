import { SuccessMetrics } from '../types/progression';

export const SUCCESS_THRESHOLDS: Record<number, SuccessMetrics> = {
  1: {
    minimumRevenue: 5000,
    minimumUsers: 100,
    minimumSatisfaction: 60,
    minimumUptime: 95,
    minimumROI: 0.5,
    maximumChurnRate: 10
  },
  3: {
    minimumRevenue: 15000,
    minimumUsers: 500,
    minimumSatisfaction: 70,
    minimumUptime: 97,
    minimumROI: 1,
    maximumChurnRate: 8
  },
  6: {
    minimumRevenue: 50000,
    minimumUsers: 2000,
    minimumSatisfaction: 75,
    minimumUptime: 98,
    minimumROI: 1.5,
    maximumChurnRate: 5
  },
  12: {
    minimumRevenue: 200000,
    minimumUsers: 10000,
    minimumSatisfaction: 80,
    minimumUptime: 99,
    minimumROI: 2,
    maximumChurnRate: 3
  }
};

export const getSuccessThreshold = (month: number): SuccessMetrics => {
  const thresholdMonths = Object.keys(SUCCESS_THRESHOLDS).map(Number);
  const applicableMonth = Math.max(...thresholdMonths.filter(m => m <= month));
  return SUCCESS_THRESHOLDS[applicableMonth];
};