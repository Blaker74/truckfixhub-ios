import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { BRAND } from "@/constants/truckfixhub";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 7);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: BRAND.blue,
        tabBarInactiveTintColor: "#718190",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700", marginTop: 2 },
        tabBarStyle: {
          height: 56 + bottomPadding,
          paddingTop: 5,
          paddingBottom: bottomPadding,
          backgroundColor: "#ffffff",
          borderTopColor: "#d8e2ec",
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="diagnose" options={{ title: "Diagnose", tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="garage" options={{ title: "Garage", tabBarIcon: ({ color, size }) => <Ionicons name="car-sport-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="community" options={{ title: "Community", tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="resources" options={{ title: "Resources", tabBarIcon: ({ color, size }) => <Ionicons name="library-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
