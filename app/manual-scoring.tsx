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
import { useGame } from "../hooks/useGame";
import { GameService } from "../services/gameService";
import { colors, typography, spacing, borderRadius } from "../theme";

const ManualScoringScreen: React.FC = () => {
  const { gameCode, gameData, isHost, proceedToRankings } = useGame();

  const gameService = GameService.getInstance();
  const players = gameData?.players ? Object.values(gameData.players) : [];
  const answers = gameData?.answers ? Object.values(gameData.answers) : [];
  const uniqueAnswers = gameService.getUniqueAnswers(gameData?.answers || {});

  const awardPointsToPlayer = async (playerName: string, points: number) => {
    if (!isHost || !gameData) return;

    try {
      // This would be implemented in the useGame hook
      // For now, we'll just show the UI
      console.log(`Award ${points} points to ${playerName}`);
    } catch (error) {
      console.error("Error awarding points:", error);
    }
  };

  if (!isHost) {
    return (
      <LinearGradient
        colors={colors.gradients.primary}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <Card style={styles.card} gradient>
            <GameCodeDisplay gameCode={gameCode} variant="floating" />
            <Text style={styles.title}>Venter på poengfordeling</Text>
            <Text style={styles.waitingText}>
              Verten gir ut ekstra poeng...
            </Text>
          </Card>
        </SafeAreaView>
      </LinearGradient>
    );
  }

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

            <Text style={styles.title}>Gi ekstra poeng</Text>
            <Text style={styles.instructionText}>
              Klikk på svarene du mener var riktige for å gi poeng til spillerne
            </Text>

            <View style={styles.manualScoringSection}>
              <Text style={styles.sectionTitle}>Spillernes svar:</Text>

              <View style={styles.answersList}>
                {uniqueAnswers.map((answer, i) => {
                  const allPlayersWhoAnswered = gameService.getPlayersForAnswer(
                    answer.answer,
                    gameData?.answers || {}
                  );

                  return (
                    <View key={i} style={styles.answerItem}>
                      <View style={styles.answerContent}>
                        <Text style={styles.answerText}>{answer.answer}</Text>
                        <Text style={styles.answerPlayers}>
                          av {allPlayersWhoAnswered.join(", ")}
                        </Text>
                      </View>

                      <View style={styles.answerActions}>
                        {allPlayersWhoAnswered.map((playerName) => (
                          <TouchableOpacity
                            key={playerName}
                            style={styles.pointButton}
                            onPress={() => awardPointsToPlayer(playerName, 2)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.pointButtonText}>
                              Gi 2p til {playerName}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            <Button
              title="Ferdig - Vis poengtavle"
              onPress={proceedToRankings}
              variant="primary"
            />
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
  instructionText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing[6],
  },
  manualScoringSection: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing[4],
    textAlign: "center",
  },
  answersList: {
    gap: spacing[4],
  },
  answerItem: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.background.cardBorder,
    padding: spacing[4],
    borderRadius: borderRadius.md,
  },
  answerContent: {
    marginBottom: spacing[3],
  },
  answerText: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  answerPlayers: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontStyle: "italic",
  },
  answerActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  pointButton: {
    backgroundColor: colors.success.light,
    borderWidth: 1,
    borderColor: colors.success.border,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.sm,
  },
  pointButtonText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.success.text,
  },
  waitingText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
  },
});

export default ManualScoringScreen;
