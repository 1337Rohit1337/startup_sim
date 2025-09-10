export interface StartupIdea {
  id: string;
  name: string;
  description: string;
  market: string;
  difficulty: number;
  potential: number;
  validated?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'coder' | 'designer' | 'marketer' | 'finance';
  skill: number;
  cost: number;
  morale: number;
  synergies: string[];
}

export interface ProductFeature {
  id: string;
  name: string;
  description: string;
  complexity: number;
  impact: number;
  cost: number;
  requiredRole?: 'coder' | 'designer' | 'marketer' | 'finance';
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
  resources: {
    money: number;
    time: number;
    energy: number;
  };
  selectedIdea?: StartupIdea;
  team: TeamMember[];
  selectedFeatures: ProductFeature[];
  marketingCampaign?: MarketingCampaign;
  morale: number;
  secretPerks: string[];
  socialFeedPosts: SocialPost[];
  currentEvent?: GameEvent;
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
  },
  {
    id: '2',
    name: 'StudyBuddy AI',
    description: 'AI-powered personalized learning platform',
    market: 'EdTech',
    difficulty: 8,
    potential: 9,
  },
  {
    id: '3',
    name: 'LocalConnect',
    description: 'Hyperlocal community marketplace',
    market: 'Social Commerce',
    difficulty: 5,
    potential: 7,
  },
  {
    id: '4',
    name: 'HealthTracker Pro',
    description: 'Comprehensive wellness monitoring app',
    market: 'HealthTech',
    difficulty: 7,
    potential: 8,
  },
  {
    id: '5',
    name: 'GreenEnergy Hub',
    description: 'Solar panel installation marketplace',
    market: 'CleanTech',
    difficulty: 9,
    potential: 10,
  },
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
  { id: '1', name: 'Alex Chen', role: 'coder', skill: 8, cost: 3000, morale: 80, synergies: ['designer'] },
  { id: '2', name: 'Sarah Kim', role: 'designer', skill: 7, cost: 2500, morale: 85, synergies: ['coder'] },
  { id: '3', name: 'Mike Johnson', role: 'marketer', skill: 6, cost: 2000, morale: 75, synergies: ['finance'] },
  { id: '4', name: 'Lisa Wang', role: 'finance', skill: 9, cost: 3500, morale: 90, synergies: ['marketer'] },
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