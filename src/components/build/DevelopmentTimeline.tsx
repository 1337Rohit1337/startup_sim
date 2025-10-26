// components/build/DevelopmentTimeline.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DevelopmentMilestone } from '@/types/build';
import { Calendar, CheckCircle, Clock, Star } from 'lucide-react';

interface DevelopmentTimelineProps {
  milestones: DevelopmentMilestone[];
  currentDay: number;
  totalDays: number;
  completedMilestones: string[];
}

export const DevelopmentTimeline: React.FC<DevelopmentTimelineProps> = ({
  milestones,
  currentDay,
  totalDays,
  completedMilestones
}) => {
  const progressPercentage = (currentDay / totalDays) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Development Timeline
          </div>
          <Badge variant="outline">
            Day {currentDay} of {totalDays}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} />
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              const isCompleted = completedMilestones.includes(milestone.id);
              const isNext = !isCompleted && 
                completedMilestones.length === index;

              return (
                <div 
                  key={milestone.id}
                  className={`
                    p-4 rounded-lg border
                    ${isCompleted ? 'bg-green-50 border-green-200' :
                      isNext ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50 border-gray-200'}
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {milestone.name}
                      </h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                    <Badge variant={isCompleted ? "success" : "outline"}>
                      {isCompleted ? "Completed" : `${milestone.timeRequired} days`}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Requirements</h5>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Team Size</span>
                          <span>{milestone.completionCriteria.teamSize}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Team Skill</span>
                          <span>{milestone.completionCriteria.teamSkill}/10</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-2">Rewards</h5>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Quality</span>
                          <span>+{milestone.rewards.productQuality}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Efficiency</span>
                          <span>+{milestone.rewards.teamEfficiency}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};