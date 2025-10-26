import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StartupIdea, GameEvent, GameState } from '../../types/game';
import { Lightbulb, TrendingUp, Users, CheckCircle, AlertTriangle, Zap, DollarSign, Calculator, Clock } from 'lucide-react';

interface FoundationStageProps {
  gameState: GameState;
  updateScore: (points: number) => void;
  validateIdea: (ideaPotential: number) => void;
  
  updateFinances: (finances: any) => void; // Add this
  triggerEvent?: (event: GameEvent) => void;
  resolveEvent?: (optionId: string) => void;
  onNext: () => void;
}

const startupIdeas: StartupIdea[] = [
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

const marketEvents: GameEvent[] = [
  {
    id: 'climate_trend',
    type: 'team_drama',
    title: '🌱 Climate Change Awareness Surge',
    description: 'Recent climate reports have increased public interest in sustainable solutions. Green businesses are getting more attention!',
    options: [
      { id: 'capitalize', text: 'Capitalize on the trend', effect: { score: 100, money: 500 } },
      { id: 'ignore', text: 'Focus on core business', effect: { score: 0 } },
    ],
    active: true,
  },
  {
    id: 'ai_boom',
    type: 'team_drama',
    title: '🤖 AI Technology Boom',
    description: 'Major tech companies are investing heavily in AI. EdTech and AI-powered solutions are in high demand!',
    options: [
      { id: 'pivot_ai', text: 'Emphasize AI features', effect: { score: 150, money: 800 } },
      { id: 'stay_course', text: 'Stick to original plan', effect: { score: 0 } },
    ],
    active: true,
  },
  {
    id: 'health_crisis',
    type: 'team_drama',
    title: '🏥 Health Awareness Rising',
    description: 'Post-pandemic health consciousness is driving demand for wellness and health monitoring solutions.',
    options: [
      { id: 'health_focus', text: 'Pivot to health focus', effect: { score: 120, money: 600 } },
      { id: 'maintain', text: 'Maintain current direction', effect: { score: 0,money:0 } },
    ],
    active: true,
  },
  {
    id: 'local_support',
    type: 'team_drama',
    title: '🏘️ Support Local Movement',
    description: 'Communities are rallying to support local businesses. Local marketplace solutions are trending!',
    options: [
      { id: 'go_local', text: 'Emphasize local community', effect: { score: 80, money: 400 } },
      { id: 'global_focus', text: 'Think bigger, go global', effect: { score: 20 } },
    ],
    active: true,
  },
];

export const FoundationStage: React.FC<FoundationStageProps> = ({
  gameState,
  updateScore,
  validateIdea,
  updateFinances,
  triggerEvent,
  resolveEvent,
  onNext,
}) => {
  const [selectedIdea, setSelectedIdea] = useState<StartupIdea | null>(null);
  const [validationProgress, setValidationProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [currentEvents, setCurrentEvents] = useState<GameEvent[]>([]);

  // On page load → pick 2 random events
  useEffect(() => {
    const shuffled = [...marketEvents].sort(() => 0.5 - Math.random());
    setCurrentEvents(shuffled.slice(0, 2));
  }, []);

  const selectIdea = (idea: StartupIdea) => {
    setSelectedIdea(idea);
  };

  const startValidation = () => {
    if (!selectedIdea) return;

    setIsValidating(true);
    setValidationProgress(0);

    const interval = setInterval(() => {
      setValidationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsValidating(false);
          validateIdea(selectedIdea.potential);
          
          // Update finances with selected idea's initial costs
          updateFinances({
            type: 'INITIALIZE_STARTUP',
            initialCosts: selectedIdea.financials.initialCosts,
            monthlyFixed: selectedIdea.financials.monthlyFixed,
            operationalCosts: selectedIdea.financials.operationalCosts
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  const handleEventChoice = (eventId: string, optionId: string) => {
    const event = currentEvents.find(e => e.id === eventId);
    if (!event) return;

    const option = event.options.find(opt => opt.id === optionId);
    if (option && option.effect.score) {
      updateScore(option.effect.score);
    }

    // remove resolved event
    setCurrentEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 5) return 'bg-green-500';
    if (difficulty <= 7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPotentialColor = (potential: number) => {
    if (potential >= 9) return 'text-green-600';
    if (potential >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const canProceed = selectedIdea && validationProgress === 100;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Startup Idea</h2>
        <p className="text-gray-600">Select and validate your business concept</p>
      </div>

      {/* Market Events on Page Load */}
      {currentEvents.map(event => (
        <Card key={event.id} className="border-blue-200 bg-blue-50 animate-pulse">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <TrendingUp className="w-5 h-5" />
              {event.title}
            </CardTitle>
            <CardDescription className="text-blue-700">
              {event.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {event.options.map(option => (
                <Button
                  key={option.id}
                  variant="outline"
                  className="w-full justify-start hover:bg-blue-100"
                  onClick={() => handleEventChoice(event.id, option.id)}
                >
                  {option.text}
                  {option.effect.score && (
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      +{option.effect.score} pts
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Startup Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {startupIdeas.map(idea => (
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
                  <span className="text-sm font-medium">Difficulty:</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getDifficultyColor(idea.difficulty)}`}></div>
                    <span className="text-sm">{idea.difficulty}/10</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Potential:</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`w-4 h-4 ${getPotentialColor(idea.potential)}`} />
                    <span className={`text-sm font-semibold ${getPotentialColor(idea.potential)}`}>
                      {idea.potential}/10
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Financial Overview</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Initial Investment:</span>
                    <span className="text-sm font-medium">
                      ${(idea.financials.initialCosts.setup + 
                        idea.financials.initialCosts.development + 
                        idea.financials.initialCosts.legal + 
                        idea.financials.initialCosts.marketing).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Costs:</span>
                    <span className="text-sm font-medium">
                      ${(idea.financials.monthlyFixed.rent + 
                        idea.financials.monthlyFixed.salaries + 
                        idea.financials.monthlyFixed.utilities + 
                        idea.financials.monthlyFixed.insurance).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Break-even Time:</span>
                    <span className="text-sm font-medium">
                      {idea.financials.breakEvenAnalysis.monthsToBreakEven} months
                    </span>
                  </div>
                </div>
              </div>

              </div>
            </CardContent>
          </Card>
        ))}
      </div>

  {selectedIdea && (
    <div className="space-y-6">
      {/* Existing Validation Card */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Selected: {selectedIdea.name}
          </CardTitle>
          <CardDescription className="text-green-700">
            Now validate your idea with market research
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

      {/* New Financial Breakdown Card */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Financial Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Initial Costs */}
            <div>
              <h4 className="font-medium mb-3">Initial Costs</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Setup</span>
                  <Badge variant="outline">
                    ${selectedIdea.financials.initialCosts.setup.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Development</span>
                  <Badge variant="outline">
                    ${selectedIdea.financials.initialCosts.development.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Legal</span>
                  <Badge variant="outline">
                    ${selectedIdea.financials.initialCosts.legal.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Marketing</span>
                  <Badge variant="outline">
                    ${selectedIdea.financials.initialCosts.marketing.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">Total Initial Investment</span>
                  <Badge variant="default">
                    ${(
                      selectedIdea.financials.initialCosts.setup +
                      selectedIdea.financials.initialCosts.development +
                      selectedIdea.financials.initialCosts.legal +
                      selectedIdea.financials.initialCosts.marketing
                    ).toLocaleString()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Monthly Costs */}
            <div>
              <h4 className="font-medium mb-3">Monthly Fixed Costs</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rent</span>
                  <Badge variant="outline">
                    ${selectedIdea.financials.monthlyFixed.rent.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Salaries</span>
                  <Badge variant="outline">
                    ${selectedIdea.financials.monthlyFixed.salaries.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Utilities</span>
                  <Badge variant="outline">
                    ${selectedIdea.financials.monthlyFixed.utilities.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Insurance</span>
                  <Badge variant="outline">
                    ${selectedIdea.financials.monthlyFixed.insurance.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">Total Monthly Costs</span>
                  <Badge variant="default">
                    ${(
                      selectedIdea.financials.monthlyFixed.rent +
                      selectedIdea.financials.monthlyFixed.salaries +
                      selectedIdea.financials.monthlyFixed.utilities +
                      selectedIdea.financials.monthlyFixed.insurance
                    ).toLocaleString()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Break-even Analysis */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Break-even Analysis</h4>
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white">
                <CardContent className="pt-6 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm text-gray-600">Recommended Price</p>
                  <p className="text-xl font-bold">
                    ${selectedIdea.financials.breakEvenAnalysis.recommendedPrice}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-600">Monthly Units Needed</p>
                  <p className="text-xl font-bold">
                    {selectedIdea.financials.breakEvenAnalysis.unitsPerMonth.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="pt-6 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm text-gray-600">Months to Break-even</p>
                  <p className="text-xl font-bold">
                    {selectedIdea.financials.breakEvenAnalysis.monthsToBreakEven}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )}

      {/* Progress to Next Stage */}
      {canProceed && (
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
