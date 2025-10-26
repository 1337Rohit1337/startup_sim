import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkSuccessConditions } from '@/components/utils/successFailureChecks';
import { LiveMetrics } from '@/components/launch/LiveMetrics';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Zap, 
  Target, 
  Eye, 
  MousePointer, 
  ShoppingCart, 
  Heart, 
  AlertTriangle,
  Check, 
  Clock 
} from 'lucide-react';
import { getSuccessThreshold } from '@/data/successConditions';

// Types
import { 
  MonthlyMetrics, 
  MonthlyExpenses, 
  MonthlyEvent 
} from '@/types/progression';

// Data
import { INITIAL_METRICS } from '@/data/monthlyMetrics';

// Utils

import { calculateMonthlyMetrics } from '@/components/utils/progressionCalculations';

// Components
import { SuccessFailureModal } from '@/components/launch/SuccessFailureModal';

// Interfaces
interface MonthlyDecision {
  marketingBudget: number;
  serverInvestment: number;
  hiring: number;
  research: number;
}

interface LaunchStageProps {
  gameState: any;
  addSocialPost: (post: any) => void;
  updateScore: (points: number) => void;
  updateResources: (resources: any) => void;
  updateMarketingScore: (score: number) => void;
  triggerEvent: (event: any) => void;
  updateFinances: (changes: {
    type: string;
    costs?: {
      campaignBudget: number;
      channelCosts: Record<string, number>;
      expectedRevenue: number;
    };
    developmentCost?: number;
    maintenanceCost?: number;
  }) => void;
  resolveEvent: () => void;
  onComplete: () => void;
}

// Constants
const MARKETING_CHANNELS = [
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Visual content and stories for younger audiences',
    reach: 9,
    engagement: 8,
    cost: 1000,
    audience: 'Gen Z, Millennials'
  },
  {
    id: 'tiktok',
    name: 'Reels/Shorts Platform',
    description: 'Short-form viral video content',
    reach: 8,
    engagement: 9,
    cost: 800,
    audience: 'Gen Z, Young Millennials'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Long-form content and tutorials',
    reach: 7,
    engagement: 6,
    cost: 1500,
    audience: 'All ages, broad reach'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Traditional social media and ads',
    reach: 6,
    engagement: 5,
    cost: 1200,
    audience: 'Millennials, Gen X'
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Real-time updates and community engagement',
    reach: 5,
    engagement: 7,
    cost: 600,
    audience: 'Tech-savvy, professionals'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional networking and B2B marketing',
    reach: 4,
    engagement: 6,
    cost: 2000,
    audience: 'Professionals, B2B'
  }
];

