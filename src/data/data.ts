

export const TEAM_MEMBERS = [
  {
    id: 'dev1',
    name: 'Arjun Patel',
    role: 'developer',
    skill: 9,
    cost: 8000,
    salary: 10000,
    benefits: 2000,
    productivityMultiplier: 1.2,
    description: 'Full-stack developer with 5+ years experience',
    specialties: ['React', 'Node.js', 'Database Design'],
    teamFit: ['designer', 'marketer']
  },
  {
    id: 'dev2',
    name: 'Priya Sharma',
    role: 'developer',
    skill: 7,
    cost: 6000,
    salary: 8000,
    benefits: 1600,
    productivityMultiplier: 1.0,
    description: 'Frontend specialist with UI/UX skills',
    specialties: ['React', 'TypeScript', 'CSS'],
    teamFit: ['designer', 'developer']
  },
  {
    id: 'design1',
    name: 'Aisha Mehta',
    role: 'designer',
    skill: 8,
    cost: 5500,
    salary: 7500,
    benefits: 1500,
    productivityMultiplier: 1.1,
    description: 'UI/UX designer with product experience',
    specialties: ['Figma', 'User Research', 'Prototyping'],
    teamFit: ['developer', 'marketer']
  },
  {
    id: 'design2',
    name: 'Samuel Tallamraju',
    role: 'designer',
    skill: 6,
    cost: 4000,
    salary: 6000,
    benefits: 1200,
    productivityMultiplier: 0.9,
    description: 'Junior designer with fresh perspectives',
    specialties: ['Graphic Design', 'Branding', 'Illustration'],
    teamFit: ['designer', 'marketer']
  },
  {
    id: 'market1',
    name: 'Neha Verma',
    role: 'marketer',
    skill: 8,
    cost: 6500,
    salary: 8500,
    benefits: 1700,
    productivityMultiplier: 1.1,
    description: 'Digital marketing expert with growth experience',
    specialties: ['SEO', 'Social Media', 'Analytics'],
    teamFit: ['designer', 'developer']
  },
  {
    id: 'market2',
    name: 'Raj Malhotra',
    role: 'marketer',
    skill: 7,
    cost: 5000,
    salary: 7000,
    benefits: 1400,
    productivityMultiplier: 1.0,
    description: 'Content marketing and community building specialist',
    specialties: ['Content Creation', 'Community', 'Partnerships'],
    teamFit: ['marketer', 'designer']
  }
];

export const FEATURES = [
  // Core Features
  {
    id: 'auth',
    name: 'User Authentication',
    category: 'core',
    description: 'Secure login and registration system with 2FA',
    complexity: 16, // Increased from 12
    userValue: 8,
    cost: 5000,
    timeRequired: 15,
    maintenanceCost: 200,
    revenueImpact: 0,
    developmentCost: 5000
  },
  {
    id: 'profile',
    name: 'User Profiles',
    category: 'core',
    description: 'Customizable user profiles and settings',
    complexity: 12, // Increased from 6
    userValue: 6,
    cost: 3000,
    timeRequired: 10,
    maintenanceCost: 150,
    revenueImpact: 0,
    developmentCost: 3000
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    category: 'core',
    description: 'Advanced analytics dashboard with real-time updates',
    complexity: 18, // Increased from 14
    userValue: 9,
    cost: 7000,
    timeRequired: 20,
    maintenanceCost: 300,
    revenueImpact: 0,
    developmentCost: 7000
  },

  // Social Features
  {
    id: 'messaging',
    name: 'Real-time Messaging',
    category: 'social',
    description: 'Real-time chat with media sharing and encryption',
    complexity: 20, // Increased from 16
    userValue: 9,
    cost: 8000,
    timeRequired: 25,
    maintenanceCost: 400,
    revenueImpact: 500,
    developmentCost: 8000
  },
  {
    id: 'social-feed',
    name: 'Social Feed',
    category: 'social',
    description: 'AI-powered content feed with recommendation engine',
    complexity: 22, // Increased from 18
    userValue: 7,
    cost: 6000,
    timeRequired: 22,
    maintenanceCost: 350,
    revenueImpact: 300,
    developmentCost: 6000
  },
  {
    id: 'groups',
    name: 'Groups/Communities',
    category: 'social',
    description: 'Advanced group management with roles and permissions',
    complexity: 14, // Increased from 10
    userValue: 8,
    cost: 5500,
    timeRequired: 18,
    maintenanceCost: 250,
    revenueImpact: 400,
    developmentCost: 5500
  },

  // Business Features
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    category: 'business',
    description: 'Advanced analytics with ML-powered insights',
    complexity: 19, // Increased from 15
    userValue: 7,
    cost: 4000,
    timeRequired: 16,
    maintenanceCost: 300,
    revenueImpact: 600,
    developmentCost: 5000
  },
  {
    id: 'payments',
    name: 'Payment System',
    category: 'business',
    description: 'Multi-currency payment processing with blockchain integration',
    complexity: 24, // Increased from 20
    userValue: 8,
    cost: 10000,
    timeRequired: 30,
    maintenanceCost: 500,
    revenueImpact: 1000,
    developmentCost: 10000
  },
  {
    id: 'api',
    name: 'API Integration',
    category: 'business',
    description: 'Advanced API gateway with rate limiting and analytics',
    complexity: 17, // Increased from 13
    userValue: 6,
    cost: 6000,
    timeRequired: 20,
    maintenanceCost: 400,
    revenueImpact: 500,
    developmentCost: 6000
  }
];
