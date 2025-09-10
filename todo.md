# Entrepreneurship Simulation Game - MVP Implementation

## Core Files to Create (8 files max)

### 1. Game State Management
- `src/types/game.ts` - TypeScript interfaces for game state, scores, stages
- `src/hooks/useGameState.ts` - Custom hook for game state management

### 2. Main Game Components
- `src/components/GameShell.tsx` - Main game layout with header, progress, profile
- `src/components/StageNavigator.tsx` - Stage progression component

### 3. Stage Components (simplified MVP versions)
- `src/components/stages/FoundationStage.tsx` - Stage 1: Startup idea selection and validation
- `src/components/stages/BuildStage.tsx` - Stage 2: Team building and product design
- `src/components/stages/LaunchStage.tsx` - Stage 3: Marketing and launch simulation

### 4. Shared Components
- `src/components/shared/ScoreDisplay.tsx` - Score meters and progress indicators

## MVP Features Implementation

### Stage 1 - Foundation (Simplified)
- 6 startup ideas as cards
- Simple validation choices (3 options per idea)
- Foundation score calculation
- Educational tooltips

### Stage 2 - Build (Simplified)  
- Basic team member selection (3 roles: developer, designer, marketer)
- Simple feature selection from predefined list
- Brand color picker
- Development score calculation

### Stage 3 - Launch (Simplified)
- Marketing channel selection (3 channels)
- Budget allocation sliders
- Simulated engagement metrics
- Marketing score calculation

### Final Results
- Combined score display
- Simple business valuation
- Restart option

## Scoring System
- Foundation Score (0-100)
- Development Score (0-100) 
- Marketing Score (0-100)
- Overall Valuation = weighted average

## State Structure
```typescript
interface GameState {
  currentStage: number;
  scores: {
    foundation: number;
    development: number;
    marketing: number;
    overall: number;
  };
  choices: {
    selectedIdea?: number;
    validation: number[];
    teamMembers: string[];
    features: string[];
    brandColor: string;
    marketingChannels: string[];
    budgetAllocation: Record<string, number>;
  };
  completed: boolean;
}
```

This MVP focuses on the core game loop with 3 stages instead of 5 to ensure successful completion within the file limit.