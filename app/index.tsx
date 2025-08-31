import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useGame } from "../hooks/useGame";
import StorageService, { PlayerData } from "../services/storageService";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import { Button } from "../components/ui/Button";
import { EmojiSelector } from "../components/game/EmojiSelector";

// Context for å isolere state og unngå re-render problemer
interface MenuContextType {
  formData: {
    playerName: string;
    selectedEmoji: string;
    joinCode: string;
  };
  updateFormData: (key: string, value: string) => void;
  playerData: PlayerData | null;
  isLoading: boolean;
}

const MenuContext = createContext<MenuContextType | null>(null);

// Isolert komponent for TextInput som ikke re-rendres
const StableTextInput = ({
  placeholder,
  value,
  onChangeText,
  style,
  ...props
}: any) => {
  const inputRef = useRef<TextInput>(null);
  const [internalValue, setInternalValue] = useState(value);

  // Sync med external value kun ved mount eller når external endres drastisk
  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (text: string) => {
    setInternalValue(text);
    onChangeText?.(text);
  };

  return (
    <TextInput
      ref={inputRef}
      style={style}
      placeholder={placeholder}
      value={internalValue}
      onChangeText={handleChange}
      {...props}
    />
  );
};

// Isolert ProgressBar komponent
const ProgressBar = ({ value, total }: { value: number; total: number }) => {
  const percentage = Math.min(100, Math.max(0, (value / total) * 100));

  return (
    <View style={styles.xpBar}>
      <View style={[styles.xpFill, { width: `${percentage}%` }]} />
    </View>
  );
};

// Provider komponent
const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState({
    playerName: "",
    selectedEmoji: "",
    joinCode: "",
  });
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const contextValue: MenuContextType = {
    formData,
    updateFormData,
    playerData,
    isLoading,
  };

  // Last playerData ved mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storageService = StorageService.getInstance();
        let data = await storageService.getPlayerData();
        if (!data) data = await storageService.createDefaultPlayerData();

        setPlayerData(data);
        setFormData((prev) => ({
          ...prev,
          playerName: data.name || "",
          selectedEmoji: data.emoji || "",
        }));
      } catch (error) {
        console.error("Error loading player data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
  );
};

// Hook for å bruke context
const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenuContext must be used within MenuProvider");
  }
  return context;
};

