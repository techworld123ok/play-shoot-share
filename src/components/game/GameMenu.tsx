import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Users, Bot, Trophy, Settings } from 'lucide-react';

interface GameMenuProps {
  onStartSinglePlayer: () => void;
  onStartMultiplayer: () => void;
  onViewLeaderboard: () => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  onStartSinglePlayer,
  onStartMultiplayer,
  onViewLeaderboard,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 animate-pulse-glow">
            BATTLE ARENA
          </h1>
          <p className="text-xl text-muted-foreground">
            Multiplayer Gun Shooting Game
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Single Player Mode */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-secondary/20 w-fit">
                <Bot className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Single Player</CardTitle>
              <CardDescription>
                Battle against AI bots and survive as long as possible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span>Fight against intelligent AI bots</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span>Multiple difficulty levels</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span>Earn points for eliminations</span>
                </div>
              </div>
              <Button 
                onClick={onStartSinglePlayer}
                className="w-full bg-gradient-to-r from-secondary to-secondary-glow hover:shadow-lg hover:shadow-secondary/25"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Battle
              </Button>
            </CardContent>
          </Card>

          {/* Multiplayer Mode */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-primary/20 w-fit">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Multiplayer</CardTitle>
              <CardDescription>
                Battle against friends online in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Up to 8 players per match</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Real-time combat action</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Share lobby link with friends</span>
                </div>
              </div>
              <Button 
                onClick={onStartMultiplayer}
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:shadow-primary/25"
                size="lg"
                disabled
              >
                <Users className="w-5 h-5 mr-2" />
                Coming Soon
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Multiplayer mode will be available in the next update
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={onViewLeaderboard}
            variant="outline"
            size="lg"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Leaderboard
          </Button>
          
          <Button
            onClick={() => alert('Settings coming soon!')}
            variant="outline"
            size="lg"
            className="border-muted-foreground/50 hover:bg-muted"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
        </div>

        {/* Game Info */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-muted-foreground">
            Use <kbd className="px-2 py-1 text-xs bg-muted rounded">WASD</kbd> to move, 
            <kbd className="px-2 py-1 text-xs bg-muted rounded ml-1">Mouse</kbd> to aim and shoot
          </p>
          <p className="text-xs text-muted-foreground">
            Survive, eliminate enemies, and climb the leaderboard!
          </p>
        </div>
      </div>
    </div>
  );
};