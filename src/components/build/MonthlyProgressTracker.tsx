// components/build/MonthlyProgressTracker.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MonthlyProgress } from '@/types/build';

interface MonthlyProgressTrackerProps {
  currentMonth: number;
  progress?: MonthlyProgress;
  stage: 'early' | 'growth' | 'stabilization';
}

export const MonthlyProgressTracker: React.FC<MonthlyProgressTrackerProps> = ({
  currentMonth,
  progress,
  stage
}) => {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'early': return 'text-blue-600';
      case 'growth': return 'text-green-600';
      case 'stabilization': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

    const defaultProgress: MonthlyProgress = {
    month: currentMonth,
    stage: stage,
    completedTasks: [],
    pendingTasks: [],
    metrics: {
      teamEfficiency: 0,
      productQuality: 0,
      developmentProgress: 0
    },
    achievements: []
  };

  // Use progress if available, otherwise use default values
  const currentProgress = progress || defaultProgress;


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Month {currentMonth} Progress</span>
          <Badge variant="outline" className={getStageColor(stage)}>
            {stage.charAt(0).toUpperCase() + stage.slice(1)} Stage
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Team Efficiency</p>
              <Progress value={progress.metrics.teamEfficiency} className="mt-1" />
              <p className="text-xs text-right">{progress.metrics.teamEfficiency}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Product Quality</p>
              <Progress value={progress.metrics.productQuality} className="mt-1" />
              <p className="text-xs text-right">{progress.metrics.productQuality}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Development</p>
              <Progress value={progress.metrics.developmentProgress} className="mt-1" />
              <p className="text-xs text-right">{progress.metrics.developmentProgress}%</p>
            </div>
          </div>

          {/* Tasks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Completed Tasks</h4>
              <div className="space-y-1">
                {progress.completedTasks.map(task => (
                  <div key={task} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm">{task}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Pending Tasks</h4>
              <div className="space-y-1">
                {progress.pendingTasks.map(task => (
                  <div key={task} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-sm">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h4 className="text-sm font-medium mb-2">Monthly Achievements</h4>
            <div className="grid grid-cols-2 gap-2">
              {progress.achievements.map(achievement => (
                <Badge 
                  key={achievement.id}
                  variant={achievement.achieved ? "default" : "outline"}
                  className="justify-start"
                >
                  {achievement.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};