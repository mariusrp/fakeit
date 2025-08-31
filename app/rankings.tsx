import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { GameCodeDisplay } from "../components/game/GameCodeDisplay";
import { useGame } from "../hooks/useGame";
import { colors, typography, spacing, borderRadius } from "../theme";

const RankingsScreen: React.FC = () => {
  const { gameCode, gameData, isHost, nextRound } = useGame();

  const players = gameData?.players ? Object.values(gameData.players) : [];
  const sortedPlayers = players.sort((a, b) => b.score - a.score);

  return (
    <LinearGradient colors={colors.gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.card} gradient>
            <GameCodeDisplay gameCode={gameCode} variant="floating" />

            <Text style={styles.title}>Poengtavle</Text>
            <Text style={styles.roundInfo}>
              Etter {gameData?.round} runde(r)
            </Text>

            <View style={styles.rankingsList}>
              {sortedPlayers.map((player, i) => (
                <View
                  key={player.name}
                  style={[styles.rankingItem, i === 0 && styles.winner]}
                >
                  <View style={styles.rankingInfo}>
                    <Text style={styles.rankingEmoji}>{player.emoji}</Text>
                    <Text style={styles.rank}>#{i + 1}</Text>
                    <Text style={styles.playerName}>
                      {player.name} {i === 0 && "(Leder)"}
                    </Text>
                  </View>
                  <Text style={styles.score}>{player.score}</Text>
                </View>
              ))}
            </View>

            {isHost ? (
              <>
                <Text style={styles.statusText}>
                  Alle spillere har fullført runden!
                </Text>
                <Button
                  title="Neste Runde"
                  onPress={nextRound}
                  variant="success"
                />
              </>
            ) : (
              <Text style={styles.waitingText}>
                Venter på at verten starter neste runde...
              </Text>
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
    marginBottom: spacing[2],
  },
  roundInfo: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing[6],
  },
  rankingsList: {
    marginBottom: spacing[6],
    gap: spacing[3],
  },
  rankingItem: {
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.primary,
    padding: spacing[4],
    borderRadius: borderRadius.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  winner: {
    backgroundColor: colors.warning.light,
    borderColor: colors.warning.border,
  },
  rankingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rankingEmoji: {
    fontSize: 24,
    marginRight: spacing[3],
  },
  rank: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
    minWidth: 32,
  },
  playerName: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    color: colors.text.primary,
    flex: 1,
    marginLeft: spacing[2],
  },
  score: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  statusText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing[4],
  },
  waitingText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    paddingVertical: spacing[4],
  },
});

export default RankingsScreen;
