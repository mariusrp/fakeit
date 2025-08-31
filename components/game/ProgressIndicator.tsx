import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { ProgressIndicatorProps } from "../../types";

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentPhase,
  players,
  answers,
  votes,
}) => {
  const playerList = Object.values(players || {});
  const isAnswerPhase = currentPhase === "question";
  const isVotingPhase = currentPhase === "voting";

  if (!isAnswerPhase && !isVotingPhase) return null;

  const getPlayersWhoAnswered = () => {
    const playersSet = new Set<string>();
    Object.values(answers || {}).forEach((answerData) => {
      playersSet.add(answerData.player);
    });
    return Array.from(playersSet);
  };

  const completedPlayers = isAnswerPhase
    ? getPlayersWhoAnswered()
    : Object.keys(votes || {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isAnswerPhase ? "Svar-fremdrift" : "Stemme-fremdrift"}
      </Text>
      <View style={styles.playersList}>
        {playerList.map((player) => {
          const isCompleted = completedPlayers.includes(player.name);
          return (
            <View key={player.name} style={styles.playerItem}>
              <Text style={styles.playerEmoji}>{player.emoji}</Text>
              <View
                style={[
                  styles.checkbox,
                  isCompleted && styles.checkboxCompleted,
                ]}
              >
                {isCompleted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text
                style={[
                  styles.playerName,
                  isCompleted && styles.playerNameCompleted,
                ]}
              >
                {player.name}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing[4],
    padding: spacing[3],
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.background.cardBorder,
  },
  title: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: typography.letterSpacing.wide,
    marginBottom: spacing[2],
    textAlign: "center",
  },
  playersList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing[2],
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[2],
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    minWidth: 100,
  },
  playerEmoji: {
    fontSize: 16,
    marginRight: spacing[2],
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 6,
    marginRight: spacing[2],
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    borderColor: colors.text.primary,
    backgroundColor: colors.text.primary,
  },
  checkmark: {
    fontSize: 8,
    fontWeight: typography.weights.bold,
    color: colors.text.inverse,
  },
  playerName: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    color: colors.text.primary,
    flex: 1,
  },
  playerNameCompleted: {
    color: colors.text.primary,
  },
});
