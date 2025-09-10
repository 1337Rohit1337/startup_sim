import { useState, useCallback } from 'react';
import { GameState, GameChoices, GameScores } from '@/types/game';

// Extended game state to match GameShell expectations

interface TeamMember {
  id: string;
  name: string;
  role: string;
  skill: number;
  cost: number;
  description: string;
  specialties: string[];
}

interface Feature {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: number;
  userValue: number;
  cost: number;
  timeRequired: number;
}

interface ExtendedGameState extends GameState {
  stage: 'foundation' | 'build' | 'launch';
  score: number;
  resources: {
    money: number;
    time: number;
  };
  teamSkill: number;
  morale: number;
  teamMembers: TeamMember[];
  features: Feature[];
  socialPosts: any[];
  currentEvent: any;
  triggerEvent?: (event: any) => void
}

const initialGameState: ExtendedGameState = {
  currentStage: 1,
  scores: {
    foundation: 0,
    development: 0,
    marketing: 0,
    overall: 0
  },
  choices: {
    validation: [],
    teamMembers: [],
    features: [],
    brandColor: '#3b82f6',
    marketingChannels: [],
    budgetAllocation: {}
  },
  completed: false,
  xp: 0,
  level: 1,
  coins: 100,
  // Added properties that GameShell expects
  stage: 'foundation',
  score: 0,
  resources: {
    money: 23000,
    time: 100
  },
  morale: 75,
  teamMembers: [],
  features: [],
  teamSkill: 0,
  socialPosts: [],
  currentEvent: null
};



const calculateTeamSkill = (members: TeamMember[]): number => {
  if (members.length === 0) return 0;
  const totalSkill = members.reduce((sum, member) => sum + member.skill, 0);
  return Math.round(totalSkill / members.length);
};

const canHandleFeatureComplexity = (teamSkill: number, feature: Feature): boolean => {
  return (teamSkill * 2) >= feature.complexity;
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<ExtendedGameState>(initialGameState);
  const [isLoading, setIsLoading] = useState(false);

    const triggerEvent = useCallback((event: any) => {
    setGameState(prev => ({
      ...prev,
      currentEvent: event
    }));
  }, []);

  const updateChoices = useCallback((newChoices: Partial<GameChoices>) => {
    setGameState(prev => ({
      ...prev,
      choices: { ...prev.choices, ...newChoices }
    }));
  }, []);

  // Add the missing updateMorale function
  const updateMorale = useCallback((change: number) => {
    setGameState(prev => ({
      ...prev,
      morale: Math.max(0, Math.min(100, prev.morale + change))
    }));
  }, []);

  // New functions that GameShell expects
const updateScore = useCallback((points: number) => {
  setGameState(prev => {
    // Add to raw score (xp-like system, if needed)
    const newScore = prev.score + points;

    // Recalculate overall properly
    const overall = Math.min(100, Math.round(
      prev.scores.foundation * 0.3 +
      prev.scores.development * 0.35 +
      prev.scores.marketing * 0.35
    ));

    return {
      ...prev,
      score: newScore,
      scores: {
        ...prev.scores,
        overall
      }
    };
  });
}, []);


  const updateResources = useCallback((resourceUpdates: Partial<{ money: number; time: number }>) => {
    setGameState(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        ...resourceUpdates
      }
    }));
  }, []);