export const LaunchStage = ({ 
  gameState, 
  addSocialPost, 
  updateScore, 
  updateResources,
  updateMarketingScore,
  triggerEvent,
  resolveEvent,
  updateFinances,
  onComplete 
}: LaunchStageProps) => {
  // State declarations
  const [monthlyDecisions, setMonthlyDecisions] = useState<MonthlyDecision>({
  marketingBudget: 0,
  serverInvestment: 0,
  hiring: 0,
  research: 0
});
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [budgetAllocation, setBudgetAllocation] = useState<Record<string, number>>({});
  const [campaignStarted, setCampaignStarted] = useState(false);
  const [campaignComplete, setCampaignComplete] = useState(false);

  
  const [metrics, setMetrics] = useState({
    impressions: 0,
    clicks: 0,
    conversions: 0,
    followers: 0
  });
  const [showLiveMetrics, setShowLiveMetrics] = useState(false);
  const [baseMetrics, setBaseMetrics] = useState({
  revenue: 0,
  users: 0,
  roi: 0
});
  const [currentMonth, setCurrentMonth] = useState(1);
  const [monthlyMetrics, setMonthlyMetrics] = useState<MonthlyMetrics>(INITIAL_METRICS);
  const [previousMetrics, setPreviousMetrics] = useState<MonthlyMetrics | null>(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpenses>({
    marketing: 0,
    servers: 0,
    salaries: 0,
    maintenance: 0,
    customerSupport: 0,
    total: 0
  });
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [showSuccessFailureModal, setShowSuccessFailureModal] = useState(false);

  const [monthlyDecisionMade, setMonthlyDecisionMade] = useState(false);

  // Derived state
  const totalBudget = gameState.resources.money;
  const allocatedBudget = Object.values(budgetAllocation).reduce((sum, amount) => sum + amount, 0);
  const canMakeDecision = selectedChannels.length >= 2 && allocatedBudget >= 1000 && allocatedBudget <= totalBudget;

  // Helper functions
  const calculateMaintenanceCosts = () => {
    return selectedChannels.reduce((total, channelId) => {
      const channel = MARKETING_CHANNELS.find(c => c.id === channelId);
      return total + (channel?.cost || 0) * 0.1; // 10% maintenance cost
    }, 0);
  };

  const calculateExpectedRevenue = () => {
    return selectedChannels.reduce((total, channelId) => {
      const channel = MARKETING_CHANNELS.find(c => c.id === channelId);
      if (!channel) return total;
      return total + (channel.reach * channel.engagement * 100);
    }, 0);
  };

  const calculateMarketingScore = (channels: string[], budget: Record<string, number>): number => {
    if (channels.length === 0) return 0;
    
    // Channel effectiveness score
    const channelReach = { instagram: 9, tiktok: 8, youtube: 7, facebook: 6, twitter: 5, linkedin: 4 };
    const channelEngagement = { instagram: 8, tiktok: 9, youtube: 6, facebook: 5, twitter: 7, linkedin: 6 };
    
    const channelScore = channels.reduce((sum, channelId) => {
      const reach = channelReach[channelId as keyof typeof channelReach] || 0;
      const engagement = channelEngagement[channelId as keyof typeof channelEngagement] || 0;
      return sum + (reach + engagement);
    }, 0);
    
    // Budget allocation efficiency
    const totalBudgetAllocated = Object.values(budget).reduce((sum, amount) => sum + amount, 0);
    const budgetEfficiency = totalBudgetAllocated > 0 ? 1 : 0.5;
    
    // Normalize to 0-100 scale
    const maxChannelScore = 3 * (9 + 9); // 3 channels with max reach and engagement
    const normalizedScore = (channelScore / maxChannelScore) * 100 * budgetEfficiency;
    
    return Math.round(Math.max(0, Math.min(100, normalizedScore)));
  };

    // Event Handlers
  const handleChannelToggle = (channelId: string) => {
    const channel = MARKETING_CHANNELS.find(c => c.id === channelId);
    if (!channel) return;
    
    if (selectedChannels.includes(channelId)) {
      // Remove channel
      const newChannels = selectedChannels.filter(id => id !== channelId);
      setSelectedChannels(newChannels);
      
      // Remove budget allocation
      const newBudget = { ...budgetAllocation };
      delete newBudget[channelId];
      setBudgetAllocation(newBudget);
    } else if (selectedChannels.length < 3) {
      // Add channel
      const newChannels = [...selectedChannels, channelId];
      setSelectedChannels(newChannels);
      
      // Set minimum budget
      setBudgetAllocation(prev => ({
        ...prev,
        [channelId]: channel.cost
      }));
    } else {
      triggerEvent({
        id: 'too_many_channels',
        title: 'Channel Limit Reached',
        description: 'You can only select up to 3 marketing channels for focused impact.',
        type: 'warning'
      });
    }
  };

  const handleBudgetChange = (channelId: string, amount: number) => {
    setBudgetAllocation(prev => ({
      ...prev,
      [channelId]: amount
    }));
  };

  const startCampaign = () => {
    if (allocatedBudget > totalBudget) {
      triggerEvent({
        id: 'insufficient_budget',
        title: 'Insufficient Budget',
        description: `You've allocated $${allocatedBudget.toLocaleString()} but only have $${totalBudget.toLocaleString()} available.`,
        type: 'error'
      });
      return;
    }

    setCampaignStarted(true);
    updateResources({ money: totalBudget - allocatedBudget });
    updateFinances({
      type: 'MARKETING_CAMPAIGN',
      costs: {
        campaignBudget: allocatedBudget,
        channelCosts: budgetAllocation,
        expectedRevenue: calculateExpectedRevenue()
      }
    });

    // Simulate campaign metrics
    const simulateMetrics = () => {
      const channelData = selectedChannels.map(channelId => 
        MARKETING_CHANNELS.find(c => c.id === channelId)
      ).filter(Boolean);
      
      const totalReach = channelData.reduce((sum, channel) => sum + channel.reach, 0);
      const totalEngagement = channelData.reduce((sum, channel) => sum + channel.engagement, 0);
      const budgetMultiplier = Math.min(allocatedBudget / 3000, 3);
      
      const marketingTeamMembers = gameState.teamMembers.filter((member: any) => 
        member.role === 'marketer'
      ).length;
      const teamBonus = 1 + (marketingTeamMembers * 0.3);
      const featureBonus = 1 + (gameState.features.length * 0.1);
      
      const baseImpressions = totalReach * 1000 * budgetMultiplier * teamBonus;
      const baseClicks = baseImpressions * (totalEngagement / 100) * 0.02 * featureBonus;
      const baseConversions = baseClicks * 0.05 * teamBonus;
      const baseFollowers = baseImpressions * 0.001 * featureBonus;
      
      const randomFactor = 0.8 + Math.random() * 0.4;
      
      const finalMetrics = {
        impressions: Math.round(baseImpressions * randomFactor),
        clicks: Math.round(baseClicks * randomFactor),
        conversions: Math.round(baseConversions * randomFactor),
        followers: Math.round(baseFollowers * randomFactor)
      };
      
      setMetrics(finalMetrics);
      
      if (finalMetrics.impressions > 50000) {
        addSocialPost({
          id: Date.now(),
          platform: selectedChannels[0],
          content: "🚀 We're going viral! Our launch campaign is exceeding expectations!",
          engagement: finalMetrics.clicks,
          timestamp: new Date().toISOString()
        });
      }
      
      return finalMetrics;
    };

    // Simulate real-time updates
    let updateCount = 0;
    const interval = setInterval(() => {
      const currentMetrics = simulateMetrics();
      updateCount++;
      
      if (updateCount >= 10) {
        clearInterval(interval);
        setCampaignComplete(true);
        
        const marketingScore = calculateMarketingScore(selectedChannels, budgetAllocation);
        updateMarketingScore(marketingScore);
        
        const performanceScore = Math.round(
          (currentMetrics.impressions / 1000) * 0.1 +
          (currentMetrics.clicks / 100) * 0.5 +
          (currentMetrics.conversions) * 2 +
          (currentMetrics.followers / 10) * 0.3
        );
        
        updateScore(performanceScore);
        
        // Trigger appropriate event based on performance
        if (currentMetrics.conversions > 100) {
          triggerEvent({
            id: 'campaign_success',
            title: 'Campaign Success!',
            description: `Amazing! Your campaign generated ${currentMetrics.conversions} conversions. Marketing score: ${marketingScore}/100. Your startup is gaining real traction!`,
            type: 'success'
          });
          updateScore(500);
        } else if (currentMetrics.conversions < 20) {
          triggerEvent({
            id: 'campaign_poor',
            title: 'Campaign Underperformed',
            description: `Your campaign only generated ${currentMetrics.conversions} conversions. Marketing score: ${marketingScore}/100. Consider adjusting your strategy for future campaigns.`,
            type: 'warning'
          });
        } else {
          triggerEvent({
            id: 'campaign_moderate',
            title: 'Campaign Complete',
            description: `Your campaign generated ${currentMetrics.conversions} conversions. Marketing score: ${marketingScore}/100. Solid performance with room for improvement!`,
            type: 'info'
          });
        }
      }
    }, 2000);
  };
      const handleMetricsComplete = () => {
  setShowLiveMetrics(false);}
  const handleMonthlyDecision = () => {
    if (!canMakeDecision) return;
    
    // Update monthly decisions with actual values
      setBaseMetrics({
    revenue: monthlyMetrics.revenue,
    users: gameState.users,
    roi: monthlyMetrics.marketingROI * 100
  });
  
    setShowLiveMetrics(true);
    setMonthlyDecisions({
      marketingBudget: allocatedBudget,
      serverInvestment: Math.round(allocatedBudget * 0.1), // 10% for server maintenance
      hiring: 0,
      research: 0
    });


    // Deduct the allocated budget from available money
    updateResources({ 
      money: gameState.resources.money - allocatedBudget 
    });

    updateFinances({
      type: 'MARKETING_CAMPAIGN',
      costs: {
        campaignBudget: allocatedBudget,
        channelCosts: budgetAllocation,
        expectedRevenue: calculateExpectedRevenue()
      },
      maintenanceCost: calculateMaintenanceCosts()
    });

    const marketingScore = calculateMarketingScore(selectedChannels, budgetAllocation);
    updateMarketingScore(marketingScore);

    setMonthlyDecisionMade(true);
  };


  const handleInvestment = (debtAmount: number) => {
  const investmentAmount = Math.abs(debtAmount) + 5000; // Extra buffer money
  const investorNames = [
    'Sequoia Capital',
    'Y Combinator',
    'Andreessen Horowitz',
    'SoftBank Vision Fund',
    'Accel Partners'
  ];
  
  const randomInvestor = investorNames[Math.floor(Math.random() * investorNames.length)];
  
  triggerEvent({
    id: 'investment_received',
    title: 'Investment Secured! 🎉',
    description: `Due to your startup's potential, ${randomInvestor} has invested $${investmentAmount.toLocaleString()} in your company to help overcome the cash flow challenges.`,
    type: 'success'
  });

  updateResources({
    money: gameState.resources.money + investmentAmount
  });

  return investmentAmount;
};
const MONTHS_PER_STEP = 3;

const progressToNextMonth = async () => {
  try {
    // Progress multiple months at once
    for (let i = 0; i < MONTHS_PER_STEP; i++) {
      setPreviousMetrics(monthlyMetrics);

      // Market impact factors
      const marketingEffectiveness = selectedChannels.reduce((total, channelId) => {
        const channel = MARKETING_CHANNELS.find(c => c.id === channelId);
        return total + (channel?.reach || 0) * (channel?.engagement || 0);
      }, 0) / 100;

      const budgetEfficiency = allocatedBudget > 0 ? 
        Math.min(allocatedBudget / (gameState.resources.money * 0.3), 1.5) : 0.5;

      // Calculate user growth with marketing impact
      const baseUserGrowthRate = 0.05; // 5% base growth
      const marketingUserGrowthRate = marketingEffectiveness * budgetEfficiency * 0.2;
      const totalUserGrowthRate = baseUserGrowthRate + marketingUserGrowthRate;
      
      const currentUsers = gameState.users;
      const newUsers = Math.round(currentUsers * (1 + totalUserGrowthRate));
      const userGrowthPercentage = ((newUsers - currentUsers) / currentUsers) * 100;

      // Calculate revenue components
      const baseRevenue = monthlyMetrics.revenue || 1000;
      const averageRevenuePerUser = 5; // $5 per user
      const conversionRate = (monthlyMetrics.conversionRate || 1) / 100;
      
      // Revenue from different sources
      const userRevenue = newUsers * conversionRate * averageRevenuePerUser;
      const marketingRevenue = marketingEffectiveness * budgetEfficiency * 1000;
      const baseGrowth = baseRevenue * 0.1; // 10% base growth

      // Calculate new total revenue
      const newRevenue = Math.round(baseRevenue + userRevenue + marketingRevenue + baseGrowth);

      // Calculate expenses
      const expenses = {
        marketing: allocatedBudget,
        servers: monthlyDecisions.serverInvestment,
        maintenance: calculateMaintenanceCosts(),
        salaries: (gameState.teamMembers?.length || 0) * 5000,
        overhead: 2000
      };

      const totalExpenses = Object.values(expenses).reduce((sum, cost) => sum + cost, 0);
      const monthlyProfit = newRevenue - totalExpenses;

      // Update metrics with balanced growth
      const newMetrics: MonthlyMetrics = {
        revenue: newRevenue,
        userGrowth: userGrowthPercentage, // Use actual calculated growth percentage
        customerSatisfaction: Math.min(
          monthlyMetrics.customerSatisfaction * 
          (monthlyMetrics.serverUptime / 100) * 
          (1 - monthlyMetrics.churnRate / 200),
          100
        ),
        serverUptime: Math.min(
          monthlyMetrics.serverUptime + 
          (monthlyDecisions.serverInvestment / 1000),
          99.99
        ),
        marketingROI: allocatedBudget > 0 ?
          (newRevenue - baseRevenue) / allocatedBudget : 0,
        cashflow: monthlyProfit,
        churnRate: Math.max(
          2,
          15 - (monthlyMetrics.customerSatisfaction / 10)
        ),
        conversionRate: Math.min(
          5 + (marketingEffectiveness * 10) * 
          (monthlyMetrics.customerSatisfaction / 100),
          30
        )
      };

      // Check if company needs investment
      let finalMoney = gameState.resources.money + monthlyProfit;
      if (finalMoney < 0) {
        const investmentAmount = handleInvestment(finalMoney);
        finalMoney += investmentAmount;
      }

      // Log before update
      console.log('Before Update:', {
        currentUsers,
        newUsers,
        userGrowth: userGrowthPercentage,
        money: finalMoney
      });

      // Update game resources
      await updateResources({
        users: newUsers,
        money: finalMoney
      });

      // Log after update
      console.log('After Update:', {
        users: gameState.users,
        money: gameState.resources.money
      });

      // Log monthly report
      console.log('Monthly Financial Report:', {
        month: currentMonth + i + 1,
        baseRevenue,
        userRevenue,
        marketingRevenue,
        newRevenue,
        totalExpenses,
        profit: monthlyProfit,
        userGrowth: userGrowthPercentage,
        marketingEffectiveness
      });

      setMonthlyMetrics(newMetrics);
      setCurrentMonth(prev => prev + 1);
    }

    // Reset decisions after multiple months
    setMonthlyDecisionMade(false);
    setSelectedChannels([]);
    setBudgetAllocation({});

    // Random market events (20% chance)
    if (Math.random() > 0.8) {
      const isPositive = Math.random() > 0.5;
      const eventImpact = isPositive ? 
        (1 + Math.random() * 0.2) : // Positive: 100-120% 
        (0.8 + Math.random() * 0.2); // Negative: 80-100%

      const updatedMetrics = {
        ...monthlyMetrics,
        revenue: Math.round(monthlyMetrics.revenue * eventImpact),
        userGrowth: monthlyMetrics.userGrowth * eventImpact
      };

      setMonthlyMetrics(updatedMetrics);

      triggerEvent({
        id: 'market_shift',
        title: 'Market Shift!',
        description: isPositive ?
          'Market trends are favoring your product! User acquisition has improved.' :
          'A competitor has launched a new feature. User acquisition costs have increased.',
        type: isPositive ? 'success' : 'warning'
      });
    }

    // Check for game completion
    if (currentMonth >= 12) {
      setShowSuccessFailureModal(true);
    }

    setShowLiveMetrics(false);
  } catch (error) {
    console.error('Error progressing to next month:', error);
    triggerEvent({
      id: 'month_progress_error',
      title: 'Error',
      description: 'Failed to progress to next month',
      type: 'error'
    });
  }
};
    return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Stage 3: Launch & Market
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Guide your startup through monthly marketing decisions and track your growth metrics.
        </p>
      </div>

      {/* Current Event Display */}
      {gameState.currentEvent && (
        <Alert className={`border-2 ${
          gameState.currentEvent.type === 'error' ? 'border-red-200 bg-red-50' :
          gameState.currentEvent.type === 'success' ? 'border-green-200 bg-green-50' :
          'border-yellow-200 bg-yellow-50'
        }`}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>{gameState.currentEvent.title}</strong>
                <p className="text-sm mt-1">{gameState.currentEvent.description}</p>
              </div>
              <Button size="sm" onClick={resolveEvent}>
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Month and Progress Overview */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Month {currentMonth}</h3>
            <p className="text-sm text-gray-600">
              {currentMonth <= 3 ? 'Early Stage' : 
               currentMonth <= 6 ? 'Growth Stage' : 
               'Optimization Stage'}
            </p>
          </div>
          <Badge variant="outline" className="text-lg">
            ${gameState.resources.money.toLocaleString()} Available
          </Badge>
        </div>
        <Progress 
          value={(currentMonth / 12) * 100} 
          className="h-2 mb-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>Launch</span>
          <span>Growth</span>
          <span>Optimization</span>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${monthlyMetrics.revenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          
          </CardContent>
        </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Users</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(gameState.users * (1 + monthlyMetrics.userGrowth/100)).toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            
            <br />
            Growth: {monthlyMetrics.userGrowth.toFixed(1)}%
          </div>
        </CardContent>
      </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-purple-600">
                  {monthlyMetrics.customerSatisfaction.toFixed(1)}%
                </p>
              </div>
              <Heart className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Marketing ROI</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(monthlyMetrics.marketingROI * 100).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Marketing Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Monthly Marketing Strategy
            </div>
            <Badge variant={monthlyDecisionMade ? "success" : "outline"}>
              {monthlyDecisionMade ? "Decisions Made" : "Decisions Needed"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Channel Selection */}
            <div>
              <h4 className="font-medium mb-3">Active Marketing Channels</h4>
              <div className="grid grid-cols-3 gap-3">
                {MARKETING_CHANNELS.map((channel) => {
                  const isSelected = selectedChannels.includes(channel.id);
                  const canSelect = selectedChannels.length < 3 || isSelected;
                  
                  return (
                    <div
                      key={channel.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : !canSelect 
                          ? 'opacity-50' 
                          : 'hover:border-blue-200'
                      }`}
                      onClick={() => canSelect && handleChannelToggle(channel.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{channel.name}</p>
                        <Badge variant="outline">
                          ${channel.cost.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reach</span>
                          <span>{channel.reach}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Engagement</span>
                          <span>{channel.engagement}/10</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Budget Allocation */}
            {selectedChannels.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Budget Allocation</h4>
                <div className="space-y-4">
                  {selectedChannels.map(channelId => {
                    const channel = MARKETING_CHANNELS.find(c => c.id === channelId);
                    if (!channel) return null;
                    
                    const currentAllocation = budgetAllocation[channelId] || channel.cost;
                    const percentage = (currentAllocation / totalBudget) * 100;
                    
                    return (
                      <div key={channelId} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>{channel.name}</span>
                          <span className="font-medium">
                            ${currentAllocation.toLocaleString()} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Slider
                          value={[currentAllocation]}
                          onValueChange={([value]) => handleBudgetChange(channelId, value)}
                          min={channel.cost}
                          max={Math.max(totalBudget, channel.cost)}
                          step={100}
                          className="w-full"
                          disabled={monthlyDecisionMade}
                        />
                      </div>
                    );
                  })}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Total Allocation</span>
                      <span className={allocatedBudget > totalBudget ? 'text-red-600' : 'text-green-600'}>
                        ${allocatedBudget.toLocaleString()} / ${totalBudget.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(allocatedBudget / totalBudget) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Decision Button */}
            {!monthlyDecisionMade && (
              <div className="flex justify-end">
                <Button
                  onClick={handleMonthlyDecision}
                  disabled={!canMakeDecision}
                  size="lg"
                >
                  {canMakeDecision ? (
                    'Confirm Monthly Strategy'
                  ) : (
                    `Select channels and allocate budget`
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance Analysis */}
      {monthlyDecisionMade && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Growth Metrics</h4>
                <div className="space-y-2">
                <div className="flex justify-between">
                  <span>New Users</span>
                  <span className="font-medium">
                    {Math.round(gameState.users * (monthlyMetrics.userGrowth / 100)).toLocaleString()} 
                    <span className="text-sm text-gray-500">

                    </span>
                  </span>
                </div>
                  <div className="flex justify-between">
                    <span>Revenue Growth</span>
                      <span className="font-medium">
                        {(() => {
                          if (!previousMetrics?.revenue) return '0.0%';
                          const growth = ((monthlyMetrics.revenue - previousMetrics.revenue) / previousMetrics.revenue) * 100;
                          return `${growth.toFixed(1)}%`;
                        })()}
                      </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marketing ROI</span>
                    <span className="font-medium">
                      {(monthlyMetrics.marketingROI * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Health Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Customer Satisfaction</span>
                    <span className="font-medium">
                      {monthlyMetrics.customerSatisfaction.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Churn Rate</span>
                    <span className="font-medium">
                      {monthlyMetrics.churnRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Server Uptime</span>
                    <span className="font-medium">
                      {monthlyMetrics.serverUptime.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Indicators */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Monthly Objectives</h4>
            <div className="space-y-2">
              {Object.entries(getSuccessThreshold(currentMonth)).map(([metric, threshold]) => {
                // Type guard to ensure metric is a valid key of MonthlyMetrics
                if (!(metric in monthlyMetrics)) return null;
                
                const current = monthlyMetrics[metric as keyof MonthlyMetrics];
                const isAchieved = typeof current === 'number' && current >= threshold;
                
                return (
                  <div key={metric} className="flex items-center gap-2">
                    {isAchieved ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className={isAchieved ? 'text-green-600' : 'text-amber-600'}>
                      {metric.replace(/([A-Z])/g, ' $1').trim()}: {current?.toFixed(1) || '0.0'} / {threshold}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          </CardContent>
        </Card>
      )}

        {showLiveMetrics && (
        <LiveMetrics
          metrics={{
            impressions: metrics.impressions,
            clicks: metrics.clicks,
            conversions: metrics.conversions,
            followers: metrics.followers,
            revenue: monthlyMetrics.revenue,
            users: Math.round(gameState.users * (1 + monthlyMetrics.userGrowth / 100)), // Changed this line
            roi: monthlyMetrics.marketingROI * 100
          }}
          baseMetrics={{
            ...baseMetrics,
            users: gameState.users, // Add this to show starting point
          }}
          isActive={monthlyDecisionMade && !showSuccessFailureModal}
          duration={5000}
          onComplete={handleMetricsComplete}
        />
  )}

      {/* Next Month Button */}
      {monthlyDecisionMade && !showSuccessFailureModal && (
        <div className="text-center">
          <Button
            onClick={progressToNextMonth}
            size="lg"
            className="px-8"
          >
            Progress {MONTHS_PER_STEP} Months
          </Button>
        </div>
      )}

      {/* Success/Failure Modal */}
      {showSuccessFailureModal && (
        <SuccessFailureModal
          isOpen={showSuccessFailureModal}
          result={checkSuccessConditions(monthlyMetrics, currentMonth, gameState)}
          gameState={gameState}
          onRestart={() => {
            setShowSuccessFailureModal(false);
            // Handle restart
          }}
          onClose={() => setShowSuccessFailureModal(false)}
        />
      )}
    </div>
  );
};