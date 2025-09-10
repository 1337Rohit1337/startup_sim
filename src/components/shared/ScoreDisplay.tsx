import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, DollarSign } from 'lucide-react';
import { GameScores } from '@/types/game';

interface ScoreDisplayProps {
  scores: GameScores;
  showValuation?: boolean;
}

export const ScoreDisplay = ({ scores, showValuation = false }: ScoreDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };
  
  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };
  
  const calculateValuation = (overallScore: number) => {
    // Simple valuation formula based on overall score
    const baseValuation = 50000; // $50k base
    const multiplier = Math.pow(overallScore / 100, 2) * 10;
    return Math.round(baseValuation * multiplier);
  };
  
  const valuation = calculateValuation(scores.overall);
  
  return (
    <div className="space-y-6">
      {/* Individual Scores */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-blue-600" />
              Foundation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-2xl font-bold ${getScoreColor(scores.foundation)}`}>
                  {scores.foundation}
                </span>
                <Badge variant="outline">
                  {getScoreGrade(scores.foundation)}
                </Badge>
              </div>
              <Progress value={scores.foundation} className="h-2" />
              <p className="text-xs text-gray-500">
                Idea validation and market research
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-600" />
              Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-2xl font-bold ${getScoreColor(scores.development)}`}>
                  {scores.development}
                </span>
                <Badge variant="outline">
                  {getScoreGrade(scores.development)}
                </Badge>
              </div>
              <Progress value={scores.development} className="h-2" />
              <p className="text-xs text-gray-500">
                Team building and product features
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              Marketing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-2xl font-bold ${getScoreColor(scores.marketing)}`}>
                  {scores.marketing}
                </span>
                <Badge variant="outline">
                  {getScoreGrade(scores.marketing)}
                </Badge>
              </div>
              <Progress value={scores.marketing} className="h-2" />
              <p className="text-xs text-gray-500">
                Channel selection and budget allocation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Overall Score */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={`text-4xl font-bold ${getScoreColor(scores.overall)}`}>
                {scores.overall}
              </span>
              <Badge 
                variant="outline" 
                className="text-lg px-3 py-1"
              >
                {getScoreGrade(scores.overall)}
              </Badge>
            </div>
            <Progress value={scores.overall} className="h-3" />
            
            {showValuation && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-lg font-semibold">Estimated Valuation:</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    ${valuation.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Based on your overall performance across all stages
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Performance Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Foundation (30%):</span>
              <span className="font-medium">{scores.foundation} × 0.3 = {(scores.foundation * 0.3).toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Development (35%):</span>
              <span className="font-medium">{scores.development} × 0.35 = {(scores.development * 0.35).toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Marketing (35%):</span>
              <span className="font-medium">{scores.marketing} × 0.35 = {(scores.marketing * 0.35).toFixed(1)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold">
              <span>Total Score:</span>
              <span>{scores.overall}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};