import { TeamMember, Feature } from '@/types/build';

export const calculateTeamEfficiency = (
  team: TeamMember[],
  features: Feature[],
  morale: number
): number => {
  const baseEfficiency = team.reduce((sum, member) => sum + member.skill, 0) / team.length;
  const synergy = calculateTeamSynergy(team);
  const moraleMultiplier = morale / 100;
  
  return Math.min(100, Math.round(baseEfficiency * 10 * synergy * moraleMultiplier));
};

export const calculateTeamSynergy = (team: TeamMember[]): number => {
  if (team.length <= 1) return 1;

  let synergisticPairs = 0;
  let totalPossiblePairs = (team.length * (team.length - 1)) / 2;

  for (let i = 0; i < team.length; i++) {
    for (let j = i + 1; j < team.length; j++) {
      if (team[i].teamFit.includes(team[j].role)) {
        synergisticPairs++;
      }
    }
  }

  return 1 + (synergisticPairs / totalPossiblePairs) * 0.5;
};

export const calculateDevelopmentProgress = (
  features: Feature[],
  efficiency: number,
  timeRemaining: number
): number => {
  if (features.length === 0) return 0;
  
  const totalTime = features.reduce((sum, feature) => sum + feature.timeRequired, 0);
  const progressRate = efficiency / 100;
  const timeSpent = Math.max(0, totalTime - timeRemaining);
  
  return Math.min(100, Math.round((timeSpent / totalTime) * progressRate * 100));
};

export const calculateQualityScore = (
  team: TeamMember[],
  features: Feature[],
  efficiency: number
): number => {
  if (team.length === 0 || features.length === 0) return 0;

  const avgSkill = team.reduce((sum, member) => sum + member.skill, 0) / team.length;
  const avgComplexity = features.reduce((sum, feature) => sum + feature.complexity, 0) / features.length;
  const skillComplexityRatio = avgSkill / avgComplexity;
  
  return Math.min(100, Math.round(skillComplexityRatio * efficiency));
};

export const calculateRisk = (
  team: TeamMember[],
  features: Feature[],
  burnRate: number,
  runway: number
): number => {
  if (team.length === 0 || features.length === 0) return 0;

  const teamRisk = 1 - (team.reduce((sum, member) => sum + member.skill, 0) / (team.length * 10));
  const featureRisk = features.reduce((sum, feature) => sum + feature.complexity, 0) / (features.length * 5);
  const financialRisk = Math.max(0, 1 - (runway / 12)); // Risk increases as runway decreases below 12 months

  return Math.min(100, Math.round((teamRisk + featureRisk + financialRisk) * 33.33));
};

export const predictDevelopmentTime = (
  features: Feature[],
  team: TeamMember[],
  efficiency: number
): number => {
  if (features.length === 0 || team.length === 0) return 0;

  const totalBaseTime = features.reduce((sum, feature) => sum + feature.timeRequired, 0);
  const teamSpeedMultiplier = efficiency / 100;
  
  return Math.round(totalBaseTime / teamSpeedMultiplier);
};

export const calculateFeatureReadiness = (
  feature: Feature,
  team: TeamMember[],
  timeRemaining: number,
  budget: number
): { 
  canStart: boolean;
  team: number;
  time: number;
  budget: number;
  risk: number;
} => {
  const teamReadiness = team.length > 0 ? 
    Math.min(100, (team.reduce((sum, member) => sum + member.skill, 0) / (team.length * 10)) * 100) : 0;
  
  const timeReadiness = timeRemaining >= feature.timeRequired ? 100 : 
    Math.round((timeRemaining / feature.timeRequired) * 100);
  
  const budgetReadiness = budget >= feature.cost ? 100 : 
    Math.round((budget / feature.cost) * 100);
  
  const riskScore = calculateRisk(team, [feature], 0, timeRemaining);
  const riskReadiness = 100 - riskScore;

  return {
    canStart: teamReadiness >= 70 && timeReadiness >= 100 && budgetReadiness >= 100 && riskReadiness >= 50,
    team: teamReadiness,
    time: timeReadiness,
    budget: budgetReadiness,
    risk: riskReadiness
  };
};