const addTeamMember = useCallback((member: TeamMember) => {
  setGameState(prev => {
    const newTeamMembers = [...prev.teamMembers, member];
    const newTeamSkill = calculateTeamSkill(newTeamMembers);
    
    const newChoices = {
      ...prev.choices,
      teamMembers: [...prev.choices.teamMembers, member.id]
    };
    
    const developmentScore = calculateDevelopmentScoreHelper(newChoices.teamMembers, newChoices.features);
    
    const overall = Math.round(
      prev.scores.foundation * 0.3 + 
      developmentScore * 0.35 + 
      prev.scores.marketing * 0.35
    );
    
    return {
      ...prev,
      teamMembers: newTeamMembers,
      teamSkill: newTeamSkill,
      choices: newChoices,
      resources: {
        ...prev.resources,
        money: prev.resources.money - (member.cost || 0)
      },
      scores: {
        ...prev.scores,
        development: developmentScore,
        overall: overall
      },
      score: overall
    };
  });
}, []);

  const addFeature = useCallback((feature: Feature) => {
  setGameState(prev => {
    if (!canHandleFeatureComplexity(prev.teamSkill, feature)) {
      triggerEvent({
        id: 'complexity_warning',
        title: 'Team Skill Warning',
        description: `Your team's skill level (${prev.teamSkill}) is too low for ${feature.name} (Complexity: ${feature.complexity}). Consider hiring more skilled developers or choosing a less complex feature.`,
        type: 'warning'
      });
      return prev; // Return previous state without changes
    }

    const newFeatures = [...prev.features, feature];
    const newChoices = {
      ...prev.choices,
      features: [...prev.choices.features, feature.id]
    };
    
    const developmentScore = calculateDevelopmentScoreHelper(newChoices.teamMembers, newChoices.features);
    
    const overall = Math.round(
      prev.scores.foundation * 0.3 + 
      developmentScore * 0.35 + 
      prev.scores.marketing * 0.35
    );
    
    return {
      ...prev,
      features: newFeatures,
      choices: newChoices,
      resources: {
        ...prev.resources,
        money: prev.resources.money - (feature.cost || 0),
        time: prev.resources.time - (feature.timeRequired || 0)
      },
      scores: {
        ...prev.scores,
        development: developmentScore,
        overall: overall
      },
      score: overall
    };
  });
}, [triggerEvent]);

  const removeFeature = useCallback((feature: Feature) => {
  setGameState(prev => {
    const newFeatures = prev.features.filter(f => f.id !== feature.id);
    const newChoices = {
      ...prev.choices,
      features: prev.choices.features.filter(id => id !== feature.id)
    };
    
    // Calculate development score immediately
    const developmentScore = calculateDevelopmentScoreHelper(newChoices.teamMembers, newChoices.features);
    
    // Calculate new overall score
    const overall = Math.round(
      prev.scores.foundation * 0.3 + 
      developmentScore * 0.35 + 
      prev.scores.marketing * 0.35
    );
    
    return {
      ...prev,
      features: newFeatures,
      choices: newChoices,
      resources: {
        ...prev.resources,
        money: prev.resources.money + (feature.cost || 0), // Refund the cost
        time: prev.resources.time + (feature.timeRequired || 0) // Refund the time
      },
      scores: {
        ...prev.scores,
        development: developmentScore,
        overall: overall
      },
      score: overall
    };
  });
}, []);


  const updateMarketingScore = useCallback((marketingScore: number) => {
    setGameState(prev => {
      const newScores = {
        ...prev.scores,
        marketing: marketingScore,
        overall: Math.round(
          prev.scores.foundation * 0.3 + 
          prev.scores.development * 0.35 + 
          marketingScore * 0.35
        )
      };
      
      return {
        ...prev,
        scores: newScores,
        score: newScores.overall
      };
    });
  }, []);



  const resolveEvent = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentEvent: null
    }));
  }, []);

  const addSocialPost = useCallback((post: any) => {
    setGameState(prev => ({
      ...prev,
      socialPosts: [...prev.socialPosts, post]
    }));
  }, []);

  const canAddFeature = useCallback((feature: Feature) => {
    if (!feature) return false;
    
    // Get the most current state values
    const currentFeature = gameState.features.find(f => f.id === feature.id);
    const wasRemoved = gameState.choices.features.includes(feature.id);
    
    // If the feature was previously added and removed, use the original cost and time
    const featureCost = currentFeature ? 0 : feature.cost;
    const featureTime = currentFeature ? 0 : feature.timeRequired;
    if (wasRemoved) return true;
    
    return (
      gameState.resources.money >= featureCost &&
      gameState.resources.time >= featureTime &&
      (gameState.teamSkill * 2) >= feature.complexity
    );
  }, [gameState.resources, gameState.teamSkill, gameState.features]);

  // Helper functions for score calculations (moved outside to avoid dependency issues)
  const calculateFoundationScoreHelper = (validationChoices: number[]): number => {
    if (validationChoices.length === 0) return 0;
    
    // Base score from validation choices
    const validationScore = validationChoices.reduce((sum, choiceId) => {
      // Find the impact of each validation choice
      const impacts = [8, 6, 3, 7, -5]; // Corresponding to VALIDATION_CHOICES impacts
      const impact = impacts[choiceId - 1] || 0;
      return sum + impact;
    }, 0);
    
    // Normalize to 0-100 scale
    const maxPossibleScore = 8 + 7 + 6; // Top 3 choices
    const normalizedScore = Math.max(0, Math.min(100, (validationScore / maxPossibleScore) * 100));
    
    return Math.round(normalizedScore);
  };

  const calculateDevelopmentScoreHelper = (teamMembers: string[], features: string[]): number => {
    if (teamMembers.length === 0) return 0;
    
    // Team quality score (based on skill levels)
    const teamSkills = [8, 6, 9, 5, 8, 4]; // Corresponding to TEAM_MEMBERS skills
    const teamScore = teamMembers.reduce((sum, memberId) => {
      const memberIndex = parseInt(memberId.slice(-1)) - 1;
      return sum + (teamSkills[memberIndex] || 0);
    }, 0);
    
    // Feature selection score (based on user value vs complexity)
    const featureValues = [8, 6, 9, 7, 5, 4]; // Corresponding to FEATURES userValue
    const featureComplexities = [3, 2, 4, 3, 2, 3]; // Corresponding to FEATURES complexity
    const featureScore = features.reduce((sum, featureId) => {
      const featureIndex = ['auth', 'profile', 'messaging', 'search', 'notifications', 'analytics'].indexOf(featureId);
      if (featureIndex !== -1) {
        const value = featureValues[featureIndex];
        const complexity = featureComplexities[featureIndex];
        return sum + (value / complexity) * 10;
      }
      return sum;
    }, 0);
    
    // Normalize to 0-100 scale
    const maxTeamScore = 3 * 9; // 3 team members with max skill
    const maxFeatureScore = 3 * (9 / 2) * 10; // 3 features with best value/complexity ratio
    const normalizedScore = ((teamScore / maxTeamScore) * 50) + ((featureScore / maxFeatureScore) * 50);
    
    return Math.round(Math.max(0, Math.min(100, normalizedScore)));
  };

  const calculateMarketingScoreHelper = (channels: string[], budgetAllocation: Record<string, number>): number => {
    if (channels.length === 0) return 0;
    
    // Channel effectiveness score
    const channelReach = { instagram: 9, tiktok: 8, youtube: 7, facebook: 6, twitter: 5 };
    const channelEngagement = { instagram: 8, tiktok: 9, youtube: 6, facebook: 5, twitter: 7 };
    
    const channelScore = channels.reduce((sum, channelId) => {
      const reach = channelReach[channelId as keyof typeof channelReach] || 0;
      const engagement = channelEngagement[channelId as keyof typeof channelEngagement] || 0;
      return sum + (reach + engagement);
    }, 0);
    
    // Budget allocation efficiency (penalize if budget is not allocated)
    const totalBudget = Object.values(budgetAllocation).reduce((sum, amount) => sum + amount, 0);
    const budgetEfficiency = totalBudget > 0 ? 1 : 0.5;
    
    // Normalize to 0-100 scale
    const maxChannelScore = 3 * (9 + 9); // 3 channels with max reach and engagement
    const normalizedScore = (channelScore / maxChannelScore) * 100 * budgetEfficiency;
    
    return Math.round(Math.max(0, Math.min(100, normalizedScore)));
  };

  // Foundation stage specific - when idea is validated
  const validateIdea = useCallback((ideaPotential: number) => {
    setGameState(prev => {
      // Calculate foundation score based on idea potential
      const foundationScore = Math.round(ideaPotential * 10);
      const newChoices = {
        ...prev.choices,
        validation: [1] // Mark as validated
      };
      
      const overall = Math.round(
        foundationScore * 0.3 + 
        prev.scores.development * 0.35 + 
        prev.scores.marketing * 0.35
      );
      
      return {
        ...prev,
        choices: newChoices,
        scores: {
          ...prev.scores,
          foundation: foundationScore,
          overall: overall
        },
        score: overall
      };
    });
  }, []);

  const updateScores = useCallback(() => {
    const { choices } = gameState;
    
    const foundationScore = calculateFoundationScoreHelper(choices.validation);
    const developmentScore = calculateDevelopmentScoreHelper(choices.teamMembers, choices.features);
    const marketingScore = calculateMarketingScoreHelper(choices.marketingChannels, choices.budgetAllocation);
    
    // Calculate overall score with weights
    const overall = Math.round(
      foundationScore * 0.3 + 
      developmentScore * 0.35 + 
      marketingScore * 0.35
    );
    
    const newScores: GameScores = {
      foundation: foundationScore,
      development: developmentScore,
      marketing: marketingScore,
      overall
    };
    
    setGameState(prev => ({
      ...prev,
      scores: newScores,
      score: overall // Update the score property too
    }));
    
    return newScores;
  }, [gameState.choices]);

  const nextStage = useCallback(async () => {
    setIsLoading(true);
    
    // Check team capability for all features
    const problematicFeatures = gameState.features.filter(feature => {
      const teamSkill = gameState.teamMembers.reduce((sum, member) => sum + member.skill, 0) / 
                       gameState.teamMembers.length;
      return feature.complexity * 2 > teamSkill;
    });

    await new Promise(resolve => setTimeout(resolve, 2000)); // Loading animation

    if (problematicFeatures.length > 0) {
      triggerEvent({
        id: 'team_capability_warning',
        title: 'Team Capability Warning',
        description: `Your team may struggle with: ${problematicFeatures.map(f => f.name).join(', ')}. Consider upgrading your team or simplifying features.`,
        type: 'warning'
      });
      setIsLoading(false);
      return;
    }

    setGameState(prev => {
      let newStage: 'foundation' | 'build' | 'launch' = prev.stage;
      
      if (prev.currentStage === 1) newStage = 'build';
      else if (prev.currentStage === 2) newStage = 'launch';
      
      const xpGain = Math.round(prev.scores.overall * 0.1);
      
      return {
        ...prev,
        currentStage: prev.currentStage + 1,
        stage: newStage,
        xp: prev.xp + xpGain,
        coins: prev.coins + Math.round(xpGain * 0.5),
        completed: prev.currentStage >= 3
      };
    });
    
    setIsLoading(false);
  }, [gameState.features, gameState.teamMembers, triggerEvent]);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  return {
    gameState,
    updateChoices,
    nextStage,
    resetGame,
    updateScores,
    validateIdea, // Add this for foundation stage
    // New functions that GameShell expects
    updateScore,
    updateResources,
    updateMorale, // Added missing function
    addTeamMember,
    addFeature,
    triggerEvent,
    resolveEvent,
    addSocialPost,
    canAddFeature,
    updateMarketingScore,
    isLoading,
    removeFeature,
  };
};