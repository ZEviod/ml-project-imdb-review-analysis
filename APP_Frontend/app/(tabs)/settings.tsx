import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Moon,
  Sun,
  Github,
  Mail,
  ChevronRight,
  BookOpen,
  Heart,
  Settings as SettingsIcon,
  Info,
} from 'lucide-react-native';

// Components
import { MainLayout } from '@/components/MainLayout';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { darkMode, toggleDarkMode } = useTheme();
  const [saveHistory, setSaveHistory] = React.useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  const toggleSaveHistory = () =>
    setSaveHistory((previousState) => !previousState);
  const toggleNotifications = () =>
    setNotificationsEnabled((previousState) => !previousState);

  // External links
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('An error occurred', err)
    );
  };

  // Support email
  const sendEmail = () => {
    Linking.openURL('mailto:support@sentimentanalyzer.com').catch((err) =>
      console.error('An error occurred', err)
    );
  };

  const settingsSections = [
    {
      title: 'General',
      items: [
        {
          icon: darkMode ? (
            <Moon size={20} color="#94A3B8" />
          ) : (
            <Sun size={20} color="#94A3B8" />
          ),
          label: 'Dark Mode',
          action: 'switch',
          value: darkMode,
          onToggle: toggleDarkMode,
        },
        {
          icon: <SettingsIcon size={20} color="#94A3B8" />,
          label: 'Save Analysis History',
          action: 'switch',
          value: saveHistory,
          onToggle: toggleSaveHistory,
        },
        {
          icon: <Info size={20} color="#94A3B8" />,
          label: 'Enable Notifications',
          action: 'switch',
          value: notificationsEnabled,
          onToggle: toggleNotifications,
          disabled: Platform.OS === 'web',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <BookOpen size={20} color="#94A3B8" />,
          label: 'Documentation',
          action: 'link',
          onPress: () =>
            openLink(
              'https://github.com/ZEviod/ml-project-imdb/blob/main/README.md'
            ),
        },
        {
          icon: <Mail size={20} color="#94A3B8" />,
          label: 'Contact Support',
          action: 'link',
          onPress: sendEmail,
        },
        {
          icon: <Github size={20} color="#94A3B8" />,
          label: 'GitHub Repository',
          action: 'link',
          onPress: () => openLink('https://github.com/ZEviod/ml-project-imdb'),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: <Heart size={20} color="#94A3B8" />,
          label: 'About Sentiment Analyzer',
          action: 'press',
          onPress: () =>
            openLink(
              'https://github.com/ZEviod/ml-project-imdb/blob/main/README.md#Overview'
            ),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number, isLast: boolean) => {
    return (
      <View
        key={index}
        style={[
          styles.settingItem,
          !isLast && styles.borderBottom,
          !isLast && darkMode && styles.darkBorderBottom,
          darkMode && styles.darkSettingItem,
        ]}
      >
        <View style={styles.settingMain}>
          <View style={styles.settingIcon}>
            {React.cloneElement(item.icon, {
              color: darkMode ? '#94A3B8' : '#64748B',
            })}
          </View>
          <Text
            style={[styles.settingLabel, darkMode && styles.darkSettingLabel]}
          >
            {item.label}
          </Text>
        </View>

        {item.action === 'switch' && (
          <Switch
            trackColor={{ false: '#CBD5E1', true: '#60A5FA' }}
            thumbColor={item.value ? '#1E40AF' : '#F1F5F9'}
            ios_backgroundColor="#CBD5E1"
            onValueChange={item.onToggle}
            value={item.value}
            disabled={item.disabled}
          />
        )}

        {(item.action === 'link' || item.action === 'press') && (
          <TouchableOpacity onPress={item.onPress} style={styles.linkButton}>
            <ChevronRight size={20} color={darkMode ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <MainLayout
      title="Settings"
      subtitle="Customize your experience"
      darkMode={darkMode}
    >
      <ScrollView
        style={[styles.scrollView, darkMode && styles.darkScrollView]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text
              style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}
            >
              {section.title}
            </Text>
            <View
              style={[
                styles.sectionContent,
                darkMode && styles.darkSectionContent,
              ]}
            >
              {section.items.map((item, itemIndex) =>
                renderSettingItem(
                  item,
                  itemIndex,
                  itemIndex === section.items.length - 1
                )
              )}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text
            style={[styles.versionText, darkMode && styles.darkVersionText]}
          >
            Sentiment Analyzer v1.0.0
          </Text>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  darkScrollView: {
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  darkSectionTitle: {
    color: '#94A3B8',
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  darkSectionContent: {
    backgroundColor: '#1E293B',
    shadowOpacity: 0.2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  darkSettingItem: {
    backgroundColor: '#1E293B',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  darkBorderBottom: {
    borderBottomColor: '#334155',
  },
  settingMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#334155',
  },
  darkSettingLabel: {
    color: '#E2E8F0',
  },
  linkButton: {
    padding: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94A3B8',
  },
  darkVersionText: {
    color: '#64748B',
  },
});
