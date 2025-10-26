import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  Server, 
  DollarSign, 
  UserMinus,
  AlertTriangle 
} from 'lucide-react';
import { MonthlyMetrics } from '@/types/progression';
import { METRIC_DESCRIPTIONS, METRIC_FORMATTING } from '@/data/monthlyMetrics';
import { getSuccessThreshold } from '@/data/successConditions';

interface MetricsOverviewProps {
  metrics: MonthlyMetrics;
  month: number;
  totalUsers: number;
}

export const MetricsOverview = ({ metrics, month, totalUsers }: MetricsOverviewProps) => {
  const threshold = getSuccessThreshold(month);

  const getMetricStatus = (
    metricKey: keyof MonthlyMetrics,
    value: number,
    threshold: number,
    isReverse: boolean = false
  ) => {
    const comparison = isReverse ? value <= threshold : value >= threshold;
    return {
      status: comparison ? 'success' : 'warning',
      progress: Math.min(100, (value / threshold) * 100)
    };
  };

  const MetricCard = ({ 
    title, 
    value, 
    target, 
    icon: Icon, 
    isReverse = false,
    description 
  }: {
    title: string;
    value: number;
    target: number;
    icon: any;
    isReverse?: boolean;
    description: string;
  }) => {
    const { status, progress } = getMetricStatus(
      title as keyof MonthlyMetrics,
      value,
      target,
      isReverse
    );

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-gray-500" />
              {title}
            </div>
            <Badge variant={status === 'success' ? 'default' : 'destructive'}>
              {status === 'success' ? 'On Track' : 'At Risk'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">
                {typeof value === 'number' ? METRIC_FORMATTING[title as keyof MonthlyMetrics](value) : value}
              </span>
              <span className="text-sm text-gray-500">
                Target: {METRIC_FORMATTING[title as keyof MonthlyMetrics](target)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Performance Metrics</h2>
        <Badge variant="outline" className="text-sm">
          Month {month}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Revenue"
          value={metrics.revenue}
          target={threshold.minimumRevenue}
          icon={DollarSign}
          description={METRIC_DESCRIPTIONS.revenue}
        />

        <MetricCard
          title="User Growth"
          value={metrics.userGrowth}
          target={5} // 5% monthly growth target
          icon={Users}
          description={`Current users: ${totalUsers.toLocaleString()}`}
        />

        <MetricCard
          title="Customer Satisfaction"
          value={metrics.customerSatisfaction}
          target={threshold.minimumSatisfaction}
          icon={Heart}
          description={METRIC_DESCRIPTIONS.customerSatisfaction}
        />

        <MetricCard
          title="Server Uptime"
          value={metrics.serverUptime}
          target={threshold.minimumUptime}
          icon={Server}
          description={METRIC_DESCRIPTIONS.serverUptime}
        />

        <MetricCard
          title="Marketing ROI"
          value={metrics.marketingROI * 100} // Convert to percentage
          target={threshold.minimumROI * 100}
          icon={TrendingUp}
          description={METRIC_DESCRIPTIONS.marketingROI}
        />

        <MetricCard
          title="Churn Rate"
          value={metrics.churnRate}
          target={threshold.maximumChurnRate}
          icon={UserMinus}
          isReverse={true}
          description={METRIC_DESCRIPTIONS.churnRate}
        />
      </div>

      {/* Warnings Section */}
      <div className="mt-6">
        {Object.entries(metrics).map(([key, value]) => {
          const metricKey = key as keyof MonthlyMetrics;
          const target = threshold[`minimum${metricKey.charAt(0).toUpperCase() + metricKey.slice(1)}` as keyof typeof threshold];
          if (target && value < target) {
            return (
              <div key={key} className="flex items-center gap-2 text-amber-600 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  {key.charAt(0).toUpperCase() + key.slice(1)} is below target. 
                  Current: {METRIC_FORMATTING[metricKey](value)}, 
                  Target: {METRIC_FORMATTING[metricKey](target)}
                </span>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};