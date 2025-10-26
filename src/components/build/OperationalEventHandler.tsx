// components/build/OperationalEventHandler.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OperationalEvent } from '@/types/build';
import { AlertTriangle, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

interface OperationalEventHandlerProps {
  event: OperationalEvent;
  onResolve: (optionId: string) => void;
  availableResources: {
    money: number;
    time: number;
    teamSize: number;
  };
}

export const OperationalEventHandler: React.FC<OperationalEventHandlerProps> = ({
  event,
  onResolve,
  availableResources
}) => {
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'equipment': return <Wrench className="w-5 h-5" />;
      case 'staff': return <Users className="w-5 h-5" />;
      case 'quality': return <CheckCircle className="w-5 h-5" />;
      case 'opportunity': return <Zap className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const canChooseOption = (option: typeof event.options[0]) => {
    if (!option.requiredResources) return true;
    return (
      availableResources.money >= (option.requiredResources.money || 0) &&
      availableResources.time >= (option.requiredResources.time || 0) &&
      availableResources.teamSize >= (option.requiredResources.teamSize || 0)
    );
  };

  return (
    <Card className="border-2 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getEventTypeIcon(event.type)}
          <span>{event.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{event.description}</AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Impact</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Productivity</span>
                  <Badge variant={event.impact.productivity >= 0 ? "default" : "destructive"}>
                    {event.impact.productivity > 0 ? '+' : ''}{event.impact.productivity}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Morale</span>
                  <Badge variant={event.impact.morale >= 0 ? "default" : "destructive"}>
                    {event.impact.morale > 0 ? '+' : ''}{event.impact.morale}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cost</span>
                  <Badge variant={event.impact.cost <= 0 ? "default" : "destructive"}>
                    ${Math.abs(event.impact.cost).toLocaleString()}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Time Impact</h4>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{Math.abs(event.impact.timeDelay)} days</span>
                {event.impact.timeDelay > 0 ? (
                  <Badge variant="destructive">Delay</Badge>
                ) : (
                  <Badge variant="default">Saved</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Available Options</h4>
            <div className="space-y-3">
              {event.options.map(option => (
                <div key={option.id} className="space-y-2">
                  <Button
                    onClick={() => onResolve(option.id)}
                    disabled={!canChooseOption(option)}
                    className="w-full justify-between"
                    variant={canChooseOption(option) ? "default" : "outline"}
                  >
                    <span>{option.text}</span>
                    <div className="flex items-center gap-2">
                      {option.effect.cost > 0 && (
                        <span className="text-sm">
                          <DollarSign className="w-4 h-4 inline" />
                          {option.effect.cost}
                        </span>
                      )}
                      {option.effect.time !== 0 && (
                        <span className="text-sm">
                          <Clock className="w-4 h-4 inline" />
                          {option.effect.time > 0 ? '+' : ''}{option.effect.time}d
                        </span>
                      )}
                    </div>
                  </Button>
                  {!canChooseOption(option) && (
                    <p className="text-xs text-red-500">
                      Insufficient resources for this option
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};