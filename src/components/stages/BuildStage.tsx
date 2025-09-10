import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Wrench, DollarSign, Star, AlertTriangle, Zap, Clock, Heart, Check } from 'lucide-react';

// Define team members and features directly in component (you can move these to a separate file later)
const TEAM_MEMBERS = [
  {
    id: 'dev1',
    name: 'Alex Chen',
    role: 'developer',
    skill: 9,
    cost: 8000,
    description: 'Full-stack developer with 5+ years experience',
    specialties: ['React', 'Node.js', 'Database Design']
  },
  {
    id: 'dev2',
    name: 'Sarah Johnson',
    role: 'developer',
    skill: 7,
    cost: 6000,
    description: 'Frontend specialist with UI/UX skills',
    specialties: ['React', 'TypeScript', 'CSS']
  },
  {
    id: 'design1',
    name: 'Maya Patel',
    role: 'designer',
    skill: 8,
    cost: 5500,
    description: 'UI/UX designer with product experience',
    specialties: ['Figma', 'User Research', 'Prototyping']
  },
  {
    id: 'design2',
    name: 'Tom Wilson',
    role: 'designer',
    skill: 6,
    cost: 4000,
    description: 'Junior designer with fresh perspectives',
    specialties: ['Graphic Design', 'Branding', 'Illustration']
  },
  {
    id: 'market1',
    name: 'Lisa Rodriguez',
    role: 'marketer',
    skill: 8,
    cost: 6500,
    description: 'Digital marketing expert with growth experience',
    specialties: ['SEO', 'Social Media', 'Analytics']
  },
  {
    id: 'market2',
    name: 'David Kim',
    role: 'marketer',
    skill: 7,
    cost: 5000,
    description: 'Content marketing and community building specialist',
    specialties: ['Content Creation', 'Community', 'Partnerships']
  }
];

const FEATURES = [
  // Core Features
  {
    id: 'auth',
    name: 'User Authentication',
    category: 'core',
    description: 'Secure login and registration system',
    complexity: 3,
    userValue: 8,
    cost: 100,
    timeRequired: 15
  },
  {
    id: 'profile',
    name: 'User Profiles',
    category: 'core',
    description: 'Customizable user profiles and settings',
    complexity: 2,
    userValue: 6,
    cost: 80,
    timeRequired: 10
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    category: 'core',
    description: 'Main user interface and navigation',
    complexity: 4,
    userValue: 9,
    cost: 150,
    timeRequired: 20
  },
  // Social Features
  {
    id: 'messaging',
    name: 'Real-time Messaging',
    category: 'social',
    description: 'Chat and messaging functionality',
    complexity: 4,
    userValue: 9,
    cost: 200,
    timeRequired: 25
  },
  {
    id: 'social-feed',
    name: 'Social Feed',
    category: 'social',
    description: 'Activity feed and social interactions',
    complexity: 5,
    userValue: 7,
    cost: 180,
    timeRequired: 22
  },
  {
    id: 'groups',
    name: 'Groups/Communities',
    category: 'social',
    description: 'Create and manage user groups',
    complexity: 4,
    userValue: 8,
    cost: 160,
    timeRequired: 18
  },
  // Business Features
  {
    id: 'search',
    name: 'Advanced Search',
    category: 'business',
    description: 'Powerful search and filtering capabilities',
    complexity: 3,
    userValue: 7,
    cost: 120,
    timeRequired: 15
  },
  {
    id: 'notifications',
    name: 'Push Notifications',
    category: 'business',
    description: 'Real-time notifications and alerts',
    complexity: 2,
    userValue: 5,
    cost: 100,
    timeRequired: 12
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    category: 'business',
    description: 'User behavior and performance metrics',
    complexity: 3,
    userValue: 4,
    cost: 140,
    timeRequired: 16
  },
  {
    id: 'payments',
    name: 'Payment System',
    category: 'business',
    description: 'Secure payment processing and billing',
    complexity: 5,
    userValue: 8,
    cost: 250,
    timeRequired: 30
  }
];

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

