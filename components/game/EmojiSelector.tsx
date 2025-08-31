import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, borderRadius } from "../../theme";

const QUICK_EMOJIS = [
  // Happy faces
  "😀",
  "😁",
  "😂",
  "🤣",
  "😃",
  "😄",
  "😆",
  "😊",
  // Cool & Fun
  "😎",
  "🤩",
  "🥳",
  "🤪",
  "😜",
  "😝",
  "🤭",
  "🤫",
  // Animals
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
  "🙈",
  // Fantasy & Mythical
  "🦄",
  "🐉",
  "🧚",
  "🧙",
  "🧛",
  "🧜",
  "🧞",
  "🧝",
  // Food
  "🍕",
  "🍔",
  "🌮",
  "🍩",
  "🍪",
  "🧁",
  "🍰",
  "🎂",
  // Objects & Symbols
  "🎯",
  "🎮",
  "🎲",
  "🎭",
  "🎨",
  "🏆",
  "⚡",
  "🔥",
  "💎",
  "👑",
  "🗡️",
  "🛡️",
  "🎪",
  "🎡",
  "🎢",
  "🚀",
  // Nature
  "🌟",
  "⭐",
  "💫",
  "🌈",
  "🌸",
  "🌺",
  "🌻",
  "🌙",
  // Vehicles
  "🏎️",
  "🚁",
  "✈️",
  "🛸",
  "🚂",
  "⛵",
  "🏍️",
  "🛵",
  // Sports & Activities
  "⚽",
  "🏀",
  "🏈",
  "⚾",
  "🎾",
  "🏐",
  "🏓",
  "🎱",
  // Tech & Gaming
  "🤖",
  "👾",
  "🕹️",
  "💻",
  "📱",
  "⌚",
  "🎧",
  "📷",
];

interface EmojiSelectorProps {
  selectedEmoji: string;
  onSelectEmoji: (emoji: string) => void;
  title?: string;
}

export const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  selectedEmoji,
  onSelectEmoji,
  title = "Velg din emoji",
}) => {
  const handleEmojiPress = (emoji: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectEmoji(emoji);
  };

  // Group emojis into rows of 8
  const emojiRows = [];
  for (let i = 0; i < QUICK_EMOJIS.length; i += 8) {
    emojiRows.push(QUICK_EMOJIS.slice(i, i + 8));
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        <View style={styles.emojiGrid}>
          {emojiRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.emojiRow}>
              {row.map((emoji, index) => (
                <TouchableOpacity
                  key={`${rowIndex}-${index}`}
                  style={[
                    styles.emojiOption,
                    selectedEmoji === emoji && styles.selectedEmoji,
                  ]}
                  onPress={() => handleEmojiPress(emoji)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.scrollHint}>
        <Text style={styles.scrollHintText}>← Scroll for flere emojis →</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing[3],
  },
  scrollView: {
    maxHeight: 200, // 4 rows * 48px + spacing
  },
  scrollContainer: {
    paddingHorizontal: spacing[2],
  },
  emojiGrid: {
    gap: spacing[2],
  },
  emojiRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  emojiOption: {
    width: 44,
    height: 44,
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedEmoji: {
    backgroundColor: colors.interactive.primary,
    borderColor: colors.interactive.primary,
    transform: [{ scale: 1.1 }],
  },
  emojiText: {
    fontSize: 22,
  },
  scrollHint: {
    alignItems: "center",
    marginTop: spacing[2],
  },
  scrollHintText: {
    fontSize: typography.sizes.xs,
    color: colors.text.tertiary,
    fontStyle: "italic",
  },
});
