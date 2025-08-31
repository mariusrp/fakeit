import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useGame } from "../hooks/useGame";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import { playerEmojis } from "../constants/gameData";
import { Button } from "../components/ui/Button";

export default function MenuScreen() {
  const router = useRouter();
  const {
    playerName,
    setPlayerName,
    selectedEmoji,
    setSelectedEmoji,
    joinCode,
    setJoinCode,
    maxGuesses,
    setMaxGuesses,
    createGame,
    joinGame,
    gameState,
  } = useGame();

  const guessOptions = [1, 2, 3, 4, 5];

  // Navigate based on game state
  useEffect(() => {
    if (gameState === "lobby") {
      router.push("/lobby");
    } else if (gameState === "questionPreview") {
      router.push("/question-preview");
    } else if (gameState === "question") {
      router.push("/question");
    } else if (gameState === "voting") {
      router.push("/voting");
    } else if (gameState === "results") {
      router.push("/results");
    } else if (gameState === "manualScoring") {
      router.push("/manual-scoring");
    } else if (gameState === "rankings") {
      router.push("/rankings");
    }
  }, [gameState, router]);

  return (
    <LinearGradient colors={colors.gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.title}>TriviaBluff</Text>

            <TextInput
              style={styles.input}
              placeholder="Skriv inn navnet ditt"
              placeholderTextColor={colors.text.tertiary}
              value={playerName}
              onChangeText={setPlayerName}
            />

            <View style={styles.emojiSection}>
              <Text style={styles.emojiTitle}>Velg din emoji</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.emojiGrid}
              >
                {playerEmojis.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.emojiOption,
                      selectedEmoji === emoji && styles.selectedEmoji,
                    ]}
                    onPress={() => setSelectedEmoji(emoji)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.guessSettings}>
              <Text style={styles.guessTitle}>
                Maks antall gjett per spørsmål
              </Text>
              <View style={styles.guessOptions}>
                {guessOptions.map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.guessOption,
                      maxGuesses === num && styles.selectedGuess,
                    ]}
                    onPress={() => setMaxGuesses(num)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.guessOptionText,
                        maxGuesses === num && styles.selectedGuessText,
                      ]}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              title="Lag Spill"
              onPress={createGame}
              style={styles.createButton}
            />

            <View style={styles.joinSection}>
              <TextInput
                style={styles.input}
                placeholder="Spillkode"
                placeholderTextColor={colors.text.tertiary}
                value={joinCode}
                onChangeText={(text) => setJoinCode(text.toUpperCase())}
                autoCapitalize="characters"
                maxLength={6}
              />
              <Button title="Bli Med" onPress={joinGame} variant="secondary" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

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
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.background.cardBorder,
    borderRadius: borderRadius["2xl"],
    padding: spacing[6],
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
    ...shadows.lg,
  },
  title: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes["6xl"],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing[8],
  },
  input: {
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  emojiSection: {
    marginBottom: spacing[6],
  },
  emojiTitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing[4],
  },
  emojiGrid: {
    flexDirection: "row",
    gap: spacing[2],
    paddingHorizontal: spacing[2],
  },
  emojiOption: {
    width: 48,
    height: 48,
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.base,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedEmoji: {
    backgroundColor: colors.interactive.selected,
    borderColor: colors.interactive.selected,
    transform: [{ scale: 1.1 }],
  },
  emojiText: {
    fontSize: 24,
  },
  guessSettings: {
    marginBottom: spacing[6],
  },
  guessTitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing[4],
  },
  guessOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[2],
    flexWrap: "wrap",
  },
  guessOption: {
    width: 48,
    height: 48,
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.base,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedGuess: {
    backgroundColor: colors.interactive.selected,
    borderColor: colors.interactive.selected,
    transform: [{ scale: 1.05 }],
  },
  guessOptionText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  selectedGuessText: {
    color: colors.text.inverse,
  },
  createButton: {
    marginBottom: spacing[6],
  },
  joinSection: {
    gap: spacing[4],
  },
});
