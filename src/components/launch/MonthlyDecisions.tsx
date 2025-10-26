import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  Server, 
  Users, 
  Brain,
  AlertTriangle,
  TrendingUp,
  CheckCircle 
} from 'lucide-react';
import { MonthlyDecision, MonthlyMetrics } from '@/types/progression';

interface MonthlyDecisionsProps {
  availableBudget: number;
  currentMetrics: MonthlyMetrics;
  previousDecisions?: MonthlyDecision;
  onSubmit: (decisions: MonthlyDecision) => void;
  gameState: any; // Replace with your GameState type
}

export const MonthlyDecisions = ({
  availableBudget,
  currentMetrics,
  previousDecisions,
  onSubmit,
  gameState
}: MonthlyDecisionsProps) => {
  const [decisions, setDecisions] = useState<MonthlyDecision>({
    marketingBudget: previousDecisions?.marketingBudget || 0,
    serverInvestment: previousDecisions?.serverInvestment || 0,
    hiring: previousDecisions?.hiring || 0,
    research: previousDecisions?.research || 0
  });

  const [recommendations, setRecommendations] = useState<{
    [K in keyof MonthlyDecision]: {
      min: number;
      recommended: number;
      reason: string;
    }
  }>({
    marketingBudget: { min: 0, recommended: 0, reason: '' },
    serverInvestment: { min: 0, recommended: 0, reason: '' },
    hiring: { min: 0, recommended: 0, reason: '' },
    research: { min: 0, recommended: 0, reason: '' }
  });

  // Calculate recommendations based on current metrics and state
  useEffect(() => {
    const userCount = gameState.users || 0;
    const teamSize = gameState.teamMembers.length;
    const featureCount = gameState.features.length;

    const newRecommendations = {
      marketingBudget: {
        min: Math.max(1000, userCount * 0.5),
        recommended: Math.max(2000, userCount * 1),
        reason: currentMetrics.userGrowth < 5 
          ? 'Growth below target' 
          : 'Maintain growth momentum'
      },
      serverInvestment: {
        min: Math.max(500, userCount * 0.2),
        recommended: Math.max(1000, userCount * 0.4),
        reason: currentMetrics.serverUptime < 99 
          ? 'Improve server stability' 
          : 'Maintain infrastructure'
      },
      hiring: {
        min: teamSize < 3 ? 2000 : 0,
        recommended: teamSize < 5 ? 4000 : 2000,
        reason: teamSize < 3 
          ? 'Critical staffing needed' 
          : 'Team expansion opportunity'
      },
      research: {
        min: featureCount < 3 ? 1000 : 500,
        recommended: Math.max(1500, featureCount * 500),
        reason: featureCount < 3 
          ? 'Core features needed' 
          : 'Product improvement'
      }
    };

    setRecommendations(newRecommendations);
  }, [currentMetrics, gameState]);

  const totalAllocation = Object.values(decisions).reduce((sum, value) => sum + value, 0);
  const remainingBudget = availableBudget - totalAllocation;

  const handleSliderChange = (key: keyof MonthlyDecision, value: number) => {
    const currentTotal = totalAllocation - decisions[key];
    if (currentTotal + value > availableBudget) {
      value = availableBudget - currentTotal;
    }
    
    setDecisions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getRecommendationStatus = (
    key: keyof MonthlyDecision,
    value: number
  ) => {
    const { min, recommended } = recommendations[key];
    if (value >= recommended) return 'optimal';
    if (value >= min) return 'adequate';
    return 'insufficient';
  };

  const renderAllocationSection = (
    title: string,
    key: keyof MonthlyDecision,
    icon: any,
    description: string
  ) => {
    const Icon = icon;
    const value = decisions[key];
    const { min, recommended, reason } = recommendations[key];
    const status = getRecommendationStatus(key, value);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {title}
            </CardTitle>
            <Badge variant={
              status === 'optimal' ? 'default' :
              status === 'adequate' ? 'secondary' :
              'destructive'
            }>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Allocation: ${value.toLocaleString()}</span>
              <span className="text-gray-500">
                Recommended: ${recommended.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[value]}
              onValueChange={([newValue]) => handleSliderChange(key, newValue)}
              min={0}
              max={availableBudget}
              step={100}
              className="w-full"
            />
            <div className="flex items-center gap-2 text-sm">
              <span className={value < min ? 'text-red-500' : 'text-gray-500'}>
                Minimum: ${min.toLocaleString()}
              </span>
              {value < min && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-sm text-gray-600">{reason}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Monthly Budget Allocation</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Available Budget</p>
          <p className="text-2xl font-bold text-green-600">
            ${availableBudget.toLocaleString()}
          </p>
        </div>
      </div>

      <Alert variant={remainingBudget < 0 ? 'destructive' : 'default'}>
        <AlertDescription>
          Remaining Budget: ${remainingBudget.toLocaleString()}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderAllocationSection(
          'Marketing',
          'marketingBudget',
          TrendingUp,
          'Invest in user acquisition and brand awareness'
        )}
        {renderAllocationSection(
          'Server Infrastructure',
          'serverInvestment',
          Server,
          'Maintain and improve system stability'
        )}
        {renderAllocationSection(
          'Team Expansion',
          'hiring',
          Users,
          'Grow and strengthen your team'
        )}
        {renderAllocationSection(
          'Research & Development',
          'research',
          Brain,
          'Invest in new features and improvements'
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => setDecisions(previousDecisions || {
            marketingBudget: 0,
            serverInvestment: 0,
            hiring: 0,
            research: 0
          })}
        >
          Reset
        </Button>
        <Button
          onClick={() => onSubmit(decisions)}
          disabled={remainingBudget < 0}
        >
          Confirm Allocation
        </Button>
      </div>
    </div>
  );
};