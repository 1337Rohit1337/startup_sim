import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, DollarSign, Users, Zap, Target, Eye, MousePointer, ShoppingCart, Heart, AlertTriangle,Check, Clock } from 'lucide-react';
import { getSuccessThreshold } from '@/data/successConditions';
// Types
import { 
  MonthlyMetrics, 
  MonthlyExpenses, 
  MonthlyEvent, 

} from '@/types/progression';

// Data

import { INITIAL_METRICS } from '@/data/monthlyMetrics';


// Utils
import { checkSuccessConditions } from '@/components/utils/successFailureChecks';
import { calculateMonthlyMetrics } from '@/components/utils/progressionCalculations';

// Components
import { SuccessFailureModal } from '@/components/launch/SuccessFailureModal';
// Marketing channels data
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
  updateMarketingScore: (score: number) => void; // Add this prop
  triggerEvent: (event: any) => void;
  updateFinances: (changes: any) => void; 
  resolveEvent: () => void;
  onComplete: () => void;
}

export const LaunchStage = ({ 
  gameState, 
  addSocialPost, 
  updateScore, 
  updateResources,
  updateMarketingScore, // Add this prop
  triggerEvent,
  resolveEvent,
  onComplete 
}: LaunchStageProps) => {
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

  // Add these new states at the top of your LaunchStage component
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
  const [monthlyDecisions, setMonthlyDecisions] = useState(false);

  
  
  const totalBudget = gameState.resources.money; // Use remaining money as marketing budget
  const allocatedBudget = Object.values(budgetAllocation).reduce((sum, amount) => sum + amount, 0);
  
  // Helper function to calculate marketing score
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
    
    // Budget allocation efficiency (penalize if budget is not allocated)
    const totalBudgetAllocated = Object.values(budget).reduce((sum, amount) => sum + amount, 0);
    const budgetEfficiency = totalBudgetAllocated > 0 ? 1 : 0.5;
    
    // Normalize to 0-100 scale
    const maxChannelScore = 3 * (9 + 9); // 3 channels with max reach and engagement
    const normalizedScore = (channelScore / maxChannelScore) * 100 * budgetEfficiency;
    
    return Math.round(Math.max(0, Math.min(100, normalizedScore)));
  };
  
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

    updateFinances({
    type: 'MARKETING_CAMPAIGN',
    costs: {
      campaignBudget: allocatedBudget,
      channelCosts: budgetAllocation,
      expectedRevenue: calculateExpectedRevenue()
    }
  });

      return;
    }
    
    setCampaignStarted(true);
    
    // Deduct marketing budget from resources
    updateResources({ money: totalBudget - allocatedBudget });
    
    // Simulate campaign metrics
    const simulateMetrics = () => {
      const channelData = selectedChannels.map(channelId => 
        MARKETING_CHANNELS.find(c => c.id === channelId)
      ).filter(Boolean);
      
      const totalReach = channelData.reduce((sum, channel) => sum + channel.reach, 0);
      const totalEngagement = channelData.reduce((sum, channel) => sum + channel.engagement, 0);
      const budgetMultiplier = Math.min(allocatedBudget / 3000, 3); // Budget efficiency
      
      // Team member bonus (marketing specialists boost performance)
      const marketingTeamMembers = gameState.teamMembers.filter((member: any) => 
        member.role === 'marketer'
      ).length;
      const teamBonus = 1 + (marketingTeamMembers * 0.3);
      
      // Feature bonus (more features = more to market)
      const featureBonus = 1 + (gameState.features.length * 0.1);
      
      const baseImpressions = totalReach * 1000 * budgetMultiplier * teamBonus;
      const baseClicks = baseImpressions * (totalEngagement / 100) * 0.02 * featureBonus;
      const baseConversions = baseClicks * 0.05 * teamBonus;
      const baseFollowers = baseImpressions * 0.001 * featureBonus;
      
      // Add randomness for realism
      const randomFactor = 0.8 + Math.random() * 0.4;
      
      const finalMetrics = {
        impressions: Math.round(baseImpressions * randomFactor),
        clicks: Math.round(baseClicks * randomFactor),
        conversions: Math.round(baseConversions * randomFactor),
        followers: Math.round(baseFollowers * randomFactor)
      };
      
      setMetrics(finalMetrics);
      
      // Add social posts based on performance
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
      
      // Stop after 10 updates (20 seconds)
      if (updateCount >= 10) {
        clearInterval(interval);
        setCampaignComplete(true);
        
        // Calculate marketing score based on channels and budget allocation
        const marketingScore = calculateMarketingScore(selectedChannels, budgetAllocation);
        
        // Update the marketing score in the game state
        updateMarketingScore(marketingScore);
        
        // Calculate performance bonus score
        const performanceScore = Math.round(
          (currentMetrics.impressions / 1000) * 0.1 +
          (currentMetrics.clicks / 100) * 0.5 +
          (currentMetrics.conversions) * 2 +
          (currentMetrics.followers / 10) * 0.3
        );
        
        updateScore(performanceScore);
        
        // Trigger success/failure events
        if (currentMetrics.conversions > 100) {
          triggerEvent({
            id: 'campaign_success',
            title: 'Campaign Success!',
            description: `Amazing! Your campaign generated ${currentMetrics.conversions} conversions. Marketing score: ${marketingScore}/100. Your startup is gaining real traction!`,
            type: 'success'
          });
          updateScore(500); // Bonus for successful campaign
        } else if (currentMetrics.conversions < 20) {
          triggerEvent({
            id: 'campaign_poor',
            title: 'Campaign Underperformed',
            description: `Your campaign only generated ${currentMetrics.conversions} conversions. Marketing score: ${marketingScore}/100. Consider adjusting your strategy for future campaigns.`,
            type: 'warning'
          });
        } else {
          // Medium performance
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
  
  
  const canProceed = selectedChannels.length >= 2 && allocatedBudget >= 1000;
  const canStartCampaign = canProceed && !campaignStarted && allocatedBudget <= totalBudget;

    const handleMonthlyDecision = () => {
    if (!canMakeDecision) return;
    
    // Update game state with the decisions
    updateFinances({
      type: 'ADD_FEATURE',
      developmentCost: allocatedBudget,
      maintenanceCost: calculateMaintenanceCosts()
    });

    // Update marketing score based on decisions
    const marketingScore = calculateMarketingScore(selectedChannels, budgetAllocation);
    updateMarketingScore(marketingScore);

    setMonthlyDecisionMade(true);
  };

  // Add this helper
  const canMakeDecision = 
    selectedChannels.length >= 2 && 
    allocatedBudget >= 1000 && 
    allocatedBudget <= totalBudget;
  
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
          {previousMetrics && (
            <div className="mt-2 text-sm">
              <Badge variant={monthlyMetrics.revenue > previousMetrics.revenue ? "success" : "destructive"}>
                {((monthlyMetrics.revenue - previousMetrics.revenue) / previousMetrics.revenue * 100).toFixed(1)}%
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">User Growth</p>
              <p className="text-2xl font-bold text-blue-600">
                {monthlyMetrics.userGrowth.toFixed(1)}%
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Total Users: {gameState.users.toLocaleString()}
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
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue Growth</span>
                  <span className="font-medium">
                    {((monthlyMetrics.revenue - (previousMetrics?.revenue || 0)) / 
                      (previousMetrics?.revenue || 1) * 100).toFixed(1)}%
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
              {Object.entries(successThresholds).map(([metric, threshold]) => {
                const current = monthlyMetrics[metric as keyof MonthlyMetrics];
                const isAchieved = current >= threshold;
                
                return (
                  <div key={metric} className="flex items-center gap-2">
                    {isAchieved ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className={isAchieved ? 'text-green-600' : 'text-amber-600'}>
                      {metric.replace(/([A-Z])/g, ' $1').trim()}: {current.toFixed(1)} / {threshold}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    )}

    {/* Next Month Button */}
    {monthlyDecisionMade && !showSuccessFailureModal && (
      <div className="text-center">
        <Button
          onClick={progressToNextMonth}
          size="lg"
          className="px-8"
        >
          Continue to Next Month
        </Button>
      </div>
    )}

    {/* Modals */}
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