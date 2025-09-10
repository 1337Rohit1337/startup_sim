import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GameShell } from '@/components/GameShell';
import { FoundationStage } from '@/components/stages/FoundationStage';
import { BuildStage } from '@/components/stages/BuildStage';
import { LaunchStage } from '@/components/stages/LaunchStage';
import { ScoreDisplay } from '@/components/shared/ScoreDisplay';
import { useGameState } from '@/hooks/useGameState';
import { Play, RotateCcw, Trophy } from 'lucide-react';

export default function Index() {
  const { gameState, updateChoices, nextStage, resetGame } = useGameState();
  const [gameStarted, setGameStarted] = useState(false);
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  const handleRestart = () => {
    resetGame();
    setGameStarted(false);
  };
  
  // Welcome Screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-4">
              🚀 Startup Simulator
            </CardTitle>
            <CardDescription className="text-lg">
              Build your dream startup from idea to launch! Navigate through 3 challenging stages 
              and see if you have what it takes to create a successful business.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">💡</div>
                <h3 className="font-semibold">Stage 1: Foundation</h3>
                <p className="text-sm text-gray-600">Choose and validate your startup idea</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">🛠️</div>
                <h3 className="font-semibold">Stage 2: Build</h3>
                <p className="text-sm text-gray-600">Assemble your team and design your product</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-semibold">Stage 3: Launch</h3>
                <p className="text-sm text-gray-600">Execute your marketing strategy</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🎯 Your Mission:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Make strategic decisions that impact your startup's success</li>
                <li>• Balance cost, quality, and market timing</li>
                <li>• Achieve the highest valuation possible</li>
                <li>• Learn real entrepreneurship principles along the way</li>
              </ul>
            </div>
            
            <div className="text-center">
              <Button onClick={startGame} size="lg" className="px-8">
                <Play className="h-5 w-5 mr-2" />
                Start Your Startup Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Game Results Screen
  if (gameState.completed) {
    return (
      <GameShell gameState={gameState}>
        <div className="space-y-8">
          <div className="text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Congratulations! 🎉
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You've successfully navigated through all stages of building a startup. 
              Here's how your venture performed:
            </p>
          </div>
          
          <ScoreDisplay scores={gameState.scores} showValuation={true} />
          
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-4">
              <Button onClick={handleRestart} size="lg" variant="outline">
                <RotateCcw className="h-5 w-5 mr-2" />
                Play Again
              </Button>
            </div>
            
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>What You Learned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p><strong>Market Validation:</strong> Understanding your customers before building is crucial for startup success.</p>
                  <p><strong>Team Building:</strong> The right team with complementary skills can make or break your venture.</p>
                  <p><strong>Resource Management:</strong> Balancing budget, features, and quality requires strategic thinking.</p>
                  <p><strong>Marketing Strategy:</strong> Choosing the right channels and allocating budget effectively drives growth.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </GameShell>
    );
  }
  
  // Game Stages
  return (
    <GameShell gameState={gameState}>
      {gameState.currentStage === 1 && (
        <FoundationStage 
          choices={gameState.choices}
          onUpdateChoices={updateChoices}
          onNextStage={nextStage}
        />
      )}
      
      {gameState.currentStage === 2 && (
        <BuildStage 
          choices={gameState.choices}
          onUpdateChoices={updateChoices}
          onNextStage={nextStage}
        />
      )}
      
      {gameState.currentStage === 3 && (
        <LaunchStage 
          choices={gameState.choices}
          onUpdateChoices={updateChoices}
          onNextStage={nextStage}
        />
      )}
    </GameShell>
  );
}