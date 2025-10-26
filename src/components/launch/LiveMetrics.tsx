import { useState,useEffect } from "react";
import { Card, CardHeader,CardTitle, CardContent } from "../ui/card";
import { Zap } from "lucide-react";
import { Progress } from '@/components/ui/progress';

interface LiveMetricsProps {
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    followers: number;
    revenue: number;
    users: number;
    roi: number;
  };
  isActive: boolean;
  baseMetrics: {
    revenue: number;
    users: number;
    roi: number;
  };
  duration?: number; // Duration in milliseconds
  onComplete?: () => void;
}

export const LiveMetrics = ({ 
  metrics, 
  isActive, 
  baseMetrics,
  duration = 5000, // 5 seconds by default
  onComplete 
}: LiveMetricsProps) => {
  const [currentMetrics, setCurrentMetrics] = useState(metrics);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progressPercent = Math.min((elapsed / duration) * 100, 100);
        setProgress(progressPercent);

        // Calculate incremental changes
        const revenueIncrement = (metrics.revenue - baseMetrics.revenue) / (duration / 100);
        const usersIncrement = (metrics.users - baseMetrics.users) / (duration / 100);
        const roiIncrement = (metrics.roi - baseMetrics.roi) / (duration / 100);

        setCurrentMetrics(prev => ({
          impressions: prev.impressions + Math.round(Math.random() * 100),
          clicks: prev.clicks + Math.round(Math.random() * 10),
          conversions: prev.conversions + Math.round(Math.random() * 2),
          followers: prev.followers + Math.round(Math.random() * 5),
          revenue: baseMetrics.revenue + (revenueIncrement * progressPercent),
          users: baseMetrics.users + (usersIncrement * progressPercent),
          roi: baseMetrics.roi + (roiIncrement * progressPercent)
        }));

        if (elapsed >= duration) {
          clearInterval(interval);
          setCurrentMetrics(metrics); // Set final values
          onComplete?.();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isActive, metrics, baseMetrics, duration, onComplete]);

  return (
    <Card className="bg-black text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
            Live Campaign Metrics
          </div>
          <Progress value={progress} className="w-24 h-2" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Impressions</p>
            <p className="text-2xl font-bold text-green-400">
              {Math.round(currentMetrics.impressions).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Clicks</p>
            <p className="text-2xl font-bold text-blue-400">
              {Math.round(currentMetrics.clicks).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Conversions</p>
            <p className="text-2xl font-bold text-purple-400">
              {Math.round(currentMetrics.conversions).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Followers</p>
            <p className="text-2xl font-bold text-yellow-400">
              {Math.round(currentMetrics.followers).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Revenue</p>
            <p className="text-2xl font-bold text-green-400">
              ${Math.round(currentMetrics.revenue).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Users</p>
            <p className="text-2xl font-bold text-blue-400">
              {Math.round(currentMetrics.users).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">ROI</p>
            <p className="text-2xl font-bold text-orange-400">
              {currentMetrics.roi.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};