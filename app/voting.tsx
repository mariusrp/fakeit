import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { GameCodeDisplay } from "../components/game/GameCodeDisplay";
import { ProgressIndicator } from "../components/game/ProgressIndicator";
import { useGame } from "../hooks/useGame";
import { GameService } from "../services/gameService";
import { colors, typography, spacing, borderRadius } from "../theme";

const VotingScreen: React.FC = () => {
  const {
    gameCode,
    gameData,
    selectedAnswer,
    setSelectedAnswer,
    hasVoted,
    isHost,
    submitVote,
    proceedToResults,
  } = useGame();

  const gameService = GameService.getInstance();

  const answers = gameData?.answers ? Object.values(gameData.answers) : [];
  const uniqueAnswers = gameService.getUniqueAnswers(gameData?.answers || {});
  const correctAnswer = {
    answer: gameData?.correctAnswer || "",
    isCorrect: true,
  };
  const allAnswers = [...uniqueAnswers, correctAnswer].sort(
    () => Math.random() - 0.5
  );

  const totalPlayers = gameData?.players
    ? Object.keys(gameData.players).length
    : 0;
  const votedPlayers = gameData?.votes ? Object.keys(gameData.votes).length : 0;
  const allVoted = totalPlayers > 0 && votedPlayers === totalPlayers;

  return (
    <LinearGradient colors={colors.gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.wideCard} gradient>
            <GameCodeDisplay gameCode={gameCode} variant="floating" />

            <Text style={styles.questionText}>{gameData?.currentQuestion}</Text>
            <Text style={styles.instructionText}>
              Velg svaret du tror er riktig
            </Text>

            <ProgressIndicator
              currentPhase={gameData?.phase || "voting"}
              players={gameData?.players || {}}
              answers={gameData?.answers}
              votes={gameData?.votes}
            />

            {!hasVoted ? (
              <>
                <View style={styles.answersGrid}>
                  {allAnswers.map((answer, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.answerOption,
                        selectedAnswer === answer.answer &&
                          styles.selectedAnswer,
                      ]}
                      onPress={() => setSelectedAnswer(answer.answer)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.answerText,
                          selectedAnswer === answer.answer &&
                            styles.selectedAnswerText,
                        ]}
                      >
                        {answer.answer}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Button
                  title="Stem"
                  onPress={submitVote}
                  disabled={!selectedAnswer}
                  variant={selectedAnswer ? "success" : "secondary"}
                />
              </>
            ) : (
              <View style={styles.statusDisplay}>
                <Text style={styles.statusTitle}>Stemme Avgitt</Text>
                <Text style={styles.statusText}>
                  Venter på at andre spillere stemmer...
                </Text>
                {isHost && allVoted && (
                  <>
                    <Text style={styles.statusText}>Alle har stemt!</Text>
                    <Button
                      title="Vis Resultater"
                      onPress={proceedToResults}
                      variant="success"
                      style={styles.hostButton}
                    />
                  </>
                )}
              </View>
            )}
          </Card>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[8],
  },
  wideCard: {
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  questionText: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: typography.sizes["2xl"] * 1.4,
    padding: spacing[6],
    backgroundColor: colors.background.input,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginBottom: spacing[4],
  },
  instructionText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginBottom: spacing[6],
    textAlign: "center",
  },
  answersGrid: {
    marginBottom: spacing[6],
    gap: spacing[3],
  },
  answerOption: {
    width: "100%",
    padding: spacing[5],
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.card,
    alignItems: "center",
  },
  selectedAnswer: {
    backgroundColor: colors.interactive.selected,
    borderColor: colors.interactive.selected,
    transform: [{ scale: 1.02 }],
  },
  answerText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    color: colors.text.primary,
    textAlign: "center",
  },
  selectedAnswerText: {
    color: colors.text.inverse,
    fontWeight: typography.weights.medium,
  },
  statusDisplay: {
    alignItems: "center",
    paddingVertical: spacing[6],
  },
  statusTitle: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  statusText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing[2],
  },
  hostButton: {
    marginTop: spacing[4],
  },
});

export default VotingScreen;
