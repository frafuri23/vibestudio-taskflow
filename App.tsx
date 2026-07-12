import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./screens/HomeScreen";
import ListsScreen from "./screens/ListsScreen";
import AddTaskScreen from "./screens/AddTaskScreen";
import TaskDetailScreen from "./screens/TaskDetailScreen";

export type RootStackParamList = {
  Home: undefined;
  Lists: undefined;
  AddTask: { taskId?: string };
  TaskDetail: { taskId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Lists" component={ListsScreen} />
          <Stack.Screen
            name="AddTask"
            component={AddTaskScreen}
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
          <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
