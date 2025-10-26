// components/build/TeamEfficiencyMonitor.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TeamEfficiencyMetrics } from '@/types/build';
import { Users, Zap, Heart, Brain } from 'lucide-react';

interface TeamEfficiencyMonitorProps {
  metrics: TeamEfficiencyMetrics;
  teamSize: number;
  totalCapacity: number;
}

export const TeamEfficiencyMonitor: React.FC<TeamEfficiencyMonitorProps> = ({
  metrics,
  teamSize,
  totalCapacity
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Team Efficiency Monitor
          </div>
          <Badge variant="outline">
            {metrics.overall}% Overall Efficiency
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Role-based Efficiency */}
          <div>
            <h4 className="text-sm font-medium mb-3">Efficiency by Role</h4>
            <div className="space-y-3">
              {Object.entries(metrics.byRole).map(([role, efficiency]) => (
                <div key={role}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{role}</span>
                    <span>{efficiency}%</span>
                  </div>
                  <Progress value={efficiency} />
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency Factors */}
          <div>
            <h4 className="text-sm font-medium mb-3">Performance Factors</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Skill Match</span>
                </div>
                <Progress value={metrics.factors.skillMatch} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Workload</span>
                </div>
                <Progress value={metrics.factors.workload} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Morale</span>
                </div>
                <Progress value={metrics.factors.morale} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Team Synergy</span>
                </div>
                <Progress value={metrics.factors.synergy} />
              </div>
            </div>
          </div>

          {/* Capacity Utilization */}
          <div>
            <h4 className="text-sm font-medium mb-3">Team Capacity</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{teamSize}</p>
                <p className="text-xs text-gray-500">Team Members</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{totalCapacity}h</p>
                <p className="text-xs text-gray-500">Weekly Capacity</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((metrics.factors.workload / 100) * totalCapacity)}h
                </p>
                <p className="text-xs text-gray-500">Utilized</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};