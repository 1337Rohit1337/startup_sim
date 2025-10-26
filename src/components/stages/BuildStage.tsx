import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Wrench, DollarSign, Star, AlertTriangle, Zap, Clock, Heart, Check } from 'lucide-react';
import { GameState } from '@/types/game';
import { MonthlyProgress, OperationalEvent, TeamMember, Feature } from '@/types/build';
import { MonthlyProgressTracker } from '../build/MonthlyProgressTracker';
import { TeamEfficiencyMonitor } from '../build/TeamEfficiencyMonitor';
import { OperationalEventHandler } from '../build/OperationalEventHandler';
import { DevelopmentTimeline } from '../build/DevelopmentTimeline';
import {
  calculateTeamEfficiency,
  calculateDevelopmentProgress,
  calculateBurnRate,
  calculateQualityScore,
  calculateRisk,
  predictDevelopmentTime,
  calculateFeatureReadiness
}  from '../utils/buildCalculations';

// src/components/stages/BuildStage.tsx
import { TEAM_MEMBERS, FEATURES } from '@/data/data';

// Keep your existing TEAM_MEMBERS and FEATURES data here


interface BuildStageProps {
  gameState: GameState;
  setGameState: (state: React.SetStateAction<GameState>) => void;
  addTeamMember: (member: TeamMember) => void;
  addFeature: (feature: Feature) => void;
  updateMorale: (change: number) => void;
  updateFinances: (changes: any) => void;
  removeFeature: (feature: Feature) => void;
  triggerEvent: (event: any) => void;
  resolveEvent: () => void;
  canAddFeature: (feature: Feature) => boolean;
  onNext: () => Promise<void>;
  isLoading: boolean;
}

