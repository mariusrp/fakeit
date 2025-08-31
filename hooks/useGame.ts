import { useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useGameStore } from "../stores/gameStore";
import { GameService } from "../services/gameService";
import { GameData } from "../types";
import { MIN_PLAYERS, questions } from "../constants/gameData";

export const useGame = () => {
  const store = useGameStore();
  const gameService = GameService.getInstance();

  // Subscribe to game updates
  useEffect(() => {
    if (!store.gameCode) return;

    const unsubscribe = gameService.subscribeToGame(
      store.gameCode,
      (gameData: GameData | null) => {
        store.setGameData(gameData);
      }
    );

    return unsubscribe;
  }, [store.gameCode, store.setGameData]);

  // Reset player states when new round starts
  useEffect(() => {
    if (store.gameData?.phase === "question") {
      store.resetPlayerStates();
    }
  }, [
    store.gameData?.phase,
    store.gameData?.currentQuestion,
    store.resetPlayerStates,
  ]);

  // Auto-advance to voting when all players have answered
  useEffect(() => {
    if (!store.isHost || !store.gameData || store.gameData.phase !== "question")
      return;

    const totalPlayers = Object.keys(store.gameData.players || {}).length;
    const playersWhoAnswered = store.gameData.answers
      ? gameService.getPlayersWhoAnswered(store.gameData.answers)
      : [];

    if (totalPlayers > 0 && playersWhoAnswered.length === totalPlayers) {
      setTimeout(async () => {
        await gameService.updateGamePhase(store.gameCode, "voting");
      }, 1000);
    }
  }, [
    store.gameData?.answers,
    store.gameData?.players,
    store.gameData?.phase,
    store.isHost,
    store.gameCode,
  ]);

  const createGame = useCallback(async () => {
    if (!store.playerName.trim()) {
      Alert.alert("Feil", "Skriv inn navnet ditt først");
      return;
    }
    if (!store.selectedEmoji) {
      Alert.alert("Feil", "Velg en emoji først");
      return;
    }

    try {
      const code = gameService.generateGameCode();
      await gameService.createGame(
        code,
        store.playerName,
        store.selectedEmoji,
        store.maxGuesses
      );

      store.setGameCode(code);
      store.setIsHost(true);
      store.setGameState("lobby");
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke opprette spill");
      console.error("Error creating game:", error);
    }
  }, [store, gameService]);

  const joinGame = useCallback(async () => {
    if (!store.playerName.trim() || !store.joinCode.trim()) {
      Alert.alert("Feil", "Skriv inn navn og spillkode");
      return;
    }
    if (!store.selectedEmoji) {
      Alert.alert("Feil", "Velg en emoji først");
      return;
    }

    try {
      const success = await gameService.joinGame(
        store.joinCode,
        store.playerName,
        store.selectedEmoji
      );

      if (success) {
        store.setGameCode(store.joinCode);
        store.setIsHost(false);
        store.setGameState("lobby");
      } else {
        Alert.alert("Feil", "Spill ikke funnet! Sjekk spillkoden.");
      }
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke joine spillet. Sjekk spillkoden!");
      console.error("Error joining game:", error);
    }
  }, [store, gameService]);

  const startRound = useCallback(async () => {
    if (!store.isHost) return;

    try {
      const questionIndex = gameService.getRandomQuestionIndex();
      store.setPreviewIndex(questionIndex);
      store.setPreviewQuestion(questions[questionIndex]);
      await gameService.startQuestionPreview(store.gameCode);
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke starte runden");
      console.error("Error starting round:", error);
    }
  }, [store, gameService]);

  const skipQuestion = useCallback(() => {
    const newQuestionIndex = gameService.getRandomQuestionIndex();
    store.setPreviewIndex(newQuestionIndex);
    store.setPreviewQuestion(questions[newQuestionIndex]);
  }, [store, gameService]);

  const confirmQuestion = useCallback(async () => {
    if (!store.isHost || store.previewIndex === null) return;

    try {
      await gameService.startQuestion(store.gameCode, store.previewIndex);
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke starte spørsmålet");
      console.error("Error confirming question:", error);
    }
  }, [store, gameService]);

  const submitAnswer = useCallback(async () => {
    if (!store.playerAnswer.trim()) {
      Alert.alert("Feil", "Skriv inn et svar");
      return;
    }

    if (
      store.gameData?.correctAnswer &&
      store.playerAnswer.toLowerCase().trim() ===
        store.gameData.correctAnswer.toLowerCase()
    ) {
      Alert.alert(
        "Obs!",
        "Det er det riktige svaret! Prøv å lage et luresvar i stedet."
      );
      return;
    }

    // Check if player has reached max guesses
    const playerGuesses =
      store.gameData?.playerGuessCount?.[store.playerName] || 0;
    if (playerGuesses >= (store.gameData?.maxGuesses || 3)) {
      Alert.alert(
        "Feil",
        `Du har brukt opp alle dine ${store.gameData?.maxGuesses} forsøk!`
      );
      return;
    }

    try {
      const newGuessCount = playerGuesses + 1;
      await gameService.submitAnswer(
        store.gameCode,
        store.playerName,
        store.playerAnswer,
        newGuessCount
      );

      store.setCurrentGuessCount(newGuessCount);
      store.setPlayerAnswer("");

      // Set hasAnswered to true if this was the final guess
      if (newGuessCount >= (store.gameData?.maxGuesses || 3)) {
        store.setHasAnswered(true);
      }
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke sende inn svaret");
      console.error("Error submitting answer:", error);
    }
  }, [store, gameService]);

  const submitVote = useCallback(async () => {
    if (!store.selectedAnswer) {
      Alert.alert("Feil", "Velg et svar");
      return;
    }

    try {
      await gameService.submitVote(
        store.gameCode,
        store.playerName,
        store.selectedAnswer
      );
      store.setHasVoted(true);
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke sende inn stemme");
      console.error("Error submitting vote:", error);
    }
  }, [store, gameService]);

  const proceedToVoting = useCallback(async () => {
    if (!store.isHost) return;
    try {
      await gameService.updateGamePhase(store.gameCode, "voting");
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke gå til stemming");
    }
  }, [store, gameService]);

  const proceedToResults = useCallback(async () => {
    if (!store.isHost || !store.gameData) return;
    try {
      await gameService.calculateAndUpdateScores(
        store.gameCode,
        store.gameData
      );
      await gameService.updateGamePhase(store.gameCode, "results");
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke beregne resultater");
    }
  }, [store, gameService]);

  const proceedToManualScoring = useCallback(async () => {
    if (!store.isHost) return;
    try {
      await gameService.updateGamePhase(store.gameCode, "manualScoring");
      store.setShowManualScoring(true);
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke gå til manuell poenggiving");
    }
  }, [store, gameService]);

  const proceedToRankings = useCallback(async () => {
    if (!store.isHost) return;
    try {
      await gameService.updateGamePhase(store.gameCode, "rankings");
      store.setShowManualScoring(false);
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke gå til poengtavle");
    }
  }, [store, gameService]);

  const nextRound = useCallback(async () => {
    if (!store.isHost || !store.gameData) return;
    try {
      store.setPreviewQuestion(null);
      store.setPreviewIndex(null);
      await gameService.nextRound(store.gameCode, store.gameData.round);
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke starte neste runde");
    }
  }, [store, gameService]);

  const canStartGame = useCallback(() => {
    if (!store.gameData?.players) return false;
    return Object.keys(store.gameData.players).length >= MIN_PLAYERS;
  }, [store.gameData?.players]);

  const getPlayersWhoAnswered = useCallback(() => {
    if (!store.gameData?.answers) return [];
    return gameService.getPlayersWhoAnswered(store.gameData.answers);
  }, [store.gameData?.answers, gameService]);

  return {
    // State
    ...store,

    // Actions
    createGame,
    joinGame,
    startRound,
    skipQuestion,
    confirmQuestion,
    submitAnswer,
    submitVote,
    proceedToVoting,
    proceedToResults,
    proceedToManualScoring,
    proceedToRankings,
    nextRound,

    // Computed
    canStartGame,
    getPlayersWhoAnswered,
  };
};
