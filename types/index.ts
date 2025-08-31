export interface Player {
  name: string;
  emoji: string;
  score: number;
}

export interface Answer {
  answer: string;
  player: string;
  attemptNumber: number;
}

export interface Vote {
  [playerName: string]: string;
}

export interface GameData {
  host: string;
  phase: GamePhase;
  players: { [playerName: string]: Player };
  round: number;
  created: number;
  maxGuesses: number;
  currentQuestion?: string;
  correctAnswer?: string;
  answers?: { [answerKey: string]: Answer };
  votes?: Vote;
  playerGuessCount?: { [playerName: string]: number };
}

export type GamePhase =
  | "lobby"
  | "questionPreview"
  | "question"
  | "voting"
  | "results"
  | "manualScoring"
  | "rankings";

export type GameState =
  | "menu"
  | "lobby"
  | "questionPreview"
  | "question"
  | "voting"
  | "results"
  | "manualScoring"
  | "rankings";

export interface GameStore {
  // State
  gameState: GameState;
  gameCode: string;
  playerName: string;
  selectedEmoji: string;
  gameData: GameData | null;
  playerAnswer: string;
  selectedAnswer: string;
  isHost: boolean;
  joinCode: string;
  hasAnswered: boolean;
  hasVoted: boolean;
  previewQuestion: string | null;
  previewIndex: number | null;
  maxGuesses: number;
  currentGuessCount: number;
  showManualScoring: boolean;

  // Actions
  setGameState: (state: GameState) => void;
  setGameCode: (code: string) => void;
  setPlayerName: (name: string) => void;
  setSelectedEmoji: (emoji: string) => void;
  setGameData: (data: GameData | null) => void;
  setPlayerAnswer: (answer: string) => void;
  setSelectedAnswer: (answer: string) => void;
  setIsHost: (isHost: boolean) => void;
  setJoinCode: (code: string) => void;
  setHasAnswered: (hasAnswered: boolean) => void;
  setHasVoted: (hasVoted: boolean) => void;
  setPreviewQuestion: (question: string | null) => void;
  setPreviewIndex: (index: number | null) => void;
  setMaxGuesses: (maxGuesses: number) => void;
  setCurrentGuessCount: (count: number) => void;
  setShowManualScoring: (show: boolean) => void;
  resetPlayerStates: () => void;
  resetGame: () => void;
}

export interface ProgressIndicatorProps {
  currentPhase: GamePhase;
  players: { [playerName: string]: Player };
  answers?: { [answerKey: string]: Answer };
  votes?: Vote;
}

export interface ResultItem {
  answer: string;
  isCorrect?: boolean;
  player?: string;
  voters: string[];
  allPlayersWhoAnswered: string[];
}
