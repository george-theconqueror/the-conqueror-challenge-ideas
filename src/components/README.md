# Components Overview

This folder contains the main React components that make up the Would You Rather challenge ideas ranking application.

## GameLogic.tsx
The main game controller component that manages the entire application flow.

**Key Responsibilities:**
- Manages game state (started, loading, error states)
- Handles title queue integration via useQueueContext
- Controls question/answer flow with title pairs
- Processes user selections and updates Elo ratings
- Manages the transition between title pairs
- Handles automatic game start when queue is ready

**State Management:**
- `currentTitles`: Current pair of titles being displayed
- `selectedOption`: User's current selection (0 or 1)
- `gameStarted`: Whether the game has begun
- `showResults`: Whether to show selection results

## GameProgress.tsx
A progress tracking component that displays game progress information.

**Key Responsibilities:**
- Shows current question number vs total questions
- Displays progress bar with completion percentage
- Provides visual feedback on game advancement
- Shows questions answered vs total questions

**Props:**
- `currentQuestion`: Current question number
- `totalQuestions`: Total number of questions
- `questionsAnswered`: Number of questions completed

## GameRules.tsx
A dialog component that displays the game rules and instructions.

**Key Responsibilities:**
- Shows game rules in a modal dialog
- Explains how the ranking system works
- Provides context about The Conqueror Virtual Challenges
- Accessible via a floating help button

**Features:**
- Modal dialog with backdrop
- Responsive design
- Clear explanation of the Elo rating system

## QuestionCard.tsx
The main interactive component that displays the title pairs and handles user selections.

**Key Responsibilities:**
- Displays two title options side by side
- Handles user clicks and selection events
- Manages responsive layout (portrait/landscape)
- Controls visual feedback for selections
- Implements 70/30 ratio transition animation
- Prevents interaction during results display

**Props:**
- `title1`, `title2`: The two titles to compare
- `onSelect`: Callback for user selection
- `selectedOption`: Current user selection
- `showResults`: Whether to show selection results

**Features:**
- Responsive design that adapts to screen orientation
- Smooth transition animations
- Visual feedback for user selections
- Clean, intuitive interface

## useQueue.tsx (Hook)
A custom React hook that manages the title queue and API integration.

**Key Responsibilities:**
- Fetches random titles from the API
- Manages queue state and operations
- Handles automatic refilling when queue is low
- Provides queue operations (dequeue, peek, clear)
- Manages loading states and error handling

**Queue Operations:**
- `dequeue()`: Removes and returns first title
- `peek()`: Returns first two titles without removing
- `clearQueue()`: Empties the entire queue
- `fetchRandomTitles()`: Loads new titles from API

**State:**
- `queue`: Array of available titles
- `isLoading`: API fetch status
- `error`: Error state for failed requests

## Context Integration
The components work together through React Context:
- `QueueContext` provides queue state to all components
- `GameLogic` orchestrates the overall game flow
- `QuestionCard` handles user interactions
- All components share state through the context system

## Data Flow
1. `useQueue` fetches titles from API
2. `GameLogic` gets title pairs and manages game state
3. `QuestionCard` displays titles and captures user input
4. User selection triggers Elo rating update
5. Process repeats with next title pair
