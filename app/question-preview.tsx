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
import { useGame } from "../hooks/useGame";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import { questions } from "../constants/gameData";

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
          <View style={styles.centerContainer}>
            <View style={styles.waitingCard}>
              <View style={styles.gameCodeContainer}>
                <Text style={styles.gameCodeLabel}>Spillkode</Text>
                <Text style={styles.gameCode}>{gameCode}</Text>
              </View>

              <View style={styles.waitingContent}>
                <Text style={styles.waitingTitle}>Forbereder spørsmål</Text>
                <View style={styles.loadingDots}>
                  <Text style={styles.dot}>●</Text>
                  <Text style={styles.dot}>●</Text>
                  <Text style={styles.dot}>●</Text>
                </View>
                <Text style={styles.waitingText}>
                  Verten velger spørsmål for denne runden...
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentQuestion = previewIndex !== null ? questions[previewIndex] : "";

  return (
    <LinearGradient colors={colors.gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.gameCodeContainer}>
            <Text style={styles.gameCodeLabel}>Spillkode</Text>
            <Text style={styles.gameCode}>{gameCode}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentCard}>
            <Text style={styles.title}>Forhåndsvisning</Text>
            <Text style={styles.roundNumber}>Runde {gameData?.round}</Text>

            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{currentQuestion}</Text>
            </View>

            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                ⚠️ Du ser ikke det riktige svaret for å holde spillet rettferdig
              </Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={skipQuestion}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.warning.solid, colors.warning.text]}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.skipButtonText}>🔄 Hopp over</Text>
                  <Text style={styles.buttonSubtext}>Få nytt spørsmål</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmQuestion}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.success.solid, colors.success.text]}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.confirmButtonText}>✅ Bruk dette</Text>
                  <Text style={styles.buttonSubtext}>Start spørsmålet</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Velg om du vil bruke dette spørsmålet eller hoppe over til et
                nytt. Det riktige svaret vil være synlig for spillerne når de
                skal stemme.
              </Text>
            </View>
          </View>
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

  // Header styles
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  gameCodeContainer: {
    alignSelf: "center",
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.md,
  },
  gameCodeLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing[1],
  },
  gameCode: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    textAlign: "center",
    letterSpacing: 2,
  },

  // Waiting screen styles
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing[4],
  },
  waitingCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[8],
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.lg,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  waitingContent: {
    alignItems: "center",
    marginTop: spacing[6],
  },
  waitingTitle: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  loadingDots: {
    flexDirection: "row",
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  dot: {
    fontSize: typography.sizes.lg,
    color: colors.interactive.primary,
  },
  waitingText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },

  // Content styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  contentCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.lg,
  },
  title: {
    fontSize: typography.sizes["3xl"],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing[2],
  },
  roundNumber: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing[6],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Question styles
  questionContainer: {
    backgroundColor: colors.background.input,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.base,
  },
  questionText: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: typography.sizes["2xl"] * 1.4,
  },

  // Warning styles
  warningContainer: {
    backgroundColor: colors.warning.light,
    borderWidth: 1,
    borderColor: colors.warning.border,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[6],
  },
  warningText: {
    fontSize: typography.sizes.base,
    color: colors.warning.text,
    textAlign: "center",
    fontWeight: typography.weights.medium,
  },

  // Action buttons
  actionButtons: {
    flexDirection: "row",
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  skipButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  confirmButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  buttonGradient: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
    alignItems: "center",
    justifyContent: "center",
    minHeight: 72,
  },
  skipButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.inverse,
    marginBottom: spacing[1],
  },
  confirmButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.inverse,
    marginBottom: spacing[1],
  },
  buttonSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.text.inverse,
    opacity: 0.9,
  },

  // Instruction styles
  instructionContainer: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  instructionText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    fontStyle: "italic",
  },
});

export default QuestionPreviewScreen;
