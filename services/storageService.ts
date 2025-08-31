import AsyncStorage from "@react-native-async-storage/async-storage";

interface PlayerData {
  name: string;
  emoji: string;
  level: number;
  xp: number;
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestStreak: number;
  achievements: string[];
  lastPlayed: string;
}

interface GameStats {
  totalGames: number;
  totalWins: number;
  totalScore: number;
  bestStreak: number;
  favoriteEmoji: string;
  achievements: string[];
}

class StorageService {
  private static instance: StorageService;
  private readonly PLAYER_DATA_KEY = "fake_it_player_data";
  private readonly GAME_SETTINGS_KEY = "fake_it_game_settings";
  private readonly ACHIEVEMENTS_KEY = "fake_it_achievements";

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Player Data Management
  async getPlayerData(): Promise<PlayerData | null> {
    try {
      const data = await AsyncStorage.getItem(this.PLAYER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting player data:", error);
      return null;
    }
  }

  async savePlayerData(playerData: PlayerData): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        this.PLAYER_DATA_KEY,
        JSON.stringify(playerData)
      );
      return true;
    } catch (error) {
      console.error("Error saving player data:", error);
      return false;
    }
  }

  async updatePlayerData(updates: Partial<PlayerData>): Promise<boolean> {
    try {
      let newData: PlayerData;
      const existingData = await this.getPlayerData();
      if (existingData) {
        newData = { ...existingData, ...updates } as PlayerData;
      } else {
        newData = await this.createDefaultPlayerData();
        newData = { ...newData, ...updates } as PlayerData;
      }
      return await this.savePlayerData(newData);
    } catch (error) {
      console.error("Error updating player data:", error);
      return false;
    }
  }

  async createDefaultPlayerData(): Promise<PlayerData> {
    const defaultData: PlayerData = {
      name: "",
      emoji: "😀",
      level: 1,
      xp: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
      bestStreak: 0,
      achievements: [],
      lastPlayed: new Date().toISOString(),
    };

    await this.savePlayerData(defaultData);
    return defaultData;
  }

  // XP and Level Management
  calculateLevel(xp: number): number {
    // Each level requires 500 XP more than the previous
    // Level 1: 0-499, Level 2: 500-1499, Level 3: 1500-2999, etc.
    return Math.floor(xp / 500) + 1;
  }

  calculateXPForNextLevel(currentLevel: number): number {
    return currentLevel * 500;
  }

  async addXP(
    amount: number
  ): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> {
    const playerData = await this.getPlayerData();
    if (!playerData) {
      const defaultData = await this.createDefaultPlayerData();
      return this.addXP(amount);
    }

    const oldLevel = playerData.level;
    const newXP = playerData.xp + amount;
    const newLevel = this.calculateLevel(newXP);
    const leveledUp = newLevel > oldLevel;

    await this.updatePlayerData({
      xp: newXP,
      level: newLevel,
      lastPlayed: new Date().toISOString(),
    });

    if (leveledUp) {
      // Award achievement for leveling up
      await this.unlockAchievement(`level_${newLevel}`);
    }

    return { newXP, newLevel, leveledUp };
  }

  // Game Settings
  async getGameSettings(): Promise<any> {
    try {
      const settings = await AsyncStorage.getItem(this.GAME_SETTINGS_KEY);
      return settings
        ? JSON.parse(settings)
        : {
            soundEnabled: true,
            hapticsEnabled: true,
            difficulty: "medium",
            theme: "dark",
          };
    } catch (error) {
      console.error("Error getting game settings:", error);
      return {};
    }
  }

  async saveGameSettings(settings: any): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        this.GAME_SETTINGS_KEY,
        JSON.stringify(settings)
      );
      return true;
    } catch (error) {
      console.error("Error saving game settings:", error);
      return false;
    }
  }

  // Achievements System
  async getAchievements(): Promise<string[]> {
    try {
      const achievements = await AsyncStorage.getItem(this.ACHIEVEMENTS_KEY);
      return achievements ? JSON.parse(achievements) : [];
    } catch (error) {
      console.error("Error getting achievements:", error);
      return [];
    }
  }

  async unlockAchievement(achievementId: string): Promise<boolean> {
    try {
      const achievements = await this.getAchievements();
      if (!achievements.includes(achievementId)) {
        achievements.push(achievementId);
        await AsyncStorage.setItem(
          this.ACHIEVEMENTS_KEY,
          JSON.stringify(achievements)
        );
        return true; // New achievement unlocked
      }
      return false; // Already had this achievement
    } catch (error) {
      console.error("Error unlocking achievement:", error);
      return false;
    }
  }

  // Game Stats
  async recordGameResult(won: boolean, score: number): Promise<void> {
    const playerData = await this.getPlayerData();
    if (!playerData) return;

    const updates: Partial<PlayerData> = {
      gamesPlayed: playerData.gamesPlayed + 1,
      totalScore: playerData.totalScore + score,
      lastPlayed: new Date().toISOString(),
    };

    if (won) {
      updates.gamesWon = playerData.gamesWon + 1;
      // Award XP for winning
      await this.addXP(100);
    } else {
      // Award some XP for participating
      await this.addXP(25);
    }

    await this.updatePlayerData(updates);

    // Check for achievements
    await this.checkGameAchievements(
      playerData.gamesPlayed + 1,
      playerData.gamesWon + (won ? 1 : 0)
    );
  }

  private async checkGameAchievements(
    totalGames: number,
    totalWins: number
  ): Promise<void> {
    // Games played achievements
    if (totalGames === 1) await this.unlockAchievement("first_game");
    if (totalGames === 10) await this.unlockAchievement("veteran_10");
    if (totalGames === 50) await this.unlockAchievement("veteran_50");
    if (totalGames === 100) await this.unlockAchievement("veteran_100");

    // Wins achievements
    if (totalWins === 1) await this.unlockAchievement("first_win");
    if (totalWins === 10) await this.unlockAchievement("winner_10");
    if (totalWins === 25) await this.unlockAchievement("winner_25");

    // Win rate achievements
    const winRate = totalWins / totalGames;
    if (totalGames >= 10 && winRate >= 0.8)
      await this.unlockAchievement("high_achiever");
    if (totalGames >= 20 && winRate >= 0.9)
      await this.unlockAchievement("perfectionist");
  }

  // Clear all data (for debugging/reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.PLAYER_DATA_KEY,
        this.GAME_SETTINGS_KEY,
        this.ACHIEVEMENTS_KEY,
      ]);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  }

  // Export/Import data
  async exportPlayerData(): Promise<string> {
    try {
      const playerData = await this.getPlayerData();
      const settings = await this.getGameSettings();
      const achievements = await this.getAchievements();

      return JSON.stringify({
        playerData,
        settings,
        achievements,
        exportDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      return "";
    }
  }

  async importPlayerData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);

      if (data.playerData) await this.savePlayerData(data.playerData);
      if (data.settings) await this.saveGameSettings(data.settings);
      if (data.achievements)
        await AsyncStorage.setItem(
          this.ACHIEVEMENTS_KEY,
          JSON.stringify(data.achievements)
        );

      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }
}

export default StorageService;
export type { PlayerData, GameStats };