export const BuildStage = ({
  gameState,
  addTeamMember,
  addFeature,
  removeFeature,
  updateMorale,
  triggerEvent,
  updateFinances,
  resolveEvent,
  isLoading,
  canAddFeature,
  onNext
}: BuildStageProps) => {
  // State from both files
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [monthlyProgress, setMonthlyProgress] = useState<MonthlyProgress[]>([{
     month: 1,
  stage: 'early',
  completedTasks: [],
  pendingTasks: [],
  metrics: {
    teamEfficiency: 0,
    productQuality: 0,
    developmentProgress: 0
  },
  achievements: []
  }]);
  const [teamEfficiency, setTeamEfficiency] = useState(0);
  const [qualityScore, setQualityScore] = useState(0);
  const [developmentProgress, setDevelopmentProgress] = useState(0);
  const [riskLevel, setRiskLevel] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<OperationalEvent | null>(null);
  const [currentTeamSkill, setCurrentTeamSkill] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [featureToAdd, setFeatureToAdd] = useState<Feature | null>(null);

const calculateTeamSkill = (memberIds: string[]) => {
  const selectedMembers = memberIds.map(id => 
    TEAM_MEMBERS.find(m => m.id === id)
  ).filter(Boolean) as TeamMember[];

  if (selectedMembers.length === 0) return 0;
  
  // Calculate average skill but with a penalty for team size
  const totalSkill = selectedMembers.reduce((sum, member) => sum + member.skill, 0);
  const averageSkill = totalSkill / selectedMembers.length;
  
  // Apply penalties:
  // 1. Team size penalty (larger teams are harder to coordinate)
  // 2. Role diversity bonus/penalty
  const teamSizePenalty = Math.max(0, (selectedMembers.length - 3) * 0.5);
  
  // Check role diversity
  const roles = new Set(selectedMembers.map(m => m.role));
  const roleDiversityBonus = roles.size >= 2 ? 1 : -1;

  const finalSkill = Math.round(averageSkill - teamSizePenalty + roleDiversityBonus);
  
  console.log('Team Skill Calculation:', {
    averageSkill,
    teamSizePenalty,
    roleDiversityBonus,
    finalSkill
  });

  return Math.min(finalSkill, 9); // Cap maximum skill at 7
};


  // Effect to update calculations when team or features change
  useEffect(() => {
    // Update all calculations when team or features change
    if (selectedTeamMembers.length > 0 || selectedFeatures.length > 0) {
      const selectedTeamArray = selectedTeamMembers
        .map(id => TEAM_MEMBERS.find(m => m.id === id))
        .filter(Boolean) as TeamMember[];

      const selectedFeaturesArray = selectedFeatures
        .map(id => FEATURES.find(f => f.id === id))
        .filter(Boolean) as Feature[];

      const efficiency = calculateTeamEfficiency(
        selectedTeamArray,
        selectedFeaturesArray,
        gameState.morale
      );
      setTeamEfficiency(efficiency);

      const quality = calculateQualityScore(
        selectedTeamArray,
        selectedFeaturesArray,
        efficiency
      );
      setQualityScore(quality);

      const progress = calculateDevelopmentProgress(
        selectedFeaturesArray,
        efficiency,
        gameState.resources.time
      );
      setDevelopmentProgress(progress);

      const risk = calculateRisk(
        selectedTeamArray,
        selectedFeaturesArray,
        calculateBurnRate(selectedTeamArray, selectedFeaturesArray),
        calculateRunway()
      );
      setRiskLevel(risk);

      

      // Update monthly progress
      const newProgress: MonthlyProgress = {
        month: currentMonth,
        stage: currentMonth <= 3 ? 'early' : currentMonth <= 6 ? 'growth' : 'stabilization',
        completedTasks: [],
        pendingTasks: selectedFeaturesArray.map(f => `Implement ${f.name}`),
        metrics: {
          teamEfficiency: efficiency,
          productQuality: quality,
          developmentProgress: progress
        },
        achievements: []
      };
      setMonthlyProgress(prev => [...prev.slice(0, -1), newProgress]);
    }
  }, [selectedTeamMembers, selectedFeatures, gameState.morale, gameState.resources.time]);
    // Calculation functions

  useEffect(() => {
  const newTeamSkill = calculateTeamSkill(selectedTeamMembers);
  setCurrentTeamSkill(newTeamSkill);
}, [selectedTeamMembers]);


  const updateMonthlyProgress = () => {
    const newProgress: MonthlyProgress = {
      month: currentMonth,
      stage: currentMonth <= 3 ? 'early' : currentMonth <= 6 ? 'growth' : 'stabilization',
      completedTasks: [],
      pendingTasks: [],
      metrics: {
        teamEfficiency,
        productQuality: qualityScore,
        developmentProgress
      },achievements: []
    };
    setMonthlyProgress(prev => [...prev, newProgress]);
  };

  const calculateMonthlySalaries = () => {
    return selectedTeamMembers.reduce((total, memberId) => {
      const member = TEAM_MEMBERS.find(m => m.id === memberId);
      if (member) {
        return total + member.salary + member.benefits;
      }
      return total;
    }, 0);
  };

  const calculateMaintenanceCosts = () => {
    return selectedFeatures.reduce((total, featureId) => {
      const feature = FEATURES.find(f => f.id === featureId);
      if (feature) {
        return total + feature.maintenanceCost;
      }
      return total;
    }, 0);
  };

  const calculateBurnRate = () => {
    const monthlySalaries = calculateMonthlySalaries();
    const maintenanceCosts = calculateMaintenanceCosts();
    return monthlySalaries + maintenanceCosts;
  };

  const calculateRunway = () => {
    const burnRate = calculateBurnRate();
    if (burnRate === 0) return 0;
    return Math.floor(gameState.resources.money / burnRate);
  };

  // Enhanced handlers
  const handleAddTeamMember = (member: TeamMember) => {
  const isAlreadySelected = selectedTeamMembers.includes(member.id);

  if (isAlreadySelected) {
    // Deselect
    setSelectedTeamMembers(prev => prev.filter(id => id !== member.id));
    updateFinances({
      type: 'HIRE_TEAM_MEMBER',
      cost: -member.cost, // Negative cost means refund
      monthlyCost: -(member.salary + member.benefits)
    });
    updateMorale(-5);
  } else {
    // Select
    if (gameState.resources.money >= member.cost) {
      setSelectedTeamMembers(prev => [...prev, member.id]);
      updateFinances({
        type: 'HIRE_TEAM_MEMBER',
        cost: member.cost,
        monthlyCost: member.salary + member.benefits
      });
      updateMorale(5);
    } else {
      triggerEvent({
        id: 'insufficient_funds',
        title: 'Insufficient Funds',
        description: `You need $${member.cost} to hire ${member.name}`,
        type: 'warning'
      });
    }
  }
};

  const canTeamHandleAllFeatures = () => {
    const selectedFeaturesList = selectedFeatures
      .map(id => FEATURES.find(f => f.id === id))
      .filter(Boolean) as Feature[];

    console.log("Checking team capabilities:");
    console.log("Current team skill:", currentTeamSkill);
    console.log("Selected features:", selectedFeaturesList);

    let canHandle = true;
    for (const feature of selectedFeaturesList) {
      const requiredSkill = Math.ceil(feature.complexity / 2);
      const hasEnoughSkill = currentTeamSkill * 2 >= feature.complexity;
      
      console.log(`Feature: ${feature.name}`);
      console.log(`- Complexity: ${feature.complexity}`);
      console.log(`- Required Skill: ${requiredSkill}`);
      console.log(`- Team has enough skill: ${hasEnoughSkill}`);

      if (!hasEnoughSkill) {
        canHandle = false;
        break;
      }
    }

    console.log("Final result - Can team handle all features:", canHandle);
    return canHandle;
  };

  const handleAddFeature = (feature: Feature) => {
  const isAlreadySelected = selectedFeatures.includes(feature.id);
  const hasEnoughSkill = currentTeamSkill * 2 >= feature.complexity;

  if (isAlreadySelected) {
    // Deselect
    setSelectedFeatures(prev => prev.filter(id => id !== feature.id));
    updateFinances({
      type: 'ADD_FEATURE',
      developmentCost: -feature.developmentCost, // Negative cost means refund
      maintenanceCost: -feature.maintenanceCost
    });
    updateMorale(-1);
  } else {

      if (!hasEnoughSkill) {
      // Show confirmation modal instead of blocking
      setFeatureToAdd(feature);
      setShowConfirmationModal(true);
      return;
    }


    // Select
    if (gameState.resources.money >= feature.developmentCost) {
      setSelectedFeatures(prev => [...prev, feature.id]);
      updateFinances({
        type: 'ADD_FEATURE',
        developmentCost: feature.developmentCost,
        maintenanceCost: feature.maintenanceCost
      });
      updateMorale(3);
    } else {
      triggerEvent({
        id: 'insufficient_funds',
        title: 'Insufficient Funds',
        description: `You need $${feature.developmentCost} to add ${feature.name}`,
        type: 'warning'
      });
    }
  }
};


  // Calculations for UI
  const totalTeamCost = selectedTeamMembers.reduce((sum, memberId) => {
    const member = TEAM_MEMBERS.find(m => m.id === memberId);
    return sum + (member?.cost || 0);
  }, 0);

  const totalFeatureCost = selectedFeatures.reduce((sum, featureId) => {
    const feature = FEATURES.find(f => f.id === featureId);
    return sum + (feature?.cost || 0);
  }, 0);

  const totalTimeRequired = selectedFeatures.reduce((sum, featureId) => {
    const feature = FEATURES.find(f => f.id === featureId);
    return sum + (feature?.timeRequired || 0);
  }, 0);

  const canProceed = selectedTeamMembers.length >= 2 && selectedFeatures.length >= 3;

  const featuresByCategory = FEATURES.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, typeof FEATURES>);


  const ConfirmationModal = () => {
  if (!featureToAdd) return null;
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold text-red-600 mb-4">Warning: High Risk Feature</h3>
        <p className="text-gray-700 mb-4">
          Your team's skill level ({currentTeamSkill}) is too low for {featureToAdd.name} 
          (Requires: {Math.ceil(featureToAdd.complexity / 2)}). 
          Proceeding with this feature significantly increases the risk of project failure.
        </p>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowConfirmationModal(false);
              setFeatureToAdd(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setShowConfirmationModal(false);
              // Add the feature despite the warning
              setSelectedFeatures(prev => [...prev, featureToAdd.id]);
              updateFinances({
                type: 'ADD_FEATURE',
                developmentCost: featureToAdd.developmentCost,
                maintenanceCost: featureToAdd.maintenanceCost
              });
              setFeatureToAdd(null);
            }}
          >
            Proceed Anyway
          </Button>
        </div>
      </div>
    </div>
  );
};

