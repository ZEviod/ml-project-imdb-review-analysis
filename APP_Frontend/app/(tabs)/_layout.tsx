import { Tabs } from 'expo-router';
import { StyleSheet, View, useColorScheme } from 'react-native';
import {
  Chrome as Home,
  History,
  Settings,
  MessageSquareText,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            style={StyleSheet.absoluteFill}
            tint={isDark ? 'dark' : 'light'}
          />
        ),
        tabBarActiveTintColor: isDark ? '#60A5FA' : '#1E40AF',
        tabBarInactiveTintColor: isDark ? '#94A3B8' : '#64748B',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Analyze',
          tabBarIcon: ({ color, size }) => (
            <MessageSquareText color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="examples"
        options={{
          title: 'Examples',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <History color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'transparent',
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});
