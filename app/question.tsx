import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { GameCodeDisplay } from "../components/game/GameCodeDisplay";
import { ProgressIndicator } from "../components/game/ProgressIndicator";
import { useGame } from "../hooks/useGame";
import { colors, typography, spacing, borderRadius } from "../theme";

const QuestionScreen: React.FC = () => {
  const {
    gameCode,
    gameData,
    playerName,
    playerAnswer,
    setPlayerAnswer,
    hasAnswered,
    isHost,
    submitAnswer,
    proceedToVoting,
    getPlayersWhoAnswered,
  } = useGame();

  const answeredCount = gameData?.answers ? getPlayersWhoAnswered().length : 0;
  const totalPlayers = gameData?.players
    ? Object.keys(gameData.players).length
    : 0;
  const allAnswered = answeredCount === totalPlayers;
  const playerGuesses = gameData?.playerGuessCount?.[playerName] || 0;
  const remainingGuesses = (gameData?.maxGuesses || 3) - playerGuesses;

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

            <View style={styles.questionHeader}>
              <Text style={styles.roundNumber}>Runde {gameData?.round}</Text>
              <Text style={styles.questionText}>
                {gameData?.currentQuestion}
              </Text>
            </View>

            <ProgressIndicator
              currentPhase={gameData?.phase || "question"}
              players={gameData?.players || {}}
              answers={gameData?.answers}
              votes={gameData?.votes}
            />

            {!hasAnswered ? (
              <>
                <View style={styles.guessCounter}>
                  <Text style={styles.guessText}>
                    Gjenstående forsøk: {remainingGuesses} av{" "}
                    {gameData?.maxGuesses || 3}
                  </Text>
                </View>

                <View style={styles.answerSection}>
                  <Text style={styles.instructionText}>
                    Lag overbevisende luresvar som kan lure andre spillere
                    {(gameData?.maxGuesses || 3) > 1 && (
                      <Text style={styles.multipleAnswersHint}>
                        {" "}
                        (Du kan lage {gameData?.maxGuesses || 3} forskjellige
                        svar!)
                      </Text>
                    )}
                  </Text>

                  <Input
                    placeholder="Skriv ditt luresvar her..."
                    value={playerAnswer}
                    onChangeText={setPlayerAnswer}
                    containerStyle={styles.inputContainer}
                  />
                </View>

                <Button
                  title={
                    remainingGuesses > 0
                      ? "Send Inn Svar"
                      : "Ingen forsøk igjen"
                  }
                  onPress={submitAnswer}
                  disabled={remainingGuesses <= 0}
                  variant="warning"
                />
              </>
            ) : (
              <View style={styles.statusDisplay}>
                <Text style={styles.statusTitle}>Svar Sendt Inn</Text>
                <Text style={styles.statusText}>
                  Venter på at andre spillere sender inn sine svar...
                </Text>
                {isHost && allAnswered && (
                  <Button
                    title="Start Stemmefase"
                    onPress={proceedToVoting}
                    variant="success"
                    style={styles.hostButton}
                  />
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
  questionHeader: {
    textAlign: "center",
    marginBottom: spacing[6],
  },
  roundNumber: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.1,
    textAlign: "center",
    marginBottom: spacing[3],
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
  },
  guessCounter: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.background.cardBorder,
    padding: spacing[4],
    borderRadius: borderRadius.md,
    marginBottom: spacing[4],
    alignItems: "center",
  },
  guessText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  answerSection: {
    marginBottom: spacing[6],
  },
  instructionText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginBottom: spacing[4],
    textAlign: "center",
  },
  multipleAnswersHint: {
    color: colors.info.text,
    fontStyle: "italic",
  },
  inputContainer: {
    marginBottom: 0,
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
    marginBottom: spacing[4],
  },
  hostButton: {
    marginTop: spacing[4],
  },
});

export default QuestionScreen;
