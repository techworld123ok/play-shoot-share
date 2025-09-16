import React, { useState } from 'react';
import { GameMenu } from '@/components/game/GameMenu';
import { GameCanvas } from '@/components/game/GameCanvas';
import { toast } from "sonner";

type GameState = 'menu' | 'singleplayer' | 'multiplayer' | 'leaderboard';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('menu');

  const handleStartSinglePlayer = () => {
    setGameState('singleplayer');
    toast("Single player mode started! Good luck!", { duration: 3000 });
  };

  const handleStartMultiplayer = () => {
    setGameState('multiplayer');
    toast("Multiplayer mode starting...", { duration: 2000 });
  };

  const handleViewLeaderboard = () => {
    setGameState('leaderboard');
    toast("Leaderboard coming soon!", { duration: 2000 });
  };

  const handleBackToMenu = () => {
    setGameState('menu');
  };

  return (
    <div className="min-h-screen bg-background">
      {gameState === 'menu' && (
        <GameMenu
          onStartSinglePlayer={handleStartSinglePlayer}
          onStartMultiplayer={handleStartMultiplayer}
          onViewLeaderboard={handleViewLeaderboard}
        />
      )}

      {gameState === 'singleplayer' && (
        <div className="relative">
          <button
            onClick={handleBackToMenu}
            className="absolute top-4 left-4 z-10 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border text-foreground rounded-lg hover:bg-card transition-colors"
          >
            ← Back to Menu
          </button>
          <GameCanvas />
        </div>
      )}

      {gameState === 'leaderboard' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
            <p className="text-xl text-muted-foreground mb-8">Coming soon...</p>
            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