// Header komponent - isolert og stabil
const HeaderComponent = ({
  screenMode,
  onProfilePress,
  onBackPress,
}: {
  screenMode: string;
  onProfilePress: () => void;
  onBackPress: () => void;
}) => {
  const { formData, playerData } = useMenuContext();
  const currentXP = (playerData?.xp || 0) % 500;

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={onProfilePress}
        activeOpacity={0.8}
      >
        <View style={styles.profilePreview}>
          <View style={styles.avatarWrap}>
            <Text style={styles.profileEmoji}>
              {formData.selectedEmoji || "👤"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {formData.playerName || "Spiller"}
            </Text>
            <View style={styles.levelRow}>
              <Text style={styles.levelText}>
                Level {playerData?.level || 1}
              </Text>
              <ProgressBar value={currentXP} total={500} />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {screenMode !== "main" && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={styles.backButtonText}>← Tilbake</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Join Game komponent - isolert state management
const JoinGameScreen = ({ onJoinGame }: { onJoinGame: () => void }) => {
  const { formData, updateFormData } = useMenuContext();

  const canJoin =
    formData.playerName.trim().length >= 2 &&
    !!formData.selectedEmoji &&
    formData.joinCode.length === 6;

  const handleCodeChange = (text: string) => {
    const cleanCode = text
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
    updateFormData("joinCode", cleanCode);
  };

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.screenTitle}>Bli med i spill</Text>

      <View style={styles.settingsCard}>
        <Text style={styles.settingLabel}>Spillkode</Text>
        <StableTextInput
          style={styles.codeInput}
          placeholder="ABC123"
          placeholderTextColor={colors.text.placeholder}
          value={formData.joinCode}
          onChangeText={handleCodeChange}
          autoCapitalize="characters"
          maxLength={6}
          textAlign="center"
          keyboardType="ascii-capable"
          returnKeyType="done"
          selectTextOnFocus={false}
          contextMenuHidden={false}
        />
        {formData.joinCode.length > 0 && formData.joinCode.length < 6 && (
          <Text style={styles.validationText}>Spillkoden må være 6 tegn</Text>
        )}
      </View>

      <Button
        title="Bli med"
        onPress={onJoinGame}
        style={styles.actionButton}
        disabled={!canJoin}
        variant={canJoin ? "primary" : "secondary"}
      />
    </ScrollView>
  );
};

// Profile komponent - isolert state management
const ProfileScreen = ({ onSave }: { onSave: () => void }) => {
  const { formData, updateFormData, playerData } = useMenuContext();
  const currentXP = (playerData?.xp || 0) % 500;

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.screenTitle}>Min profil</Text>

      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.bigEmojiWrap}>
            <Text style={styles.bigEmoji}>
              {formData.selectedEmoji || "👤"}
            </Text>
          </View>
          <View style={styles.profileStats}>
            <Text style={styles.bigName}>
              {formData.playerName || "Ukjent spiller"}
            </Text>
            <Text style={styles.levelBig}>Level {playerData?.level || 1}</Text>
            <ProgressBar value={currentXP} total={500} />
            <Text style={styles.xpText}>
              {currentXP} / 500 XP til neste level
            </Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Spillernavn</Text>
          <StableTextInput
            style={styles.textInput}
            placeholder="Skriv inn navnet ditt"
            placeholderTextColor={colors.text.placeholder}
            value={formData.playerName}
            onChangeText={(text: string) => updateFormData("playerName", text)}
            maxLength={20}
            returnKeyType="done"
            autoCorrect={false}
            autoCapitalize="words"
            selectTextOnFocus={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Avatar</Text>
          <EmojiSelector
            selectedEmoji={formData.selectedEmoji}
            onSelectEmoji={(emoji: string) =>
              updateFormData("selectedEmoji", emoji)
            }
            title=""
          />
        </View>

        <Button
          title="Lagre profil"
          onPress={onSave}
          style={styles.actionButton}
          variant="success"
        />

        {playerData && (
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Statistikk</Text>
            <View style={styles.achievementGrid}>
              <View style={styles.achievementItem}>
                <Text style={styles.achievementNumber}>
                  {playerData.gamesPlayed}
                </Text>
                <Text style={styles.achievementLabel}>Spill totalt</Text>
              </View>
              <View style={styles.achievementItem}>
                <Text style={styles.achievementNumber}>
                  {playerData.gamesWon}
                </Text>
                <Text style={styles.achievementLabel}>Seire</Text>
              </View>
              <View style={styles.achievementItem}>
                <Text style={styles.achievementNumber}>
                  {playerData.gamesPlayed > 0
                    ? Math.round(
                        (playerData.gamesWon / playerData.gamesPlayed) * 100
                      )
                    : 0}
                  %
                </Text>
                <Text style={styles.achievementLabel}>Vinnrate</Text>
              </View>
              <View style={styles.achievementItem}>
                <Text style={styles.achievementNumber}>
                  {playerData.totalScore}
                </Text>
                <Text style={styles.achievementLabel}>Total poeng</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Main Menu komponent
const MainMenuScreen = ({
  onCreatePress,
  onJoinPress,
  onProfilePress,
}: {
  onCreatePress: () => void;
  onJoinPress: () => void;
  onProfilePress: () => void;
}) => {
  const { formData, playerData } = useMenuContext();

  const canCreateGame =
    formData.playerName.trim().length >= 2 && !!formData.selectedEmoji;
  const canJoinGame = canCreateGame;

  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.mainContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Fake It</Text>
        <Text style={styles.subtitle}>Lur vennene dine!</Text>
      </View>

      <View style={styles.mainButtons}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            !canCreateGame && styles.disabledButton,
          ]}
          onPress={onCreatePress}
          disabled={!canCreateGame}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              !canCreateGame
                ? [colors.interactive.disabled, colors.interactive.disabled]
                : [colors.interactive.primary, colors.interactive.primaryHover]
            }
            style={styles.buttonGradient}
          >
            <Text
              style={[
                styles.primaryButtonText,
                !canCreateGame && styles.disabledButtonText,
              ]}
            >
              🎮 Lag nytt spill
            </Text>
            <Text
              style={[
                styles.buttonSubtext,
                !canCreateGame && styles.disabledButtonText,
              ]}
            >
              Start et spill med venner
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            !canJoinGame && styles.disabledButton,
          ]}
          onPress={onJoinPress}
          disabled={!canJoinGame}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              !canJoinGame && styles.disabledButtonText,
            ]}
          >
            🔗 Bli med i spill
          </Text>
          <Text
            style={[
              styles.buttonSubtext,
              !canJoinGame && styles.disabledButtonText,
            ]}
          >
            Skriv inn spillkode
          </Text>
        </TouchableOpacity>
      </View>

      {!canCreateGame && (
        <TouchableOpacity
          style={styles.setupPrompt}
          onPress={onProfilePress}
          activeOpacity={0.8}
        >
          <Text style={styles.setupPromptText}>Sett opp profilen først</Text>
        </TouchableOpacity>
      )}

      {playerData && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{playerData.gamesPlayed}</Text>
            <Text style={styles.statLabel}>Spill</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{playerData.gamesWon}</Text>
            <Text style={styles.statLabel}>Seire</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{playerData.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

// Create Game komponent
const CreateGameScreen = ({ onCreateGame }: { onCreateGame: () => void }) => {
  const [localMaxGuesses, setLocalMaxGuesses] = useState(3);
  const guessOptions = [1, 2, 3, 4, 5];

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.screenTitle}>Lag nytt spill</Text>

      <View style={styles.settingsCard}>
        <Text style={styles.settingLabel}>Antall forsøk per spørsmål</Text>
        <View style={styles.optionsRow}>
          {guessOptions.map((num) => {
            const selected = localMaxGuesses === num;
            return (
              <TouchableOpacity
                key={num}
                style={[styles.optionButton, selected && styles.selectedOption]}
                onPress={() => setLocalMaxGuesses(num)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.selectedOptionText,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.difficultyText}>
          {localMaxGuesses <= 2 && "🔥 Vanskelig"}
          {localMaxGuesses === 3 && "⚖️ Middels"}
          {localMaxGuesses >= 4 && "😊 Lett"}
        </Text>
      </View>

      <Button
        title="Opprett spill"
        onPress={() => {
          // Sett maxGuesses og opprett spill
          onCreateGame();
        }}
        style={styles.actionButton}
        variant="primary"
      />
    </ScrollView>
  );
};

// Hoved MenuScreen komponent
function MenuScreenContent() {
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

  const [screenMode, setScreenMode] = useState<
    "main" | "create" | "join" | "profile"
  >("main");

  const { formData, updateFormData, playerData, isLoading } = useMenuContext();
  const storageService = StorageService.getInstance();

  // Sync global state med form data når nødvendig
  useEffect(() => {
    if (formData.playerName !== playerName) {
      setPlayerName(formData.playerName);
    }
    if (formData.selectedEmoji !== selectedEmoji) {
      setSelectedEmoji(formData.selectedEmoji);
    }
    if (formData.joinCode !== joinCode) {
      setJoinCode(formData.joinCode);
    }
  }, [
    formData,
    playerName,
    selectedEmoji,
    joinCode,
    setPlayerName,
    setSelectedEmoji,
    setJoinCode,
  ]);

  // Navigasjon basert på gameState
  useEffect(() => {
    if (gameState === "lobby") router.push("/lobby");
    else if (gameState === "questionPreview") router.push("/question-preview");
    else if (gameState === "question") router.push("/question");
    else if (gameState === "voting") router.push("/voting");
    else if (gameState === "results") router.push("/results");
    else if (gameState === "manualScoring") router.push("/manual-scoring");
    else if (gameState === "rankings") router.push("/rankings");
    else if (gameState === "menu") {
      // Når gameState er "menu", sørg for at vi er på riktig skjerm
      setScreenMode("main");
    }
  }, [gameState, router]);

  const savePlayerProfile = async () => {
    if (!playerData) return;
    try {
      await storageService.updatePlayerData({
        name: formData.playerName,
        emoji: formData.selectedEmoji,
      });

      // Oppdater global state
      setPlayerName(formData.playerName);
      setSelectedEmoji(formData.selectedEmoji);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Lagret!", "Profilen din er oppdatert");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Feil", "Kunne ikke lagre profilen");
    }
  };

  const handleScreenChange = (mode: "main" | "create" | "join" | "profile") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScreenMode(mode);
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScreenMode("main");
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={colors.gradients.primary}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Laster inn...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.gradients.primary} style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.primary}
      />
      <SafeAreaView style={styles.safeArea}>
        <HeaderComponent
          screenMode={screenMode}
          onProfilePress={() => handleScreenChange("profile")}
          onBackPress={handleBackPress}
        />

        {screenMode === "main" && (
          <MainMenuScreen
            onCreatePress={() => handleScreenChange("create")}
            onJoinPress={() => handleScreenChange("join")}
            onProfilePress={() => handleScreenChange("profile")}
          />
        )}

        {screenMode === "create" && (
          <CreateGameScreen onCreateGame={createGame} />
        )}

        {screenMode === "join" && <JoinGameScreen onJoinGame={joinGame} />}

        {screenMode === "profile" && (
          <ProfileScreen onSave={savePlayerProfile} />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

// Export med Provider wrapper
export default function MenuScreen() {
  return (
    <MenuProvider>
      <MenuScreenContent />
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: spacing[4],
    marginTop: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderWidth: 1,
    borderColor: colors.border.primary,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },

  profileButton: { flex: 1 },
  profilePreview: { flexDirection: "row", alignItems: "center" },
  avatarWrap: {
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
  profileEmoji: { fontSize: 22 },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginTop: spacing[1],
  },
  levelText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    minWidth: 64,
  },
  xpBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
  },
  xpFill: {
    height: "100%",
    backgroundColor: colors.interactive.primary,
    borderRadius: 3,
  },

  backButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.input,
  },
  backButtonText: {
    fontSize: typography.sizes.base,
    color: colors.interactive.primary,
    fontWeight: typography.weights.medium,
  },

  // Main Menu Styles
  mainContainer: { flex: 1 },
  mainContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },

  titleContainer: {
    alignItems: "center",
    marginVertical: spacing[8],
  },
  title: {
    fontFamily: typography.fonts.primary,
    fontSize: typography.sizes["5xl"],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    textAlign: "center",
  },

  mainButtons: {
    gap: spacing[4],
    marginBottom: spacing[6],
  },

  primaryButton: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.lg,
  },
  buttonGradient: {
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[5],
    alignItems: "center",
    minHeight: 84,
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.inverse,
    marginBottom: spacing[1],
  },

  secondaryButton: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[5],
    alignItems: "center",
    minHeight: 84,
    justifyContent: "center",
    ...shadows.md,
  },
  secondaryButtonText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },

  buttonSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },

  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: colors.interactive.disabledText,
  },

  setupPrompt: {
    alignItems: "center",
    padding: spacing[4],
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginBottom: spacing[4],
  },
  setupPromptText: {
    fontSize: typography.sizes.base,
    color: colors.interactive.primary,
    fontWeight: typography.weights.medium,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },

  // Screen Layout Styles
  screenContainer: { flex: 1 },
  screenContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  },

  screenTitle: {
    fontSize: typography.sizes["3xl"],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing[6],
  },

  // Settings Card
  settingsCard: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    marginBottom: spacing[6],
    ...shadows.md,
  },

  settingLabel: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing[4],
    textAlign: "center",
  },

  optionsRow: {
    flexDirection: "row",
    gap: spacing[3],
    alignSelf: "center",
    marginBottom: spacing[3],
  },

  optionButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOption: {
    backgroundColor: colors.interactive.primary,
    borderColor: colors.interactive.primary,
  },
  optionText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  selectedOptionText: {
    color: colors.text.inverse,
  },

  difficultyText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
    textAlign: "center",
  },

  // Code Input
  codeInput: {
    backgroundColor: colors.background.input,
    borderWidth: 2,
    borderColor: colors.border.focused,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: spacing[3],
  },

  validationText: {
    fontSize: typography.sizes.sm,
    color: colors.error.text,
    textAlign: "center",
  },

  // Profile Card
  profileCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.md,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[6],
  },

  bigEmojiWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.tertiary,
    marginRight: spacing[4],
    borderWidth: 2,
    borderColor: colors.border.primary,
  },
  bigEmoji: { fontSize: 44 },

  profileStats: { flex: 1 },
  bigName: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  levelBig: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  xpText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },

  // Form Elements
  formGroup: { marginBottom: spacing[5] },
  inputLabel: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  textInput: {
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    fontSize: typography.sizes.base,
    color: colors.text.primary,
  },

  actionButton: {
    marginVertical: spacing[4],
  },

  // Achievements Section
  achievementsSection: {
    marginTop: spacing[6],
    paddingTop: spacing[6],
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing[4],
    textAlign: "center",
  },
  achievementGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
    justifyContent: "space-between",
  },
  achievementItem: {
    alignItems: "center",
    flex: 1,
    minWidth: "48%",
    backgroundColor: colors.background.input,
    padding: spacing[3],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  achievementNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.interactive.primary,
  },
  achievementLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing[1],
    textAlign: "center",
  },
});
