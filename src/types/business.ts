// types/business.ts

// Product & Operations
export interface ProductCosts {
  initialInventory: {
    items: {
      name: string;
      unitCost: number;
      quantity: number;
      lifespan: number; // in months
      maintenanceCost: number; // monthly
    }[];
    totalCost: number;
  };
  operationalCosts: {
    perUnit: number;
    laborPerUnit: number;
    materialPerUnit: number;
    maintenancePerUnit: number;
  };
  scaling: {
    minCapacity: number;
    maxCapacity: number;
    scaleIncrementCost: number;
    scaleIncrementUnits: number;
  };
}

// Industry & Market
export interface MarketData {
  totalMarketSize: number; // in currency
  growthRate: number; // percentage
  competitorCount: number;
  marketShare: number; // initial expected share
  customerSegments: {
    name: string;
    size: number; // percentage
    priceElasticity: number; // 0-1
    growthPotential: number; // percentage
  }[];
}

// Financial Metrics
export interface FinancialProjections {
  initialCosts: {
    inventory: number;
    setup: number;
    legal: number;
    marketing: number;
    other: number;
  };
  monthlyFixed: {
    rent: number;
    salaries: number;
    utilities: number;
    insurance: number;
    other: number;
  };
  breakEven: {
    unitSales: number;
    timeframe: number; // months
    revenueRequired: number;
  };
  projections: {
    monthlyRevenue: number;
    yearlyRevenue: number;
    profitMargin: number;
    roi: number; // percentage
  };
}

// Business Requirements
export interface BusinessRequirements {
  licenses: string[];
  certifications: string[];
  regulations: string[];
  minimumTeamSize: number;
  keyRoles: string[];
  infrastructure: string[];
}

// Industry-specific Operations
export interface IndustrySpecifics {
  type: 'tech' | 'service' | 'retail' | 'manufacturing';
  keyMetrics: string[];
  successFactors: string[];
  risks: string[];
  seasonality: {
    highSeasons: string[];
    lowSeasons: string[];
    impact: number; // percentage variation
  };
}

// Enhanced Business Idea Type
export interface EnhancedBusinessIdea {
  id: string;
  name: string;
  description: string;
  market: string;
  difficulty: number;
  potential: number;
  productCosts: ProductCosts;
  marketData: MarketData;
  financials: FinancialProjections;
  requirements: BusinessRequirements;
  industrySpecifics: IndustrySpecifics;
  monthlyProgression: {
    milestones: string[];
    challenges: string[];
    opportunities: string[];
  };
}

// Event System Types
export interface BusinessEvent {
  id: string;
  type: 'market' | 'economic' | 'industry' | 'internal' | 'opportunity';
  title: string;
  description: string;
  probability: number; // 0-1
  impact: {
    revenue: number; // percentage
    costs: number; // percentage
    marketShare: number; // percentage
    morale: number; // -100 to 100
  };
  requirements?: {
    minStage: number;
    minRevenue?: number;
    minTeamSize?: number;
  };
  options: {
    id: string;
    text: string;
    effect: {
      money: number;
      marketShare: number;
      morale: number;
      reputation: number;
    };
  }[];
}