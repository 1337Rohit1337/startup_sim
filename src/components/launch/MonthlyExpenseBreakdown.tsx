import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Server,
  Users,
  Building,
  Shield,
  Headphones,
  AlertTriangle,
  PieChart
} from 'lucide-react';
import { MonthlyExpenses } from '@/types/progression';

interface MonthlyExpenseBreakdownProps {
  currentExpenses: MonthlyExpenses;
  previousExpenses?: MonthlyExpenses;
  totalRevenue: number;
  availableBudget: number;
  onOptimize?: (category: keyof MonthlyExpenses) => void;
}

export const MonthlyExpenseBreakdown = ({
  currentExpenses,
  previousExpenses,
  totalRevenue,
  availableBudget,
  onOptimize
}: MonthlyExpenseBreakdownProps) => {
  const [selectedCategory, setSelectedCategory] = useState<keyof MonthlyExpenses | null>(null);

  const expenseCategories = {
    marketing: {
      icon: TrendingUp,
      title: 'Marketing',
      description: 'User acquisition and brand awareness',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    servers: {
      icon: Server,
      title: 'Infrastructure',
      description: 'Server costs and maintenance',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    salaries: {
      icon: Users,
      title: 'Team',
      description: 'Salaries and benefits',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    maintenance: {
      icon: Building,
      title: 'Maintenance',
      description: 'Regular upkeep and updates',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    customerSupport: {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Support staff and tools',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  };

  const calculateChange = (current: number, previous: number | undefined) => {
    if (!previous) return null;
    const percentChange = ((current - previous) / previous) * 100;
    return {
      value: percentChange,
      isIncrease: percentChange > 0
    };
  };

  const calculatePercentageOfTotal = (amount: number) => {
    return (amount / currentExpenses.total) * 100;
  };

  const getExpenseStatus = (category: keyof MonthlyExpenses) => {
    const amount = currentExpenses[category];
    const previousAmount = previousExpenses?.[category];
    const change = calculateChange(amount, previousAmount);
    
    // Define thresholds for different categories
    const thresholds = {
      marketing: { warning: 0.3, critical: 0.4 }, // % of revenue
      servers: { warning: 0.2, critical: 0.3 },
      salaries: { warning: 0.4, critical: 0.5 },
      maintenance: { warning: 0.15, critical: 0.25 },
      customerSupport: { warning: 0.15, critical: 0.25 }
    };

    const percentOfRevenue = amount / totalRevenue;
    const threshold = thresholds[category];

    return {
      status: 
        percentOfRevenue > threshold.critical ? 'critical' :
        percentOfRevenue > threshold.warning ? 'warning' :
        'healthy',
      change
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Monthly Expenses Breakdown
          </h2>
          <p className="text-sm text-gray-600">
            Total Expenses: ${currentExpenses.total.toLocaleString()} / Revenue: ${totalRevenue.toLocaleString()}
          </p>
        </div>
        <Badge variant={currentExpenses.total > totalRevenue ? 'destructive' : 'default'}>
          {currentExpenses.total > totalRevenue ? 'Over Budget' : 'Within Budget'}
        </Badge>
      </div>

      {/* Expense Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Expense Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(Object.keys(expenseCategories) as Array<keyof typeof expenseCategories>).map(category => {
              const { icon: Icon, title, description, color, bgColor } = expenseCategories[category];
              const amount = currentExpenses[category];
              const { status, change } = getExpenseStatus(category);
              const percentage = calculatePercentageOfTotal(amount);

              return (
                <div 
                  key={category}
                  className={`p-4 rounded-lg ${bgColor} cursor-pointer transition-all hover:shadow-md`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${color}`} />
                      <div>
                        <h3 className="font-medium">{title}</h3>
                        <p className="text-sm text-gray-600">{description}</p>
                      </div>
                    </div>
                    <Badge variant={
                      status === 'critical' ? 'destructive' :
                      status === 'warning' ? 'secondary' :
                      'default'
                    }>
                      {status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        ${amount.toLocaleString()}
                      </span>
                      {change && (
                        <div className="flex items-center gap-1 text-sm">
                          {change.isIncrease ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          )}
                          <span className={change.isIncrease ? 'text-red-600' : 'text-green-600'}>
                            {Math.abs(change.value).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{percentage.toFixed(1)}% of total expenses</span>
                      <span>{((amount / totalRevenue) * 100).toFixed(1)}% of revenue</span>
                    </div>
                  </div>

                  {status !== 'healthy' && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-amber-600">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <p>
                        {status === 'critical' 
                          ? 'Expenses in this category are significantly high relative to revenue.'
                          : 'Consider optimizing this expense category.'}
                      </p>
                    </div>
                  )}

                  {onOptimize && (status === 'warning' || status === 'critical') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOptimize(category);
                      }}
                    >
                      View Optimization Suggestions
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Burn Rate</p>
              <p className="text-2xl font-bold text-red-600">
                ${(currentExpenses.total - totalRevenue).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Runway</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.floor(availableBudget / (currentExpenses.total - totalRevenue))} months
              </p>
              <p className="text-xs text-gray-500">at current burn rate</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expense Ratio</p>
              <p className="text-2xl font-bold text-blue-600">
                {((currentExpenses.total / totalRevenue) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">of revenue</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Change</p>
              <p className="text-2xl font-bold text-green-600">
                {previousExpenses 
                  ? ((currentExpenses.total - previousExpenses.total) / previousExpenses.total * 100).toFixed(1)
                  : 0}%
              </p>
              <p className="text-xs text-gray-500">from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};