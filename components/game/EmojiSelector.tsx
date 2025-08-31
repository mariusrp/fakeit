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
import { playerEmojis } from "../../constants/gameData";

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        contentContainerStyle={styles.emojiGrid}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {playerEmojis.map((emoji, index) => (
          <TouchableOpacity
            key={index}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[6],
  },
  title: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing[4],
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: spacing[2],
  },
  emojiOption: {
    width: 48,
    height: 48,
    margin: spacing[1],
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
});
