import { create } from "zustand";
import { GameStore, GameState, GameData } from "../types";
import { DEFAULT_MAX_GUESSES } from "../constants/gameData";

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: "menu",
  gameCode: "",
  playerName: "",
  selectedEmoji: "",
  gameData: null,
  playerAnswer: "",
  selectedAnswer: "",
  isHost: false,
  joinCode: "",
  hasAnswered: false,
  hasVoted: false,
  previewQuestion: null,
  previewIndex: null,
  maxGuesses: DEFAULT_MAX_GUESSES,
  currentGuessCount: 0,
  showManualScoring: false,

  // Actions
  setGameState: (gameState: GameState) => set({ gameState }),
  setGameCode: (gameCode: string) => set({ gameCode }),
  setPlayerName: (playerName: string) => set({ playerName }),
  setSelectedEmoji: (selectedEmoji: string) => set({ selectedEmoji }),
  setGameData: (gameData: GameData | null) => {
    set({ gameData });

    // Auto-update game state based on server data
    if (gameData?.phase) {
      const phaseToStateMap: Record<string, GameState> = {
        lobby: "lobby",
        questionPreview: "questionPreview",
        question: "question",
        voting: "voting",
        results: "results",
        manualScoring: "manualScoring",
        rankings: "rankings",
      };

      const newGameState = phaseToStateMap[gameData.phase];
      if (newGameState) {
        set({ gameState: newGameState });
      }
    }
  },
  setPlayerAnswer: (playerAnswer: string) => set({ playerAnswer }),
  setSelectedAnswer: (selectedAnswer: string) => set({ selectedAnswer }),
  setIsHost: (isHost: boolean) => set({ isHost }),
  setJoinCode: (joinCode: string) => set({ joinCode }),
  setHasAnswered: (hasAnswered: boolean) => set({ hasAnswered }),
  setHasVoted: (hasVoted: boolean) => set({ hasVoted }),
  setPreviewQuestion: (previewQuestion: string | null) =>
    set({ previewQuestion }),
  setPreviewIndex: (previewIndex: number | null) => set({ previewIndex }),
  setMaxGuesses: (maxGuesses: number) => set({ maxGuesses }),
  setCurrentGuessCount: (currentGuessCount: number) =>
    set({ currentGuessCount }),
  setShowManualScoring: (showManualScoring: boolean) =>
    set({ showManualScoring }),

  resetPlayerStates: () =>
    set({
      hasAnswered: false,
      hasVoted: false,
      playerAnswer: "",
      selectedAnswer: "",
      currentGuessCount: 0,
    }),

  resetGame: () =>
    set({
      gameState: "menu",
      gameCode: "",
      playerName: "",
      selectedEmoji: "",
      gameData: null,
      playerAnswer: "",
      selectedAnswer: "",
      isHost: false,
      joinCode: "",
      hasAnswered: false,
      hasVoted: false,
      previewQuestion: null,
      previewIndex: null,
      maxGuesses: DEFAULT_MAX_GUESSES,
      currentGuessCount: 0,
      showManualScoring: false,
    }),
}));
