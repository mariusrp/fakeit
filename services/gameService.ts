import { ref, set, onValue, off, update, get } from "firebase/database";
import { database } from "../config/firebase";
import { GameData, Player, Answer } from "../types";
import { questions, correctAnswers } from "../constants/gameData";

export class GameService {
  private static instance: GameService;
  private listeners: Map<string, () => void> = new Map();

  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  generateGameCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async createGame(
    gameCode: string,
    hostName: string,
    hostEmoji: string,
    maxGuesses: number
  ): Promise<void> {
    const gameRef = ref(database, `games/${gameCode}`);

    const gameData: GameData = {
      host: hostName,
      phase: "lobby",
      players: {
        [hostName]: { name: hostName, emoji: hostEmoji, score: 0 },
      },
      round: 1,
      created: Date.now(),
      maxGuesses,
    };

    await set(gameRef, gameData);
  }

  async joinGame(
    gameCode: string,
    playerName: string,
    playerEmoji: string
  ): Promise<boolean> {
    try {
      const gameRef = ref(database, `games/${gameCode}`);
      const snapshot = await get(gameRef);

      if (!snapshot.exists()) {
        throw new Error("Game not found");
      }

      const playerRef = ref(
        database,
        `games/${gameCode}/players/${playerName}`
      );
      const playerData: Player = {
        name: playerName,
        emoji: playerEmoji,
        score: 0,
      };

      await set(playerRef, playerData);
      return true;
    } catch (error) {
      console.error("Error joining game:", error);
      return false;
    }
  }

  subscribeToGame(
    gameCode: string,
    callback: (gameData: GameData | null) => void
  ): () => void {
    const gameRef = ref(database, `games/${gameCode}`);

    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });

    const listenerId = `game_${gameCode}_${Date.now()}`;
    this.listeners.set(listenerId, () => off(gameRef, "value", unsubscribe));

    return () => {
      const listener = this.listeners.get(listenerId);
      if (listener) {
        listener();
        this.listeners.delete(listenerId);
      }
    };
  }

  async updateGamePhase(
    gameCode: string,
    phase: string,
    additionalData?: any
  ): Promise<void> {
    const gameRef = ref(database, `games/${gameCode}`);
    const updateData = { phase, ...additionalData };
    await update(gameRef, updateData);
  }

  async startQuestionPreview(gameCode: string): Promise<void> {
    await this.updateGamePhase(gameCode, "questionPreview");
  }

  async startQuestion(gameCode: string, questionIndex: number): Promise<void> {
    const gameRef = ref(database, `games/${gameCode}`);
    await update(gameRef, {
      phase: "question",
      currentQuestion: questions[questionIndex],
      correctAnswer: correctAnswers[questionIndex],
      answers: {},
      votes: {},
      playerGuessCount: {},
    });
  }

  async submitAnswer(
    gameCode: string,
    playerName: string,
    answer: string,
    attemptNumber: number
  ): Promise<void> {
    const answerKey = `${playerName}_${attemptNumber}`;
    const answerRef = ref(database, `games/${gameCode}/answers/${answerKey}`);

    const answerData: Answer = {
      answer,
      player: playerName,
      attemptNumber,
    };

    await set(answerRef, answerData);

    // Update guess count
    const guessCountRef = ref(
      database,
      `games/${gameCode}/playerGuessCount/${playerName}`
    );
    await set(guessCountRef, attemptNumber);
  }

  async submitVote(
    gameCode: string,
    playerName: string,
    votedAnswer: string
  ): Promise<void> {
    const voteRef = ref(database, `games/${gameCode}/votes/${playerName}`);
    await set(voteRef, votedAnswer);
  }

  async calculateAndUpdateScores(
    gameCode: string,
    gameData: GameData
  ): Promise<void> {
    const newScores = { ...gameData.players };
    const votes = gameData.votes || {};
    const answers = gameData.answers || {};

    // Calculate scores
    Object.entries(votes).forEach(([voter, votedAnswer]) => {
      // Points for correct answer
      if (votedAnswer === gameData.correctAnswer) {
        newScores[voter].score += 2;
      }

      // Points for fooling others
      Object.entries(answers).forEach(([, answerData]) => {
        if (answerData.answer === votedAnswer && answerData.player !== voter) {
          newScores[answerData.player].score += 1;
        }
      });
    });

    const gameRef = ref(database, `games/${gameCode}`);
    await update(gameRef, { players: newScores });
  }

  async nextRound(gameCode: string, currentRound: number): Promise<void> {
    const gameRef = ref(database, `games/${gameCode}`);
    await update(gameRef, {
      round: currentRound + 1,
      phase: "questionPreview",
    });
  }

  getRandomQuestionIndex(): number {
    return Math.floor(Math.random() * questions.length);
  }

  getPlayersWhoAnswered(answers: { [answerKey: string]: Answer }): string[] {
    const players = new Set<string>();
    Object.values(answers).forEach((answerData) => {
      players.add(answerData.player);
    });
    return Array.from(players);
  }

  getUniqueAnswers(answers: { [answerKey: string]: Answer }): Answer[] {
    const uniqueAnswers: Answer[] = [];
    const seenAnswers = new Set<string>();

    Object.values(answers).forEach((answerData) => {
      const answerText = answerData.answer.toLowerCase().trim();
      if (!seenAnswers.has(answerText)) {
        seenAnswers.add(answerText);
        uniqueAnswers.push(answerData);
      }
    });

    return uniqueAnswers;
  }

  getPlayersForAnswer(
    targetAnswer: string,
    answers: { [answerKey: string]: Answer }
  ): string[] {
    return Object.values(answers)
      .filter(
        (answerData) =>
          answerData.answer.toLowerCase().trim() ===
          targetAnswer.toLowerCase().trim()
      )
      .map((answerData) => answerData.player);
  }

  getVotersForAnswer(
    answer: string,
    votes: { [playerName: string]: string }
  ): string[] {
    return Object.entries(votes || {})
      .filter(([, vote]) => vote === answer)
      .map(([voter]) => voter);
  }

  cleanup(): void {
    // Clean up all listeners
    this.listeners.forEach((cleanup) => cleanup());
    this.listeners.clear();
  }
}
