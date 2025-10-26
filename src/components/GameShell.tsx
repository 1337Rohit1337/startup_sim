import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGameState } from '../hooks/useGameState';
import { FoundationStage } from './stages/FoundationStage';
import { BuildStage } from './stages/BuildStage';
import { LaunchStage } from './stages/LaunchStage';
import { ScoreDisplay } from './shared/ScoreDisplay';
import { DollarSign, Clock, Zap, Heart } from 'lucide-react';



export const GameShell: React.FC = () => {
  const {
    gameState,
    updateScore,
    updateResources,
    addTeamMember,
    addFeature,
    updateMorale,
    validateIdea,
    updateMarketingScore,
    triggerEvent,
    resolveEvent,
    addSocialPost,
    nextStage,
    updateFinances,
    canAddFeature,
    removeFeature,
  } = useGameState();



  const renderCurrentStage = () => {
    switch (gameState.stage) {
      case 'foundation':
        return (
          <FoundationStage
            updateFinances={updateFinances}
            gameState={gameState}
            updateScore={updateScore}
            validateIdea={validateIdea}
            triggerEvent={triggerEvent}
            resolveEvent={resolveEvent}
            
            onNext={nextStage}
          />
        );
      case 'build':
        return (
          <BuildStage
            gameState={gameState}
            addTeamMember={addTeamMember}
            updateFinances={updateFinances}
            addFeature={addFeature}
            removeFeature={removeFeature}
            updateMorale={updateMorale}
            triggerEvent={triggerEvent}
            resolveEvent={resolveEvent}
            canAddFeature={canAddFeature}
            onNext={nextStage}
            isLoading={false}
          />
        );
      case 'launch':
      return (
        <LaunchStage
          gameState={gameState}
          addSocialPost={addSocialPost}
          updateScore={updateScore}
          updateResources={updateResources}
          updateFinances={updateFinances}
          updateMarketingScore={updateMarketingScore}
          triggerEvent={triggerEvent}
          resolveEvent={resolveEvent}
          
          onComplete={() => {
            updateScore(1000);
            setIsComplete(true);
            alert('Congratulations! You have successfully launched your startup!');
          }}
        />
      );
      default:
        return <div>Unknown stage</div>;
    }
  };

  const getStageProgress = () => {
    const stages = ['foundation', 'build', 'launch'];
    const currentIndex = stages.indexOf(gameState.stage);
    return ((currentIndex + 1) / stages.length) * 100;
  };
  console.log('gameState:', gameState);
  console.log('resources:', gameState.resources);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-accent">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
            Startup Simulator
          </h1>
          <p className="text-muted-foreground">Navigate the entrepreneurial journey from idea to launch</p>
        </div>

        {/* Game Progress */}
        <Card className="mb-6 shadow-soft gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Game Progress</span>
              <Badge variant="outline" className="capitalize">
                {gameState.stage} Stage
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={getStageProgress()} className="w-full mb-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className={gameState.stage === 'foundation' ? 'font-semibold text-primary' : ''}>
                Foundation
              </span>
              <span className={gameState.stage === 'build' ? 'font-semibold text-primary' : ''}>
                Build
              </span>
              <span className={gameState.stage === 'launch' ? 'font-semibold text-primary' : ''}>
                Launch
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Resources Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-soft gradient-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Score</p>
                  <p className="text-2xl font-bold text-primary">{gameState.score}</p>
                </div>
                <Zap className="w-8 h-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft gradient-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Money</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${gameState.resources.money}</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-500 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft gradient-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{gameState.resources.time}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-500 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft gradient-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Morale</p>
                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{gameState.morale}%</p>
                </div>
                <Heart className="w-8 h-8 text-rose-500 opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Stage */}
        <div className="mb-6">
          {renderCurrentStage()}
        </div>

        {/* Score Display */}
        {gameState.stage === 'launch' && gameState.isComplete && (
       <ScoreDisplay scores={gameState.scores} />
)}
      </div>
    </div>
  );
};