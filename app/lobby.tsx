import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { GameCodeDisplay } from "../components/game/GameCodeDisplay";
import { useGame } from "../hooks/useGame";
import { colors, typography, spacing, borderRadius } from "../theme";

const LobbyScreen: React.FC = () => {
  const { gameCode, gameData, isHost, startRound, canStartGame } = useGame();

  const players = gameData?.players ? Object.values(gameData.players) : [];

  return (
    <LinearGradient colors={colors.gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.card} gradient>
            <Text style={styles.title}>Spillrom</Text>

            <GameCodeDisplay gameCode={gameCode} />

            <View style={styles.settingsDisplay}>
              <Text style={styles.settingsText}>
                Maks {gameData?.maxGuesses || 3} gjett per spørsmål
              </Text>
            </View>

            <View style={styles.playersSection}>
              <Text style={styles.playersTitle}>
                Spillere ({players.length})
              </Text>

              <View style={styles.playersList}>
                {players.map((player) => (
                  <View key={player.name} style={styles.playerItem}>
                    <Text style={styles.playerEmoji}>{player.emoji}</Text>
                    <Text style={styles.playerName}>
                      {player.name}
                      {player.name === gameData?.host && (
                        <Text style={styles.hostLabel}> (Vert)</Text>
                      )}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {isHost ? (
              <Button
                title={
                  canStartGame() ? "Start Spill" : "Trenger minst 2 spillere"
                }
                onPress={startRound}
                disabled={!canStartGame()}
                variant={canStartGame() ? "primary" : "secondary"}
              />
            ) : (
              <View style={styles.waitingContainer}>
                <Text style={styles.waitingText}>
                  Venter på at verten starter spillet...
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
  card: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes["3xl"],
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing[6],
  },
  settingsDisplay: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.background.cardBorder,
    padding: spacing[4],
    borderRadius: borderRadius.md,
    marginBottom: spacing[6],
    alignItems: "center",
  },
  settingsText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    color: colors.text.secondary,
  },
  playersSection: {
    marginBottom: spacing[6],
  },
  playersTitle: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing[4],
  },
  playersList: {
    gap: spacing[2],
  },
  playerItem: {
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.primary,
    padding: spacing[3],
    borderRadius: borderRadius.base,
    flexDirection: "row",
    alignItems: "center",
  },
  playerEmoji: {
    fontSize: 20,
    marginRight: spacing[3],
  },
  playerName: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    color: colors.text.primary,
    flex: 1,
  },
  hostLabel: {
    color: colors.text.secondary,
    fontStyle: "italic",
  },
  waitingContainer: {
    paddingVertical: spacing[6],
    alignItems: "center",
  },
  waitingText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    color: colors.text.secondary,
    textAlign: "center",
  },
});

export default LobbyScreen;
