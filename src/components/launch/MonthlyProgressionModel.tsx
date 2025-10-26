import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { MonthlyMetrics, MonthlyExpenses, MonthlyEvent } from '@/types/progression';
import { METRIC_FORMATTING } from '@/data/monthlyMetrics';

interface MonthlyProgressionModalProps {
  isOpen: boolean;
  month: number;
  metrics: MonthlyMetrics;
  previousMetrics: MonthlyMetrics;
  expenses: MonthlyExpenses;
  events: MonthlyEvent[];
  onClose: () => void;
  onContinue: () => void;
}

export const MonthlyProgressionModal = ({
  isOpen,
  month,
  metrics,
  previousMetrics,
  expenses,
  events,
  onClose,
  onContinue
}: MonthlyProgressionModalProps) => {
  const [showEvents, setShowEvents] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowEvents(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getMetricChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: change,
      isPositive: change > 0,
      isSignificant: Math.abs(change) > 5
    };
  };

  const renderMetricChange = (current: number, previous: number) => {
    const change = getMetricChange(current, previous);
    return (
      <div className="flex items-center gap-1">
        {change.isPositive ? (
          <TrendingUp className={`h-4 w-4 ${change.isSignificant ? 'text-green-500' : 'text-gray-500'}`} />
        ) : (
          <TrendingDown className={`h-4 w-4 ${change.isSignificant ? 'text-red-500' : 'text-gray-500'}`} />
        )}
        <span className={change.isSignificant ? 
          (change.isPositive ? 'text-green-600' : 'text-red-600') : 
          'text-gray-600'
        }>
          {change.value > 0 ? '+' : ''}{change.value.toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Month {month} Report
            </h2>
            <p className="text-gray-600">Monthly performance overview and key metrics</p>
          </div>
          {events.length > 0 && (
            <Badge 
              variant={events.some(e => e.type === 'negative') ? 'destructive' : 'default'}
              className="cursor-pointer"
              onClick={() => setShowEvents(!showEvents)}
            >
              {events.length} Event{events.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {showEvents && events.length > 0 && (
          <div className="mb-6 space-y-2">
            {events.map(event => (
              <Alert key={event.id} variant={event.type === 'negative' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{event.title}</AlertTitle>
                <AlertDescription>{event.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      {METRIC_FORMATTING[key as keyof MonthlyMetrics](value)}
                    </span>
                    {renderMetricChange(value, previousMetrics[key as keyof MonthlyMetrics])}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(expenses).filter(([key]) => key !== 'total').map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium">${value.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-bold">
                  <span>Total Expenses</span>
                  <span>${expenses.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Review Details
          </Button>
          <Button onClick={onContinue}>
            Continue to Next Month
          </Button>
        </div>
      </div>
    </div>
  );
};