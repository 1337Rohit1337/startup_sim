import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, DollarSign, Users, Zap, Target, Eye, MousePointer, ShoppingCart, Heart, AlertTriangle } from 'lucide-react';

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

interface LaunchStageProps {
  gameState: any;
  addSocialPost: (post: any) => void;
  updateScore: (points: number) => void;
  updateResources: (resources: any) => void;
  updateMarketingScore: (score: number) => void; // Add this prop
  triggerEvent: (event: any) => void;
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
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Stage 3: Launch & Market
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          It's time to launch your startup to the world! Choose your marketing channels 
          and allocate your budget wisely to maximize reach and conversions.
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

      {/* Resources & Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Marketing Budget</p>
                <p className="text-2xl font-bold text-green-600">${gameState.resources.money}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Size</p>
                <p className="text-2xl font-bold text-blue-600">{gameState.teamMembers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Features Built</p>
                <p className="text-2xl font-bold text-purple-600">{gameState.features.length}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Morale</p>
                <p className="text-2xl font-bold text-red-600">{gameState.morale}%</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
        
      {/* Budget Allocation Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Available Budget:</span>
              <span>${totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Allocated:</span>
              <span className={allocatedBudget > totalBudget ? 'text-red-600' : 'text-green-600'}>
                ${allocatedBudget.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Remaining:</span>
              <span>${Math.max(0, totalBudget - allocatedBudget).toLocaleString()}</span>
            </div>
            <Progress 
              value={(allocatedBudget / Math.max(totalBudget, 1)) * 100} 
              className={`h-2 ${allocatedBudget > totalBudget ? 'bg-red-100' : ''}`}
            />
            {allocatedBudget > totalBudget && (
              <p className="text-sm text-red-600">⚠️ Budget allocation exceeds available funds</p>
            )}
          </div>
        </CardContent>
      </Card>
        
      {/* Channel Selection */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Choose Marketing Channels (Select 2-3 channels)
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MARKETING_CHANNELS.map((channel) => {
            const isSelected = selectedChannels.includes(channel.id);
            const canSelect = selectedChannels.length < 3 || isSelected;
            
            return (
              <Card 
                key={channel.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                } ${!canSelect ? 'opacity-50' : ''}`}
                onClick={() => canSelect && handleChannelToggle(channel.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{channel.name}</CardTitle>
                  <CardDescription>{channel.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Reach:</span>
                      <Badge variant="outline">{channel.reach}/10</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Engagement:</span>
                      <Badge variant="outline">{channel.engagement}/10</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Min Budget:</span>
                      <span className="text-sm font-medium">${channel.cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Audience:</span>
                      <span className="text-xs text-gray-500">{channel.audience}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
        
      {/* Budget Allocation Sliders */}
      {selectedChannels.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Allocate Your Budget</h3>
          <div className="space-y-4">
            {selectedChannels.map(channelId => {
              const channel = MARKETING_CHANNELS.find(c => c.id === channelId);
              if (!channel) return null;
              
              const currentAllocation = budgetAllocation[channelId] || channel.cost;
              
              return (
                <Card key={channelId}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{channel.name}</h4>
                        <span className="text-lg font-semibold">
                          ${currentAllocation.toLocaleString()}
                        </span>
                      </div>
                      <Slider
                        value={[currentAllocation]}
                        onValueChange={([value]) => handleBudgetChange(channelId, value)}
                        min={channel.cost}
                        max={Math.max(totalBudget, channel.cost)}
                        step={100}
                        className="w-full"
                        disabled={campaignStarted}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: ${channel.cost.toLocaleString()}</span>
                        <span>Max: ${totalBudget.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
        
      {/* Campaign Launch */}
      {!campaignStarted && (
        <div className="text-center">
          <Button 
            onClick={startCampaign}
            disabled={!canStartCampaign}
            size="lg"
            className="px-8"
          >
            {canStartCampaign ? (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Launch Marketing Campaign
              </>
            ) : (
              `${selectedChannels.length < 2 ? 'Select 2+ channels' : 
                allocatedBudget < 1000 ? 'Allocate $1000+ budget' : 
                'Reduce budget allocation'}`
            )}
          </Button>
        </div>
      )}
        
      {/* Campaign Metrics */}
      {campaignStarted && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Live Campaign Results
            {!campaignComplete && <Badge variant="outline" className="ml-2">Live</Badge>}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-600">{metrics.impressions.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Impressions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <MousePointer className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-600">{metrics.clicks.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Clicks</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-purple-600">{metrics.conversions.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Conversions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <p className="text-2xl font-bold text-red-600">{metrics.followers.toLocaleString()}</p>
                <p className="text-sm text-gray-500">New Followers</p>
              </CardContent>
            </Card>
          </div>
            
          {/* Campaign Performance Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Click-through Rate (CTR):</span>
                    <span className="font-medium">
                      {metrics.impressions > 0 ? ((metrics.clicks / metrics.impressions) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate:</span>
                    <span className="font-medium">
                      {metrics.clicks > 0 ? ((metrics.conversions / metrics.clicks) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cost per Click:</span>
                    <span className="font-medium">
                      ${metrics.clicks > 0 ? (allocatedBudget / metrics.clicks).toFixed(2) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Conversion:</span>
                    <span className="font-medium">
                      ${metrics.conversions > 0 ? (allocatedBudget / metrics.conversions).toFixed(2) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              
              {campaignComplete && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Campaign Impact & Marketing Score:</h4>
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <p className="text-lg font-semibold text-blue-800">
                      Marketing Score: {gameState.scores.marketing}/100
                    </p>
                    <p className="text-sm text-blue-600">
                      Based on channel selection and budget allocation strategy
                    </p>
                  </div>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Marketing team bonus: +{gameState.teamMembers.filter((m: any) => m.role === 'marketer').length * 30}%</li>
                    <li>• Feature diversity bonus: +{gameState.features.length * 10}%</li>
                    <li>• Team morale impact: {gameState.morale >= 75 ? '+15%' : gameState.morale >= 50 ? '+5%' : '-10%'}</li>
                    <li>• Channel effectiveness: {selectedChannels.length >= 3 ? 'Optimal' : selectedChannels.length >= 2 ? 'Good' : 'Limited'}</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
        
      {/* Completion */}
      {campaignComplete && (
        <div className="text-center">
          <Button 
            onClick={onComplete}
            size="lg"
            className="px-8"
          >
            Complete Startup Journey
          </Button>
        </div>
      )}
    </div>
  );
};