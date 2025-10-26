
// components/stages/FoundationStage.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GameState, GameEvent } from '@/types/game';
import { EnhancedBusinessIdea } from '@/types/business';
import { ENHANCED_BUSINESS_IDEAS } from '@/data/businessIdeas';
import { 
  Lightbulb, TrendingUp, Users, CheckCircle, AlertTriangle, 
  Zap, DollarSign, Calculator, Clock, Package, Hammer
} from 'lucide-react';

interface FoundationStageProps {
  gameState: GameState;
  updateScore: (points: number) => void;
  validateIdea: (ideaPotential: number) => void;
  updateFinances: (changes: any) => void;
  triggerEvent?: (event: GameEvent) => void;
  resolveEvent?: (optionId: string) => void;
  onNext: () => void;
}

export const FoundationStage: React.FC<FoundationStageProps> = ({
  gameState,
  updateScore,
  validateIdea,
  updateFinances,
  triggerEvent,
  resolveEvent,
  onNext,
}) => {
  const [selectedIdea, setSelectedIdea] = useState<EnhancedBusinessIdea | null>(null);
  const [validationProgress, setValidationProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [marketResearchComplete, setMarketResearchComplete] = useState(false);

  const selectIdea = (idea: EnhancedBusinessIdea) => {
    setSelectedIdea(idea);
    setShowDetailedAnalysis(true);
  };

  const startValidation = () => {
  if (!selectedIdea) return;

  setIsValidating(true);
  setValidationProgress(0);
  setMarketResearchComplete(false); // Reset at start

  const interval = setInterval(() => {
    setValidationProgress(prev => {
      if (prev >= 100) {
        clearInterval(interval);
        setIsValidating(false);
        validateIdea(selectedIdea.potential);
        setMarketResearchComplete(true); // Set to true when complete
        
        updateFinances({
          type: 'INITIALIZE_STARTUP',
          initialCosts: selectedIdea.financials.initialCosts,
          monthlyFixed: selectedIdea.financials.monthlyFixed,
          operationalCosts: selectedIdea.productCosts.operationalCosts,
          marketData: selectedIdea.marketData
        });
        
        return 100;
      }
      return prev + 10;
    });
  }, 200);
};

  const renderInitialCosts = () => {
    if (!selectedIdea) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Initial Investment Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Equipment and Inventory */}
            <div>
              <h4 className="font-medium mb-3">Equipment & Inventory</h4>
              <div className="space-y-2">
                {selectedIdea.productCosts.initialInventory.items.map(item => (
                  <div key={item.name} className="flex justify-between items-center">
                    <div>
                      <span className="text-sm">{item.name}</span>
                      <span className="text-xs text-gray-500 block">
                        Qty: {item.quantity} | Lifespan: {item.lifespan} months
                      </span>
                    </div>
                    <Badge variant="outline">
                      ${(item.unitCost * item.quantity).toLocaleString()}
                    </Badge>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Total Equipment Cost</span>
                    <span>${selectedIdea.productCosts.initialInventory.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Setup and Legal */}
            <div>
              <h4 className="font-medium mb-3">Setup & Legal</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Setup Costs</span>
                  <span>${selectedIdea.financials.initialCosts.setup.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Legal & Licenses</span>
                  <span>${selectedIdea.financials.initialCosts.legal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Initial Marketing</span>
                  <span>${selectedIdea.financials.initialCosts.marketing.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Costs</span>
                  <span>${selectedIdea.financials.initialCosts.other.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Operations */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Monthly Operating Costs</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h5 className="text-sm font-medium mb-2">Fixed Costs</h5>
                <div className="space-y-1">
                  {Object.entries(selectedIdea.financials.monthlyFixed).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key}</span>
                      <span>${value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">Per Unit Costs</h5>
                <div className="space-y-1">
                  {Object.entries(selectedIdea.productCosts.operationalCosts).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key.replace('Per', '/')}</span>
                      <span>${value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">Break-even Analysis</h5>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Units</span>
                    <span>{selectedIdea.financials.breakEven.unitSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Timeline</span>
                    <span>{selectedIdea.financials.breakEven.timeframe} months</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMarketAnalysis = () => {
    if (!selectedIdea) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Market Overview */}
            <div>
              <h4 className="font-medium mb-3">Market Overview</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Market Size</span>
                  <span>${(selectedIdea.marketData.totalMarketSize / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span>Growth Rate</span>
                  <span>{selectedIdea.marketData.growthRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Competitors</span>
                  <span>{selectedIdea.marketData.competitorCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Initial Market Share</span>
                  <span>{selectedIdea.marketData.marketShare}%</span>
                </div>
              </div>
            </div>

            {/* Customer Segments */}
            <div>
              <h4 className="font-medium mb-3">Customer Segments</h4>
              <div className="space-y-2">
                {selectedIdea.marketData.customerSegments.map(segment => (
                  <div key={segment.name} className="p-2 bg-gray-50 rounded">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{segment.name}</span>
                      <span>{segment.size}%</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Growth Potential: {segment.growthPotential}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Requirements and Risks */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Key Requirements</h4>
                <div className="space-y-2">
                  {selectedIdea.requirements.keyRoles.map(role => (
                    <Badge key={role} variant="outline" className="mr-2">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Key Risks</h4>
                <div className="space-y-2">
                  {selectedIdea.industrySpecifics.risks.map(risk => (
                    <Badge key={risk} variant="outline" className="mr-2 bg-red-50">
                      {risk}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Startup Idea</h2>
        <p className="text-gray-600">Select and validate your business concept</p>
      </div>

      {/* Startup Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ENHANCED_BUSINESS_IDEAS.map(idea => (
          <Card
            key={idea.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedIdea?.id === idea.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => selectIdea(idea)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  {idea.name}
                </div>
                {selectedIdea?.id === idea.id && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </CardTitle>
              <CardDescription>{idea.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Market:</span>
                  <Badge variant="outline">{idea.market}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Initial Investment:</span>
                  <span className="text-sm font-medium">
                    ${(
                      idea.financials.initialCosts.inventory +
                      idea.financials.initialCosts.setup +
                      idea.financials.initialCosts.legal +
                      idea.financials.initialCosts.marketing
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Break-even:</span>
                  <span className="text-sm font-medium">
                    {idea.financials.breakEven.timeframe} months
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Idea Analysis */}
      {selectedIdea && (
        <>
          {/* Validation Card */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                Selected: {selectedIdea.name}
              </CardTitle>
              <CardDescription className="text-green-700">
                Review the detailed analysis and validate your idea
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {validationProgress > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Validation Progress</span>
                      <span>{validationProgress}%</span>
                    </div>
                    <Progress value={validationProgress} className="w-full" />
                  </div>
                )}

                <Button
                  onClick={startValidation}
                  disabled={isValidating || validationProgress === 100}
                  className="w-full"
                  size="lg"
                >
                  {isValidating ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Validating Idea...
                    </>
                  ) : validationProgress === 100 ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Idea Validated! Foundation Score: {gameState.scores.foundation}
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Start Market Research
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          {marketResearchComplete&& (
            <>
              {renderInitialCosts()}
              {renderMarketAnalysis()}
              
              {/* Industry Requirements */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hammer className="w-5 h-5" />
                    Industry Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Legal Requirements</h4>
                      <div className="space-y-2">
                        {selectedIdea.requirements.licenses.map(license => (
                          <div key={license} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{license}</span>
                          </div>
                        ))}
                        {selectedIdea.requirements.certifications.map(cert => (
                          <div key={cert} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Infrastructure Needs</h4>
                      <div className="space-y-2">
                        {selectedIdea.requirements.infrastructure.map(item => (
                          <div key={item} className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-orange-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Success Metrics */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-3">Key Success Metrics</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Performance Indicators</h5>
                        <div className="space-y-2">
                          {selectedIdea.industrySpecifics.keyMetrics.map(metric => (
                            <Badge key={metric} variant="outline" className="mr-2">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Success Factors</h5>
                        <div className="space-y-2">
                          {selectedIdea.industrySpecifics.successFactors.map(factor => (
                            <Badge key={factor} variant="outline" className="mr-2">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seasonality */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-3">Business Seasonality</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Peak Seasons</h5>
                        <div className="space-y-2">
                          {selectedIdea.industrySpecifics.seasonality.highSeasons.map(season => (
                            <Badge key={season} variant="default" className="mr-2 bg-green-100 text-green-800">
                              {season}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Low Seasons</h5>
                        <div className="space-y-2">
                          {selectedIdea.industrySpecifics.seasonality.lowSeasons.map(season => (
                            <Badge key={season} variant="default" className="mr-2 bg-red-100 text-red-800">
                              {season}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Seasonal Impact on Revenue: ±{selectedIdea.industrySpecifics.seasonality.impact}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Progression Preview */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Growth Trajectory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Key Milestones</h4>
                      <div className="space-y-2">
                        {selectedIdea.monthlyProgression.milestones.map((milestone, index) => (
                          <div key={milestone} className="flex items-center gap-2">
                            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span>{milestone}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                      <div>
                        <h4 className="font-medium mb-3">Expected Challenges</h4>
                        <div className="space-y-2">
                          {selectedIdea.monthlyProgression.challenges.map(challenge => (
                            <div key={challenge} className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                              <span>{challenge}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Growth Opportunities</h4>
                        <div className="space-y-2">
                          {selectedIdea.monthlyProgression.opportunities.map(opportunity => (
                            <div key={opportunity} className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-green-500" />
                              <span>{opportunity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Proceed Button */}
          {validationProgress === 100 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Ready to Build!</h3>
                  <p className="text-blue-700 mb-4">
                    Your idea is validated with a foundation score of {gameState.scores.foundation}! 
                    Time to assemble your team and build your product!
                  </p>
                  <Button onClick={onNext} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Proceed to Build Stage
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!selectedIdea && (
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            Select a startup idea to begin your entrepreneurial journey.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};