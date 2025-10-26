export interface StartupIdea {
  id: string;
  name: string;
  description: string;
  market: string;
  difficulty: number;
  potential: number;
  financials: {
    initialCosts: {
      setup: number;          // Office/equipment setup
      development: number;    // Initial development costs
      legal: number;         // Legal and registration
      marketing: number;     // Initial marketing budget
    };
    monthlyFixed: {
      rent: number;
      salaries: number;
      utilities: number;
      insurance: number;
    };
    operationalCosts: {
      perUnit: number;       // Cost per product/service unit
      laborPerUnit: number;  // Labor cost per unit
      materialPerUnit: number; // Materials per unit
    };
    breakEvenAnalysis: {
      recommendedPrice: number;
      unitsPerMonth: number;
      monthsToBreakEven: number;
    };
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'coder' | 'designer' | 'marketer' | 'finance';
  skill: number;
  cost: number;
  morale: number;
  synergies: string[];
  salary: number;
  benefits: number;
  productivityMultiplier: number;
}

export interface ProductFeature {
  id: string;
  name: string;
  description: string;
  complexity: number;
  impact: number;
  cost: number;
  requiredRole?: 'coder' | 'designer' | 'marketer' | 'finance';
  developmentTime: number;
  maintenanceCost: number;
  revenueImpact: number;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  cost: number;
  reach: number;
  engagement: number;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok' | 'twitter';
  content: string;
  likes: number;
  shares: number;
  comments: string[];
  timestamp: Date;
  isMeme?: boolean;
}

export interface GameEvent {
  id: string;
  type: 'team_drama' | 'design_contest' | 'meme_generator' | 'influencer_collab';
  title: string;
  description: string;
  options: EventOption[];
  active: boolean;
}

export interface EventOption {
  id: string;
  text: string;
  effect: {
    morale?: number;
    money?: number;
    score?: number;
    socialBoost?: number;
  };
}

export interface DesignContest {
  playerDesign: string;
  competitors: string[];
  pollResults?: {
    playerVotes: number;
    totalVotes: number;
    winner: string;
  };
}

export interface InfluencerOffer {
  name: string;
  followers: number;
  engagement: number;
  cost: number;
  riskLevel: 'low' | 'medium' | 'high';
  potentialReach: number;
}

export interface GameState {
  stage: 'foundation' | 'build' | 'launch';
  score: number;
  users:number;
  resources: {
    money: number;
    time: number;
    users;
  };
  finances: {
    initialCosts: {
      setup: number;
      development: number;
      legal: number;
      marketing: number;
    };
    monthlyFixed: {
      rent: number;
      salaries: number;
      utilities: number;
      insurance: number;
    };
    operationalCosts: {
      perUnit: number;
      laborPerUnit: number;
      materialPerUnit: number;
    };
    totalInvestment: number;
  };
  selectedIdea?: StartupIdea;
  team: TeamMember[];
  selectedFeatures: ProductFeature[];
  marketingCampaign?: MarketingCampaign;
  morale: number;
  secretPerks: string[];
  socialFeedPosts: SocialPost[];
  currentEvent?: GameEvent;
  isComplete: boolean;
}
// Legacy interfaces for backward compatibility
export interface ValidationChoice {
  id: number;
  text: string;
  impact: number;
  explanation: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  complexity: number;
  userValue: number;
}

export interface MarketingChannel {
  id: string;
  name: string;
  description: string;
  cost: number;
  reach: number;
  engagement: number;
}

export interface GameScores {
  foundation: number;
  development: number;
  marketing: number;
  overall: number;
}

export interface GameChoices {
  selectedIdea?: number;
  validation: number[];
  teamMembers: string[];
  features: string[];
  brandColor: string;
  marketingChannels: string[];
  budgetAllocation: Record<string, number>;
}

// Legacy data exports
export const STARTUP_IDEAS: StartupIdea[] = [
  {
    id: '1',
    name: 'EcoDelivery',
    description: 'Sustainable food delivery using electric bikes',
    market: 'Food Tech',
    difficulty: 6,
    potential: 8,
    financials: {
      initialCosts: {
        setup: 12000,      // Bike fleet
        development: 20000, // App development
        legal: 3000,       // Licenses
        marketing: 5000    // Initial marketing
      },
      monthlyFixed: {
        rent: 2000,
        salaries: 15000,
        utilities: 500,
        insurance: 1000
      },
      operationalCosts: {
        perUnit: 6.50,     // Per delivery
        laborPerUnit: 5,   // Rider payment
        materialPerUnit: 1.50 // Packaging
      },
      breakEvenAnalysis: {
        recommendedPrice: 15,
        unitsPerMonth: 5834,
        monthsToBreakEven: 6
      }
    }
  },
  {
    id: '2',
    name: 'StudyBuddy AI',
    description: 'AI-powered personalized learning platform',
    market: 'EdTech',
    difficulty: 8,
    potential: 9,
    financials: {
      initialCosts: {
        setup: 8000,       // Hardware/servers
        development: 30000, // AI development
        legal: 2000,
        marketing: 10000
      },
      monthlyFixed: {
        rent: 1500,
        salaries: 20000,
        utilities: 800,
        insurance: 1200
      },
      operationalCosts: {
        perUnit: 2.00,     // Per user cost
        laborPerUnit: 1,   // Support cost
        materialPerUnit: 1  // Server costs
      },
      breakEvenAnalysis: {
        recommendedPrice: 20,
        unitsPerMonth: 3000,
        monthsToBreakEven: 8
      }
    }
  },
  {
    id: '3',
    name: 'LocalConnect',
    description: 'Hyperlocal community marketplace',
    market: 'Social Commerce',
    difficulty: 5,
    potential: 7,
    financials: {
      initialCosts: {
        setup: 5000,       // Office setup
        development: 15000, // Platform development
        legal: 2000,       // Marketplace regulations
        marketing: 8000    // Local marketing
      },
      monthlyFixed: {
        rent: 1000,
        salaries: 12000,
        utilities: 400,
        insurance: 800
      },
      operationalCosts: {
        perUnit: 1.00,     // Per transaction
        laborPerUnit: 0.50, // Customer service
        materialPerUnit: 0.50 // Platform maintenance
      },
      breakEvenAnalysis: {
        recommendedPrice: 5,
        unitsPerMonth: 8000,
        monthsToBreakEven: 4
      }
    }
  },
  {
    id: '4',
    name: 'HealthTracker Pro',
    description: 'Comprehensive wellness monitoring app',
    market: 'HealthTech',
    difficulty: 7,
    potential: 8,
    financials: {
      initialCosts: {
        setup: 10000,      // Health monitoring equipment
        development: 25000, // App development
        legal: 5000,       // Health regulations
        marketing: 7000    // Healthcare marketing
      },
      monthlyFixed: {
        rent: 1800,
        salaries: 18000,
        utilities: 600,
        insurance: 2000    // Higher for health tech
      },
      operationalCosts: {
        perUnit: 3.00,     // Per user monitoring
        laborPerUnit: 2,   // Health data analysis
        materialPerUnit: 1  // Data storage
      },
      breakEvenAnalysis: {
        recommendedPrice: 25,
        unitsPerMonth: 2500,
        monthsToBreakEven: 7
      }
    }
  },
  {
    id: '5',
    name: 'GreenEnergy Hub',
    description: 'Solar panel installation marketplace',
    market: 'CleanTech',
    difficulty: 9,
    potential: 10,
    financials: {
      initialCosts: {
        setup: 15000,      // Demo equipment
        development: 35000, // Platform development
        legal: 6000,       // Energy sector compliance
        marketing: 12000   // B2B marketing
      },
      monthlyFixed: {
        rent: 2500,
        salaries: 25000,
        utilities: 1000,
        insurance: 3000
      },
      operationalCosts: {
        perUnit: 100.00,   // Per installation commission
        laborPerUnit: 50,  // Project management
        materialPerUnit: 50 // Quality assurance
      },
      breakEvenAnalysis: {
        recommendedPrice: 500,
        unitsPerMonth: 200,
        monthsToBreakEven: 10
      }
    }
  }
];

export const VALIDATION_CHOICES: ValidationChoice[] = [
  {
    id: 1,
    text: "Conduct quick online survey with 50+ students",
    impact: 8,
    explanation: "Primary research provides valuable insights into real user needs"
  },
  {
    id: 2,
    text: "Research existing competitors and their reviews",
    impact: 6,
    explanation: "Competitive analysis helps identify market gaps and opportunities"
  },
  {
    id: 3,
    text: "Ask friends and family for their opinions",
    impact: 3,
    explanation: "Limited sample size may not represent your target market"
  },
  {
    id: 4,
    text: "Create a simple landing page to test interest",
    impact: 7,
    explanation: "Validates demand with minimal investment before building"
  },
  {
    id: 5,
    text: "Skip validation and start building immediately",
    impact: -5,
    explanation: "Building without validation risks creating something nobody wants"
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  { 
    id: '1', 
    name: 'Alex Chen', 
    role: 'coder', 
    skill: 8, 
    cost: 3000, 
    morale: 80, 
    synergies: ['designer'],
    salary: 8000,
    benefits: 2000,
    productivityMultiplier: 1.2
  },
  { 
    id: '2', 
    name: 'Sarah Kim', 
    role: 'designer', 
    skill: 7, 
    cost: 2500, 
    morale: 85, 
    synergies: ['coder'],
    salary: 6500,
    benefits: 1500,
    productivityMultiplier: 1.1
  },
  { 
    id: '3', 
    name: 'Mike Johnson', 
    role: 'marketer', 
    skill: 6, 
    cost: 2000, 
    morale: 75, 
    synergies: ['finance'],
    salary: 5500,
    benefits: 1200,
    productivityMultiplier: 1.0
  },
  { 
    id: '4', 
    name: 'Lisa Wang', 
    role: 'finance', 
    skill: 9, 
    cost: 3500, 
    morale: 90, 
    synergies: ['marketer'],
    salary: 9000,
    benefits: 2500,
    productivityMultiplier: 1.3
  },
  { 
    id: '5', 
    name: 'David Smith', 
    role: 'coder', 
    skill: 7, 
    cost: 2800, 
    morale: 82, 
    synergies: ['designer'],
    salary: 7000,
    benefits: 1800,
    productivityMultiplier: 1.1
  },
  { 
    id: '6', 
    name: 'Emily Zhang', 
    role: 'designer', 
    skill: 8, 
    cost: 2700, 
    morale: 88, 
    synergies: ['marketer'],
    salary: 7200,
    benefits: 1700,
    productivityMultiplier: 1.2
  },
  { 
    id: '7', 
    name: 'James Wilson', 
    role: 'marketer', 
    skill: 7, 
    cost: 2300, 
    morale: 85, 
    synergies: ['finance'],
    salary: 6000,
    benefits: 1400,
    productivityMultiplier: 1.1
  },
  { 
    id: '8', 
    name: 'Maria Garcia', 
    role: 'finance', 
    skill: 8, 
    cost: 3200, 
    morale: 87, 
    synergies: ['coder'],
    salary: 8500,
    benefits: 2200,
    productivityMultiplier: 1.2
  }
];

export const FEATURES: Feature[] = [
  { id: "auth", name: "User Authentication", description: "Secure login and registration system", complexity: 3, userValue: 8 },
  { id: "profile", name: "User Profiles", description: "Customizable user profiles with preferences", complexity: 2, userValue: 6 },
  { id: "messaging", name: "In-App Messaging", description: "Real-time chat between users", complexity: 4, userValue: 9 },
  { id: "search", name: "Advanced Search", description: "Filter and find content easily", complexity: 3, userValue: 7 },
  { id: "notifications", name: "Push Notifications", description: "Keep users engaged with timely updates", complexity: 2, userValue: 5 },
  { id: "analytics", name: "User Analytics", description: "Track user behavior and app performance", complexity: 3, userValue: 4 }
];

export const MARKETING_CHANNELS: MarketingChannel[] = [
  { id: "instagram", name: "Instagram", description: "Visual content and influencer partnerships", cost: 2000, reach: 9, engagement: 8 },
  { id: "tiktok", name: "TikTok", description: "Short-form video content for viral potential", cost: 1500, reach: 8, engagement: 9 },
  { id: "youtube", name: "YouTube", description: "Long-form content and tutorials", cost: 3000, reach: 7, engagement: 6 },
  { id: "facebook", name: "Facebook", description: "Targeted ads and community building", cost: 2500, reach: 6, engagement: 5 },
  { id: "twitter", name: "Twitter/X", description: "Real-time engagement and thought leadership", cost: 1000, reach: 5, engagement: 7 }
];