interface BuildStageProps {
  gameState: any;
  addTeamMember: (member: TeamMember) => void;  // Update type
  addFeature: (feature: Feature) => void;       // Update type
  updateMorale: (change: number) => void;
  removeFeature: (feature: Feature) => void; // Add this
  triggerEvent: (event: any) => void;
  resolveEvent: () => void;
  canAddFeature: (feature: Feature) => boolean; // Update type
  onNext: () => Promise<void>;                  // Make async
  isLoading: boolean;                          // Add this
}

export const BuildStage = ({ 
  gameState, 
  addTeamMember, 
  addFeature, 
  updateMorale,
  triggerEvent,
  resolveEvent,
  isLoading,
  canAddFeature,
  onNext 
}: BuildStageProps) => {
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const handleAddTeamMember = (member: any) => {
    if (selectedTeamMembers.includes(member.id)) return;
    
    if (gameState.resources.money >= member.cost) {
      setSelectedTeamMembers(prev => [...prev, member.id]);
      addTeamMember(member);
      // Deduct cost from resources (you might want to create an updateResources call here)
      updateMorale(5); // Adding team members boosts morale
    } else {
      triggerEvent({
        id: 'insufficient_funds',
        title: 'Insufficient Funds',
        description: `You need $${member.cost} to hire ${member.name}`,
        type: 'warning'
      });
    }
  };

  const handleAddFeature = (feature: Feature) => {
    // If already selected, remove it (deselect)
    if (selectedFeatures.includes(feature.id)) {
      setSelectedFeatures(prev => prev.filter(id => id !== feature.id));
      removeFeature(feature);
      updateMorale(-1);
      return;
    }
    
    // Check if this feature was previously added and removed
    const wasRemoved = gameState.features.some(f => f.id === feature.id);
    
    // If it can be added (either new or previously removed)
    if (wasRemoved || canAddFeature(feature)) {
      setSelectedFeatures(prev => [...prev, feature.id]);
      addFeature(feature);
      updateMorale(3);
    } else {
      const isComplexityIssue = feature.complexity * 2 > gameState.teamSkill;
      triggerEvent({
        id: 'cannot_add_feature',
        title: 'Cannot Add Feature',
        description: isComplexityIssue 
          ? `Your team's skill level (${gameState.teamSkill}) is too low for this feature (Complexity: ${feature.complexity})`
          : 'You need more resources to add this feature',
        type: 'warning'
      });
    }
  };

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

        {/* Add this card to the Resources Overview grid */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Skill</p>
                <p className="text-2xl font-bold text-purple-600">{gameState.teamSkill}/10</p>
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
                      disabled={isHired || !canAfford}
                      className="w-full"
                      variant={isHired ? "secondary" : "default"}
                    >
                      {isHired ? 'Hired' : canAfford ? 'Hire' : 'Insufficient Funds'}
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
                const canAdd = isSelected || wasRemoved || (canAfford && hasTime && canAddFeature(feature));
                
                return (
                  <Card 
                    key={feature.id}
                    className={`transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 
                      !canAdd ? 'opacity-50' : 'cursor-pointer'
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

                        {/* Add this inside the feature card's CardContent, after the existing content */}
                        <div className="mt-2">
                          {feature.complexity * 2 > gameState.teamSkill ? (
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
                          disabled={false}
                          className="w-full"
                          variant={isSelected ? "secondary" : "default"}
                        >
                          {isSelected ? 'Added' : canAdd ? 'Add Feature' : 'Cannot Add'}
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

      {/* Build Summary */}
      {(selectedTeamMembers.length > 0 || selectedFeatures.length > 0) && (
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
      )}

      
      <Card>
        <CardHeader>
          <CardTitle>Team Capability Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Average Team Skill</p>
              <p className="text-2xl font-bold text-blue-600">{gameState.teamSkill}/10</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Max Feature Complexity</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.floor(gameState.teamSkill * 2)}/10
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
            try {
              await onNext();
            } catch (error) {
              console.error('Error proceeding to next stage:', error);
            }
          }}
          disabled={!canProceed || isLoading}
          size="lg"
          className="px-8"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Analyzing team capability...</span>
            </div>
          ) : canProceed ? (
            'Proceed to Launch Stage'
          ) : (
            `Need ${Math.max(0, 2 - selectedTeamMembers.length)} more team members and ${Math.max(0, 3 - selectedFeatures.length)} more features`
          )}
        </Button>
        </div>
     </div>     
  );
};