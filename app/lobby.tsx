import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../components/ui/Button";
import { useGame } from "../hooks/useGame";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

const LobbyScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    gameCode,
    gameData,
    isHost,
    startRound,
    canStartGame,
    leaveGame,
    gameState,
  } = useGame();
  const players = gameData?.players
    ? Object.values(gameData.players as any)
    : [];

  // Naviger tilbake til menu når gameState endres til "menu"
  useEffect(() => {
    if (gameState === "menu") {
      navigation.navigate("Menu" as never);
    }
  }, [gameState, navigation]);

  const getDifficultyInfo = () => {
    const maxGuesses = gameData?.maxGuesses ?? 3;
    if (maxGuesses <= 2)
      return { text: "Vanskelig", emoji: "🔥", color: colors.error.text };
    if (maxGuesses === 3)
      return { text: "Middels", emoji: "⚖️", color: colors.warning.text };
    return { text: "Lett", emoji: "😊", color: colors.success.text };
  };

  const difficulty = getDifficultyInfo();

  return (
    <LinearGradient colors={colors.gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with game code and leave button */}
        <View style={styles.header}>
          <View style={styles.gameCodeContainer}>
            <Text style={styles.gameCodeLabel}>Spillkode</Text>
            <Text style={styles.gameCode}>{gameCode}</Text>
          </View>

          <TouchableOpacity
            style={styles.leaveButton}
            onPress={leaveGame}
            activeOpacity={0.8}
          >
            <Text style={styles.leaveButtonText}>← Forlat</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentCard}>
            <Text style={styles.title}>Spillrom</Text>

            {/* Difficulty indicator */}
            <View style={styles.difficultyContainer}>
              <View
                style={[
                  styles.difficultyBadge,
                  { borderColor: difficulty.color },
                ]}
              >
                <Text style={styles.difficultyEmoji}>{difficulty.emoji}</Text>
                <Text
                  style={[styles.difficultyText, { color: difficulty.color }]}
                >
                  {difficulty.text}
                </Text>
              </View>
              <Text style={styles.difficultySubtext}>
                Maks {gameData?.maxGuesses ?? 3} gjett per spørsmål
              </Text>
            </View>

            {/* Players section */}
            <View style={styles.playersSection}>
              <Text style={styles.playersTitle}>
                Spillere ({players.length})
              </Text>

              <View style={styles.playersList}>
                {players.map((player: any, index: number) => {
                  const isHost = player.name === gameData?.host;
                  return (
                    <View
                      key={player.name}
                      style={[
                        styles.playerItem,
                        isHost && styles.hostPlayerItem,
                      ]}
                    >
                      <View style={styles.playerInfo}>
                        <View
                          style={[styles.avatar, isHost && styles.hostAvatar]}
                        >
                          <Text style={styles.avatarText}>
                            {player?.emoji ||
                              String(player?.name ?? "?").charAt(0)}
                          </Text>
                        </View>
                        <View style={styles.playerDetails}>
                          <Text style={styles.playerName}>{player.name}</Text>
                          {isHost && <Text style={styles.hostLabel}>Vert</Text>}
                        </View>
                      </View>

                      {/* Player join order indicator */}
                      <View style={styles.joinOrder}>
                        <Text style={styles.joinOrderText}>#{index + 1}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Action section */}
            <View style={styles.actionSection}>
              {isHost ? (
                <View style={styles.hostActions}>
                  <Button
                    title={
                      canStartGame()
                        ? `Start spill (${players.length} spillere)`
                        : "Trenger minst 2 spillere"
                    }
                    onPress={startRound}
                    disabled={!canStartGame()}
                    variant={canStartGame() ? "primary" : "secondary"}
                    style={styles.startButton}
                  />

                  {!canStartGame() && (
                    <Text style={styles.waitingText}>
                      Inviter venner med spillkoden over
                    </Text>
                  )}
                </View>
              ) : (
                <View style={styles.waitingContainer}>
                  <View style={styles.waitingIndicator}>
                    <Text style={styles.waitingTitle}>Venter på start</Text>
                    <View style={styles.loadingDots}>
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                    </View>
                  </View>
                  <Text style={styles.waitingText}>
                    Verten starter spillet når alle er klare...
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  gameCodeContainer: {
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
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
  leaveButton: {
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  leaveButtonText: {
    fontSize: typography.sizes.base,
    color: colors.error.text,
    fontWeight: typography.weights.medium,
  },

  scrollView: { flex: 1 },
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
    marginBottom: spacing[6],
  },

  // Difficulty section
  difficultyContainer: {
    alignItems: "center",
    marginBottom: spacing[6],
  },
  difficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.input,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    marginBottom: spacing[2],
  },
  difficultyEmoji: {
    fontSize: typography.sizes.lg,
    marginRight: spacing[2],
  },
  difficultyText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  difficultySubtext: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
  },

  // Players section
  playersSection: { marginBottom: spacing[6] },
  playersTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing[4],
    textAlign: "center",
  },
  playersList: { gap: spacing[3] },
  playerItem: {
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.primary,
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.base,
  },
  hostPlayerItem: {
    backgroundColor: colors.info.light,
    borderColor: colors.info.border,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.tertiary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing[3],
    borderWidth: 2,
    borderColor: colors.border.primary,
  },
  hostAvatar: {
    backgroundColor: colors.info.light,
    borderColor: colors.info.border,
  },
  avatarText: {
    fontSize: 20,
    color: colors.text.primary,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  hostLabel: {
    fontSize: typography.sizes.sm,
    color: colors.info.text,
    fontWeight: typography.weights.medium,
    marginTop: spacing[1],
  },
  joinOrder: {
    backgroundColor: colors.background.tertiary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  joinOrderText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },

  // Action section
  actionSection: {
    alignItems: "center",
  },
  hostActions: {
    width: "100%",
    alignItems: "center",
  },
  startButton: {
    marginBottom: spacing[3],
  },
  waitingContainer: {
    alignItems: "center",
    paddingVertical: spacing[4],
  },
  waitingIndicator: {
    alignItems: "center",
    marginBottom: spacing[3],
  },
  waitingTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  loadingDots: {
    flexDirection: "row",
    gap: spacing[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.interactive.primary,
  },
  waitingText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default LobbyScreen;
