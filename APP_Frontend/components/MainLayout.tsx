import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  darkMode?: boolean;
  actionComponent?: React.ReactNode;
}

export function MainLayout({
  children,
  title,
  subtitle,
  style,
  darkMode = false,
  actionComponent,
}: MainLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: insets.top },
        darkMode && styles.darkContainer,
        style,
      ]}
    >
      <LinearGradient
        colors={darkMode ? ['#1E293B', '#0F172A'] : ['#1E40AF', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          { paddingTop: Platform.OS === 'android' ? insets.top + 16 : 16 },
        ]}
      >
        <View style={styles.titleContainer}>
          <View>
            <Text style={[styles.title, darkMode && styles.darkTitle]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, darkMode && styles.darkSubtitle]}>
                {subtitle}
              </Text>
            )}
          </View>
          {actionComponent && (
            <View style={styles.actionContainer}>{actionComponent}</View>
          )}
        </View>
      </LinearGradient>

      <View style={[styles.content, darkMode && styles.darkContent]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  darkContainer: {
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  darkTitle: {
    color: '#F8FAFC',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#E2E8F0',
    marginTop: 4,
  },
  darkSubtitle: {
    color: '#94A3B8',
  },
  actionContainer: {
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: 80,
  },
  darkContent: {
    backgroundColor: '#0F172A',
  },
});
