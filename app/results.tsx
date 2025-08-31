import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { GameCodeDisplay } from "../components/game/GameCodeDisplay";
import { useGame } from "../hooks/useGame";
import { GameService } from "../services/gameService";
import { colors, typography, spacing, borderRadius } from "../theme";

// Define a unified type for all answers
interface AnswerItem {
  answer: string;
  isCorrect?: boolean;
  player?: string;
  attemptNumber?: number;
}

const ResultsScreen: React.FC = () => {
  const {
    gameCode,
    gameData,
    playerName,
    isHost,
    proceedToManualScoring,
    proceedToRankings,
  } = useGame();

  const gameService = GameService.getInstance();

  const answers = gameData?.answers ? Object.values(gameData.answers) : [];
  const uniqueAnswers = gameService.getUniqueAnswers(gameData?.answers || {});

  // Convert to unified type
  const playerAnswers: AnswerItem[] = uniqueAnswers.map((answer) => ({
    answer: answer.answer,
    player: answer.player,
    attemptNumber: answer.attemptNumber,
    isCorrect: false,
  }));

  const correctAnswer: AnswerItem = {
    answer: gameData?.correctAnswer || "",
    isCorrect: true,
  };

  const allAnswers = [...playerAnswers, correctAnswer].sort(
    () => Math.random() - 0.5
  );
  const myVote = gameData?.votes?.[playerName];
  const votes = gameData?.votes || {};

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

            <Text style={styles.title}>Resultater</Text>
            <Text style={styles.questionText}>{gameData?.currentQuestion}</Text>

            <View style={styles.resultsList}>
              {allAnswers.map((answerItem, i) => {
                const voters = gameService.getVotersForAnswer(
                  answerItem.answer,
                  votes
                );
                const isCorrect = answerItem.isCorrect || false;
                const wasMyVote = myVote === answerItem.answer;
                const allPlayersWhoAnswered = isCorrect
                  ? []
                  : gameService.getPlayersForAnswer(
                      answerItem.answer,
                      gameData?.answers || {}
                    );

                return (
                  <View
                    key={i}
                    style={[
                      styles.resultItem,
                      isCorrect ? styles.correctAnswer : styles.wrongAnswer,
                      wasMyVote && styles.myVote,
                    ]}
                  >
                    <View style={styles.resultContent}>
                      <View style={styles.resultMain}>
                        <Text style={styles.resultAnswer}>
                          {answerItem.answer}
                        </Text>
                        <Text style={styles.resultAuthor}>
                          {isCorrect
                            ? "Riktig svar"
                            : allPlayersWhoAnswered.length > 1
                            ? `av ${allPlayersWhoAnswered.join(", ")}`
                            : `av ${answerItem.player || "Ukjent"}`}
                        </Text>
                      </View>
                      {voters.length > 0 && (
                        <View style={styles.resultVoters}>
                          <Text style={styles.votersText}>
                            Stemt av: {voters.join(", ")}
                          </Text>
                        </View>
                      )}
                    </View>
                    {wasMyVote && (
                      <View style={styles.voteIndicator}>
                        <Text style={styles.voteIndicatorText}>
                          {isCorrect
                            ? "Du hadde rett! +2 poeng"
                            : "Du ble lurt av dette luresvaret"}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {isHost ? (
              <View style={styles.hostActions}>
                <Button
                  title="Gi ekstra poeng"
                  onPress={proceedToManualScoring}
                  variant="warning"
                  style={styles.actionButton}
                />
                <Button
                  title="Vis Poengtavle"
                  onPress={proceedToRankings}
                  variant="success"
                  style={styles.actionButton}
                />
              </View>
            ) : (
              <View style={styles.waitingContainer}>
                <Text style={styles.waitingText}>
                  Venter på at verten fortsetter...
                </Text>
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
  title: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes["3xl"],
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing[4],
  },
  questionText: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing[6],
    padding: spacing[4],
    backgroundColor: colors.background.input,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  resultsList: {
    marginBottom: spacing[6],
    gap: spacing[3],
  },
  resultItem: {
    padding: spacing[5],
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  correctAnswer: {
    backgroundColor: colors.success.light,
    borderColor: colors.success.border,
  },
  wrongAnswer: {
    backgroundColor: colors.error.light,
    borderColor: colors.error.border,
  },
  myVote: {
    borderColor: colors.text.primary,
    borderWidth: 2,
  },
  resultContent: {
    gap: spacing[2],
  },
  resultMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  resultAnswer: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing[3],
  },
  resultAuthor: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontStyle: "italic",
  },
  resultVoters: {
    marginTop: spacing[1],
  },
  votersText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.xs,
    color: colors.text.tertiary,
    fontStyle: "italic",
  },
  voteIndicator: {
    marginTop: spacing[3],
    padding: spacing[2],
    backgroundColor: colors.background.input,
    borderRadius: borderRadius.sm,
  },
  voteIndicatorText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
  },
  hostActions: {
    flexDirection: "row",
    gap: spacing[4],
  },
  actionButton: {
    flex: 1,
  },
  waitingContainer: {
    alignItems: "center",
    paddingVertical: spacing[4],
  },
  waitingText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
  },
});

export default ResultsScreen;
