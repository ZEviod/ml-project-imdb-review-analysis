import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Send, Trash2, ChevronDown, ChevronUp } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated';

// Importing components
import { MainLayout } from '@/components/MainLayout';
import { SentimentIndicator } from '@/components/SentimentIndicator';
import { analyzeSentiment } from '@/utils/sentimentAnalysis';
import { useTheme } from '@/contexts/ThemeContext';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { darkMode } = useTheme();
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState<null | {
    sentiment: string;
  }>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const resultOpacity = useSharedValue(0);
  const resultScale = useSharedValue(0.9);

  // Animated style for the results container
  const resultAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: resultOpacity.value,
      transform: [{ scale: resultScale.value }],
    };
  });

  // Removed `score` references and updated to use only `sentiment`
  const handleAnalyze = async () => {
    if (!text.trim()) return;

    Keyboard.dismiss();
    setIsAnalyzing(true);

    try {
      const result = await analyzeSentiment(text);
      setSentiment(result);
      resultOpacity.value = withTiming(1, { duration: 600 });
      resultScale.value = withTiming(1, {
        duration: 500,
        easing: Easing.elastic(1.1),
      });

      // Add to history
      const historyItem = {
        id: Date.now().toString(),
        text,
        result: { sentiment: result.sentiment },
        timestamp: new Date().toISOString(),
      };

      // Get existing history
      const existingHistoryJson = await AsyncStorage.getItem(
        'sentimentHistory'
      );
      const existingHistory = existingHistoryJson
        ? JSON.parse(existingHistoryJson)
        : [];

      // Add new item to the beginning
      const updatedHistory = [historyItem, ...existingHistory.slice(0, 49)]; // Keep the most recent 50

      // Save updated history
      await AsyncStorage.setItem(
        'sentimentHistory',
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearText = () => {
    setText('');
    setSentiment(null);
    resultOpacity.value = withTiming(0, { duration: 300 });
    resultScale.value = withTiming(0.9, { duration: 300 });
    textInputRef.current?.focus();
  };

  // Toggle examples section
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Examples for users to try
  const examples = [
    "A cinematic masterpiece! The visual effects were stunning, and the performances were Oscar-worthy. One of the best films I've seen this year!",
    'A complete waste of time. The plot was predictable, the acting was wooden, and the special effects were laughable.',
    'A decent film with some good moments, but nothing particularly memorable. Worth watching once.',
    'The cinematography was stunning, but the story felt rushed and the characters were underdeveloped.',
    "An instant classic! The director's vision was perfectly executed and the performances were phenomenal.",
  ];

  const handleExamplePress = (example: string) => {
    setText(example);
    setExpanded(false);
    // Scroll to bottom to show the analyze button
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <MainLayout
      title="IMDB Review Sentiment Analysis"
      subtitle="Analyze the sentiment of movie reviews"
      darkMode={darkMode}
    >
      <ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView, darkMode && styles.darkScrollView]}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.examplesHeader}>
          <Text
            style={[styles.examplesTitle, darkMode && styles.darkExamplesTitle]}
          >
            Try a movie review example or write your own
          </Text>
          <TouchableOpacity
            onPress={toggleExpanded}
            style={styles.expandButton}
          >
            {expanded ? (
              <ChevronUp size={20} color={darkMode ? '#94A3B8' : '#64748B'} />
            ) : (
              <ChevronDown size={20} color={darkMode ? '#94A3B8' : '#64748B'} />
            )}
          </TouchableOpacity>
        </View>

        {expanded && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            style={[
              styles.examplesContainer,
              darkMode && styles.darkExamplesContainer,
            ]}
          >
            {examples.map((example, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.exampleItem, darkMode && styles.darkExampleItem]}
                onPress={() => handleExamplePress(example)}
              >
                <Text
                  style={[
                    styles.exampleText,
                    darkMode && styles.darkExampleText,
                  ]}
                  numberOfLines={2}
                >
                  {example}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            ref={textInputRef}
            style={[styles.textInput, darkMode && styles.darkTextInput]}
            placeholder="Enter a movie review to analyze sentiment..."
            placeholderTextColor={darkMode ? '#94A3B8' : '#64748B'}
            multiline
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
          {text.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearText}>
              <Trash2 size={18} color={darkMode ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.analyzeButton,
            (!text.trim() || isAnalyzing) && styles.disabledButton,
          ]}
          onPress={handleAnalyze}
          disabled={!text.trim() || isAnalyzing}
        >
          {isAnalyzing ? (
            <Text style={styles.buttonText}>Analyzing...</Text>
          ) : (
            <>
              <Text style={styles.buttonText}>Analyze Sentiment</Text>
              <Send size={18} color="#FFFFFF" style={styles.sendIcon} />
            </>
          )}
        </TouchableOpacity>

        {sentiment && (
          <Animated.View
            style={[
              styles.resultContainer,
              darkMode && styles.darkResultContainer,
              resultAnimatedStyle,
            ]}
          >
            <Text
              style={[styles.resultTitle, darkMode && styles.darkResultTitle]}
            >
              Analysis Result
            </Text>
            <SentimentIndicator sentiment={sentiment.sentiment} />

            <View
              style={[
                styles.textAnalysisContainer,
                darkMode && styles.darkTextAnalysisContainer,
              ]}
            >
              <Text
                style={[
                  styles.analysisText,
                  darkMode && styles.darkAnalysisText,
                ]}
              >
                {getSentimentFeedback(sentiment.sentiment, text)}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </MainLayout>
  );
}

// Helper function to generate feedback based on sentiment score
function getSentimentFeedback(sentiment: string, text: string): string {
  if (sentiment === 'positive') {
    return `The text expresses a very positive sentiment. The enthusiastic tone and positive words indicate strong approval.`;
  } else if (sentiment === 'neutral') {
    return `The text appears to be neutral with balanced sentiment.`;
  } else {
    return `The text expresses a very negative sentiment. Strong negative words and tone suggest significant dissatisfaction.`;
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  darkScrollView: {
    backgroundColor: '#0F172A',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  examplesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  examplesTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  darkExamplesTitle: {
    color: '#94A3B8',
  },
  expandButton: {
    padding: 4,
  },
  examplesContainer: {
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  darkExamplesContainer: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  exampleItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  darkExampleItem: {
    borderBottomColor: '#334155',
  },
  exampleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#334155',
  },
  darkExampleText: {
    color: '#E2E8F0',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  textInput: {
    height: 150,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
  },
  darkTextInput: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    color: '#E2E8F0',
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  analyzeButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    flexDirection: 'row',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  sendIcon: {
    marginLeft: 8,
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  darkResultContainer: {
    backgroundColor: '#1E293B',
    shadowOpacity: 0.2,
  },
  resultTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  darkResultTitle: {
    color: '#E2E8F0',
  },
  textAnalysisContainer: {
    marginTop: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  darkTextAnalysisContainer: {
    backgroundColor: '#0F172A',
  },
  analysisText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
  },
  darkAnalysisText: {
    color: '#E2E8F0',
  },
});
