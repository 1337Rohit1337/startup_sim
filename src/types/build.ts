// types/build.ts
export interface Achievement {
  id: string;
  name: string;
  achieved: boolean;
}

// Additional interfaces for monthly progression
export interface MonthlyProgress {
  month: number;
  stage: 'early' | 'growth' | 'stabilization';
  completedTasks: string[];
  pendingTasks: string[];
  metrics: {
    teamEfficiency: number;
    productQuality: number;
    developmentProgress: number;
  };achievements: Achievement[];
}

export interface OperationalEvent {
  id: string;
  type: 'equipment' | 'staff' | 'quality' | 'opportunity';
  title: string;
  description: string;
  impact: {
    productivity: number;
    morale: number;
    cost: number;
  };
  options: {
    id: string;
    text: string;
    effect: {
      productivity: number;
      morale: number;
      cost: number;
      time: number;
    };
  }[];
}
export interface TeamMember {
  id: string;
  name: string;
  role: 'developer' | 'designer' | 'marketer' | 'operations' | 'finance';
  skill: number;
  cost: number;
  salary: number;
  benefits: number;
  productivityMultiplier: number;
  description: string;
  specialties: string[];
  experience: number;
  availability: number; // hours per week
  teamFit: string[];   // roles they work well with
  performance: {
    productivity: number;
    quality: number;
    teamwork: number;
  };
  synergies?: string[];
}

export interface Feature {
  id: string;
  name: string;
  category: 'core' | 'social' | 'business';
  description: string;
  complexity: number;
  userValue: number;
  developmentCost: number;
  timeRequired: number;
  maintenanceCost: number;
  revenueImpact: number;
  requiredRoles?: string[];
  dependencies?: string[];
  scalingCosts?: {
    users: number;
    servers: number;
    support: number;
  };
  qualityMetrics?: {
    performance: number;
    reliability: number;
    usability: number;
  };
}

export interface BuildStageState {
  team: {
    members: TeamMember[];
    totalCost: number;
    monthlyCost: number;
    productivity: number;
    morale: number;
  };
  features: {
    selected: Feature[];
    totalCost: number;
    developmentTime: number;
    maintenanceCost: number;
    expectedRevenue: number;
  };
  finances: {
    budget: number;
    burnRate: number;
    runway: number;
    projectedCosts: number;
    projectedRevenue: number;
  };
  progress: {
    teamBuilding: number;
    development: number;
    overall: number;
  };
}