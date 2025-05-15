import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Trash2, RefreshCcw, Copy } from 'lucide-react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import { MainLayout } from '@/components/MainLayout';
import { SentimentBadge } from '@/components/SentimentBadge';
import { useTheme } from '@/contexts/ThemeContext';

interface HistoryItem {
  id: string;
  text: string;
  result: {
    sentiment: string;
  };
  timestamp: string;
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { darkMode } = useTheme();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load history from AsyncStorage on component mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistoryJson = await AsyncStorage.getItem('sentimentHistory');
      const savedHistory = savedHistoryJson ? JSON.parse(savedHistoryJson) : [];
      setHistory(savedHistory);
    } catch (error) {
      console.error('Failed to load history:', error);
      setHistory([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all analysis history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('sentimentHistory', '[]');
              setHistory([]);
            } catch (error) {
              console.error('Failed to clear history:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const updatedHistory = history.filter((item) => item.id !== id);
      setHistory(updatedHistory);
      await AsyncStorage.setItem(
        'sentimentHistory',
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleCopyText = (text: string) => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(text);
    }
    Alert.alert('Copied', 'Text copied to clipboard');
  };

  const handleItemPress = (item: HistoryItem) => {
    router.push({
      pathname: '/',
      params: { text: item.text },
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, darkMode && styles.darkEmptyTitle]}>
        No History Yet
      </Text>
      <Text style={[styles.emptyText, darkMode && styles.darkEmptyText]}>
        Your sentiment analysis history will appear here once you analyze some
        text.
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <Animated.View
      entering={FadeInRight.duration(300)}
      exiting={FadeOutLeft.duration(200)}
      style={[styles.historyCard, darkMode && styles.darkHistoryCard]}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.timestamp, darkMode && styles.darkTimestamp]}>
            {formatDate(item.timestamp)}
          </Text>
          <SentimentBadge sentiment={item.result.sentiment} />
        </View>

        <Text
          style={[styles.textPreview, darkMode && styles.darkTextPreview]}
          numberOfLines={3}
        >
          {item.text}
        </Text>

        <View style={[styles.cardActions, darkMode && styles.darkCardActions]}>
          <TouchableOpacity
            onPress={() => handleCopyText(item.text)}
            style={styles.actionButton}
          >
            <Copy size={16} color={darkMode ? '#94A3B8' : '#64748B'} />
            <Text
              style={[styles.actionText, darkMode && styles.darkActionText]}
            >
              Copy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteItem(item.id)}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <MainLayout
      title="History"
      subtitle="Your previous sentiment analyses"
      darkMode={darkMode}
      actionComponent={
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearHistory}
          disabled={history.length === 0}
        >
          <Text
            style={[
              styles.clearButtonText,
              history.length === 0 && styles.disabledText,
            ]}
          >
            Clear All
          </Text>
        </TouchableOpacity>
      }
    >
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyComponent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkHistoryCard: {
    backgroundColor: '#1E293B',
    shadowOpacity: 0.2,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  darkTimestamp: {
    color: '#94A3B8',
  },
  textPreview: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
    marginBottom: 16,
  },
  darkTextPreview: {
    color: '#E2E8F0',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  darkCardActions: {
    borderTopColor: '#334155',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  deleteButton: {
    justifyContent: 'flex-end',
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  darkActionText: {
    color: '#94A3B8',
  },
  deleteText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 4,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#EF4444',
  },
  disabledText: {
    color: '#94A3B8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#334155',
    marginBottom: 8,
  },
  darkEmptyTitle: {
    color: '#E2E8F0',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  darkEmptyText: {
    color: '#94A3B8',
  },
});
