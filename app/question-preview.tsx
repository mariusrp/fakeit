import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { GameCodeDisplay } from "../components/game/GameCodeDisplay";
import { useGame } from "../hooks/useGame";
import { colors, typography, spacing, borderRadius } from "../theme";
import { questions, correctAnswers } from "../constants/gameData";

const QuestionPreviewScreen: React.FC = () => {
  const {
    gameCode,
    gameData,
    isHost,
    previewIndex,
    skipQuestion,
    confirmQuestion,
  } = useGame();

  if (!isHost) {
    return (
      <LinearGradient
        colors={colors.gradients.primary}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <Card style={styles.card} gradient>
            <GameCodeDisplay gameCode={gameCode} variant="floating" />
            <Text style={styles.title}>Forbereder spørsmål</Text>
            <Text style={styles.waitingText}>
              Verten velger spørsmål for denne runden...
            </Text>
          </Card>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentQuestion = previewIndex !== null ? questions[previewIndex] : "";
  const currentAnswer =
    previewIndex !== null ? correctAnswers[previewIndex] : "";

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

            <Text style={styles.title}>Forhåndsvisning av spørsmål</Text>
            <Text style={styles.roundNumber}>Runde {gameData?.round}</Text>

            <View style={styles.questionPreview}>
              <View style={styles.previewQuestion}>
                <Text style={styles.questionText}>{currentQuestion}</Text>
              </View>

              <View style={styles.previewAnswer}>
                <Text style={styles.answerLabel}>Riktig svar:</Text>
                <Text style={styles.correctAnswerPreview}>{currentAnswer}</Text>
              </View>
            </View>

            <View style={styles.previewActions}>
              <Button
                title="Hopp over dette spørsmålet"
                onPress={skipQuestion}
                variant="warning"
                style={styles.actionButton}
              />
              <Button
                title="Bruk dette spørsmålet"
                onPress={confirmQuestion}
                variant="success"
                style={styles.actionButton}
              />
            </View>

            <Text style={styles.previewInstruction}>
              Velg om du vil bruke dette spørsmålet eller hoppe over til et
              nytt.
            </Text>
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
  card: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
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
  roundNumber: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.1,
    textAlign: "center",
    marginBottom: spacing[6],
  },
  questionPreview: {
    marginBottom: spacing[6],
  },
  previewQuestion: {
    marginBottom: spacing[6],
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
  previewAnswer: {
    alignItems: "center",
  },
  answerLabel: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.1,
    marginBottom: spacing[2],
  },
  correctAnswerPreview: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.success.text,
  },
  previewActions: {
    flexDirection: "row",
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  actionButton: {
    flex: 1,
  },
  previewInstruction: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  waitingText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
  },
});

export default QuestionPreviewScreen;
