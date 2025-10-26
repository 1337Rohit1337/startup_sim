import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuccessCheckResult } from '@/components/utils/successFailureChecks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  XCircle, 
  TrendingUp, 
  Users, 
  Heart, 
  Server, 
  DollarSign,
  BarChart,
  Share2,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface MetricData {
  current: number;
  required: number;
  achieved: boolean;
}

interface GameMetrics {
  revenue: MetricData;
  userGrowth: MetricData;
  customerSatisfaction: MetricData;
  serverUptime: MetricData;
  marketingROI: MetricData;
  churnRate: MetricData;
  conversionRate: MetricData;
  [key: string]: MetricData;
}



interface GameState {
  teamMembers: any[];
  features: any[];
  users: number;
  revenue: number;
  selectedChannels?: string[];
}

interface SuccessFailureModalProps {
  isOpen: boolean;
  result: SuccessCheckResult;
  gameState: GameState;
  onRestart: () => void;
  onClose: () => void;
}

const METRIC_FORMATTING: { [key: string]: (value: number) => string } = {
  revenue: (value: number) => `$${value.toLocaleString()}`,
  users: (value: number) => value.toLocaleString(),
  userGrowth: (value: number) => `${value.toFixed(1)}%`,
  customerSatisfaction: (value: number) => `${value.toFixed(1)}%`,
  serverUptime: (value: number) => `${value.toFixed(2)}%`,
  marketingROI: (value: number) => `${(value * 100).toFixed(1)}%`,
  churnRate: (value: number) => `${value.toFixed(1)}%`,
  conversionRate: (value: number) => `${value.toFixed(1)}%`,
  cashflow: (value: number) => `$${value.toLocaleString()}`
};

const METRIC_ICONS: { [key: string]: any } = {
  revenue: DollarSign,
  users: Users,
  customerSatisfaction: Heart,
  serverUptime: Server,
  marketingROI: TrendingUp,
  churnRate: Share2,
  userGrowth: TrendingUp,
  conversionRate: Users
};

export const SuccessFailureModal = ({
  isOpen,
  result,
  gameState,
  onRestart,
  onClose
}: SuccessFailureModalProps) => {
  const navigate = useNavigate();
  const [animateScore, setAnimateScore] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const duration = 2000;
      const steps = 60;
      const increment = result.overallScore / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= result.overallScore) {
          setAnimateScore(result.overallScore);
          clearInterval(interval);
        } else {
          setAnimateScore(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [isOpen, result.overallScore]);

  if (!isOpen) return null;

  const getTimelineEvents = () => [
    {
      month: 1,
      title: 'Startup Launch',
      description: `Started with ${gameState.teamMembers?.length || 0} team members and ${gameState.features?.length || 0} features`
    },
    {
      month: 3,
      title: 'First Quarter',
      description: `Achieved ${gameState.users?.toLocaleString() || 0} users and $${result.metrics.revenue?.current?.toLocaleString() || 0} revenue`
    },
    {
      month: 6,
      title: 'Mid-Year',
      description: `Expanded to ${gameState.features?.length || 0} features and ${gameState.selectedChannels?.length || 0} marketing channels`
    },
    {
      month: 12,
      title: 'Year End',
      description: `Final Score: ${result.overallScore}/100 with $${result.metrics.revenue.current.toLocaleString()} revenue`
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          {result.success ? (
            <>
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-green-600 mb-2">
                Startup Success!
              </h2>
              <p className="text-gray-600">
                Congratulations! Your startup has achieved sustainable growth.
              </p>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-red-600 mb-2">
                Startup Challenges
              </h2>
              <p className="text-gray-600">
                Your startup faced some critical challenges.
              </p>
            </>
          )}
        </div>

        {/* Score Display */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                {animateScore}
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <p className="text-gray-600">Overall Performance Score</p>
              <Progress value={animateScore} className="h-2 mt-4" />
            </div>
          </CardContent>
        </Card>

        {/* Metrics Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(result.metrics).map(([key, data]) => {
            if (!data) return null;
            const Icon = METRIC_ICONS[key] || BarChart;
            const formatter = METRIC_FORMATTING[key] || ((value: number) => value.toString());
            
            return (
              <Card key={key}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-gray-500" />
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <Badge variant={data.achieved ? 'default' : 'destructive'}>
                      {data.achieved ? 'Achieved' : 'Not Met'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {formatter(data.current)}</span>
                      <span className="text-gray-500">
                        Required: {formatter(data.required)}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((data.current / data.required) * 100, 100)} 
                      className="h-1.5"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Journey Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getTimelineEvents().map((event, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 text-sm text-gray-500">
                    Month {event.month}
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success/Failure Factors */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {result.successFactors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Success Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.successFactors.map((factor, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {result.failureReasons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.failureReasons.map((reason, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onRestart}>
            Try Again
          </Button>
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};