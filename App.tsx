import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useGame } from "./hooks/useGame";
import QuestionScreen from "./app/question";
import VotingScreen from "./app/voting";
import ResultsScreen from "./app/results";
import ManualScoringScreen from "./app/manual-scoring";
import RankingsScreen from "./app/rankings";
import MenuScreen from "./app";
import LobbyScreen from "./app/lobby";
import QuestionPreviewScreen from "./app/question-preview";

const Stack = createNativeStackNavigator();

export default function App() {
  const { gameState } = useGame();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#0f0f0f" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 300,
          }}
        >
          {gameState === "menu" && (
            <Stack.Screen name="Menu" component={MenuScreen} />
          )}
          {gameState === "lobby" && (
            <Stack.Screen name="Lobby" component={LobbyScreen} />
          )}
          {gameState === "questionPreview" && (
            <Stack.Screen
              name="QuestionPreview"
              component={QuestionPreviewScreen}
            />
          )}
          {gameState === "question" && (
            <Stack.Screen name="Question" component={QuestionScreen} />
          )}
          {gameState === "voting" && (
            <Stack.Screen name="Voting" component={VotingScreen} />
          )}
          {gameState === "results" && (
            <Stack.Screen name="Results" component={ResultsScreen} />
          )}
          {gameState === "manualScoring" && (
            <Stack.Screen
              name="ManualScoring"
              component={ManualScoringScreen}
            />
          )}
          {gameState === "rankings" && (
            <Stack.Screen name="Rankings" component={RankingsScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