const FailureModal = () => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-2xl font-bold text-red-600 mb-4">Project Failed!</h3>
        <div className="space-y-4">
          <p className="text-gray-700">
            Your startup has failed due to attempting features beyond your team's capabilities.
          </p>
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Failure Analysis:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Team Skill Level: {currentTeamSkill}/10</li>
              <li>Attempted Features: {selectedFeatures.length}</li>
              <li>Complex Features: {selectedFeatures.filter(id => {
                const feature = FEATURES.find(f => f.id === id);
                return feature && feature.complexity * 2 > currentTeamSkill;
              }).length}</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            Tip: Ensure your team's skill level is sufficient for the features you want to implement.
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => {
              setShowFailureModal(false); // Add this
              navigate('/');
            }}
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};


    return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Stage 2: Build Your Startup
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Assemble your team and choose the features that will define your MVP.
          Balance cost, time, and team capabilities to build something amazing.
        </p>
      </div>

      {/* Monthly Progress Tracker */}
      <MonthlyProgressTracker
        currentMonth={currentMonth}
        progress={monthlyProgress[monthlyProgress.length - 1]}
        stage={currentMonth <= 3 ? 'early' : currentMonth <= 6 ? 'growth' : 'stabilization'}
      />

      {/* Team Efficiency Monitor */}
      <TeamEfficiencyMonitor
        metrics={{
          overall: teamEfficiency,
          byRole: {},  // Implement role-based metrics calculation
          factors: {
            skillMatch: qualityScore,
            workload: developmentProgress,
            morale: gameState.morale,
            synergy: teamEfficiency
          }
        }}
        teamSize={selectedTeamMembers.length}
        totalCapacity={selectedTeamMembers.length * 40}
      />

      {/* Current Event Display */}
      {gameState.currentEvent && (
        <Alert className="border-blue-200 bg-blue-50">
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

      {/* Resources Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Money</p>
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
                <p className="text-sm font-medium text-gray-600">Team Skill</p>
                <p className="text-2xl font-bold text-purple-600">{calculateTeamSkill(selectedTeamMembers)}/10</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Left</p>
                <p className="text-2xl font-bold text-orange-600">{gameState.resources.time}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
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
      </div>
            {/* Team Building Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Build Your Team
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEAM_MEMBERS.map((member) => {
            const isHired = selectedTeamMembers.includes(member.id);
            const canAfford = gameState.resources.money >= member.cost;
            
            return (
                <Card 
                      key={member.id}
                      className={`transition-all hover:shadow-md ${
                        isHired ? 'ring-2 ring-green-500 bg-green-50' : 
                        !canAfford ? 'opacity-50' : 'cursor-pointer'
                      }`}
                    >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {member.name}
                    <Badge variant="outline" className="capitalize">
                      {member.role}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{member.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Skill: {member.skill}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">${member.cost.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                      <Button 
                        onClick={() => handleAddTeamMember(member)}
                        className="w-full"
                        variant={isHired ? "secondary" : "default"}
                        disabled={!isHired && !canAfford}
                      >
                        {isHired ? 'Remove' : canAfford ? 'Add' : 'Insufficient Funds'}
                      </Button>
    
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Feature Selection */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Choose Features for Your MVP
        </h3>
        
        {Object.entries(featuresByCategory).map(([category, features]) => (
          <div key={category} className="mb-6">
            <h4 className="text-lg font-medium mb-3 capitalize flex items-center gap-2">
              {category === 'core' && <Zap className="h-4 w-4 text-blue-500" />}
              {category === 'social' && <Users className="h-4 w-4 text-green-500" />}
              {category === 'business' && <DollarSign className="h-4 w-4 text-purple-500" />}
              {category} Features
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature) => {
                const isSelected = selectedFeatures.includes(feature.id);
                const wasRemoved = gameState.features.some(f => f.id === feature.id);
                const canAfford = gameState.resources.money >= feature.cost;
                const hasTime = gameState.resources.time >= feature.timeRequired;
                const currentTeamSkill = calculateTeamSkill(selectedTeamMembers)
                const canAdd = isSelected || wasRemoved || (canAfford && hasTime && canAddFeature(feature));
                const hasEnoughSkill = currentTeamSkill * 2 >= feature.complexity;

                return (
                  <Card 
                    key={feature.id}
                    className={`transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 
                      !canAfford || !hasEnoughSkill ? 'opacity-50' : 'cursor-pointer'
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-xs text-gray-500">Complexity</p>
                            <p className="text-sm font-medium">{feature.complexity}/5</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">User Value</p>
                            <p className="text-sm font-medium">{feature.userValue}/10</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="text-sm font-medium">{feature.timeRequired}d</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-green-600">
                            ${feature.cost}
                          </span>
                          <Badge variant={feature.userValue > 7 ? "default" : "secondary"}>
                            {feature.userValue > 7 ? "High Impact" : "Standard"}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          {feature.complexity  >= 20? (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Requires Higher Skill
                            </Badge>
                          ) : (
                            <Badge variant="success" className="flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Team Can Handle
                            </Badge>
                          )}
                        </div>
                          <Button 
                            onClick={() => handleAddFeature(feature)}
                            className="w-full"
                            variant={isSelected ? "secondary" : "default"}
                            disabled={!isSelected && !canAfford}
                          >
                            {isSelected ? 'Remove' : canAfford ? 'Add' : 'Insufficient Funds'}
                          </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Build Summary and Financial Impact Analysis */}
      {(selectedTeamMembers.length > 0 || selectedFeatures.length > 0) && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Build Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{selectedTeamMembers.length}</p>
                  <p className="text-sm text-gray-500">Team Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{selectedFeatures.length}</p>
                  <p className="text-sm text-gray-500">Features</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    ${(totalTeamCost + totalFeatureCost).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Total Cost</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{totalTimeRequired}</p>
                  <p className="text-sm text-gray-500">Days to Build</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Financial analysis content remains the same */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">One-time Costs</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Team Hiring</span>
                              <span>${totalTeamCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Feature Development</span>
                              <span>${totalFeatureCost.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Monthly Costs</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Salaries & Benefits</span>
                              <span>${calculateMonthlySalaries().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Feature Maintenance</span>
                              <span>${calculateMaintenanceCosts().toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Financial Metrics</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Monthly Burn Rate</p>
                            <p className="text-xl font-bold text-red-600">
                              ${calculateBurnRate().toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Runway (Months)</p>
                            <p className="text-xl font-bold text-orange-600">
                              {calculateRunway()}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Development Timeline</p>
                            <p className="text-xl font-bold text-blue-600">
                              {totalTimeRequired} days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Progress Warning */}
      {!canProceed && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You need at least 2 team members and 3 features to proceed to the launch stage.
          </AlertDescription>
        </Alert>
      )}

      {/* Next Stage Button */}
    <div className="flex justify-center">
      <Button 
        onClick={async () => {
          // Debug logs
          console.log("Button clicked");
          console.log("Current team skill:", currentTeamSkill);
          console.log("Selected features:", selectedFeatures); 
          console.log("Selected team members:", selectedTeamMembers);

          // Check if we have minimum requirements
          if (!canProceed) {
            console.log("Can't proceed - not enough team members or features");
            return;
          }

          // Check team capabilities
          const canHandle = canTeamHandleAllFeatures();
          console.log("Can handle all features:", canHandle);

          if (!canHandle) {
            console.log("Team cannot handle features - showing failure modal");
            setShowFailureModal(true);
            return;
          }

          try {
            await onNext();
          } catch (error) {
            console.error('Error proceeding to next stage:', error);
          }
        }}
        // Only disable if we don't have minimum requirements or are loading
        disabled={!canProceed || isLoading}
        size="lg"
        className="px-8"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            <span>Analyzing team capability...</span>
          </div>
        ) : !canProceed ? (
          `Need ${Math.max(0, 2 - selectedTeamMembers.length)} more team members and ${Math.max(0, 3 - selectedFeatures.length)} more features`
        ) : !canTeamHandleAllFeatures() ? (
          'Team needs more skill for selected features'
        ) : (
          'Proceed to Launch Stage'
        )}
      </Button>
    </div>
    {showConfirmationModal && <ConfirmationModal />}
    {showFailureModal && <FailureModal />}
    </div>
  );
};