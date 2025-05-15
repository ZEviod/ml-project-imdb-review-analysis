import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SentimentIndicatorProps {
  sentiment: string; // Use `sentiment` directly
}

export const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({
  sentiment,
}) => {
  // Get color based on sentiment
  const getColor = (): [string, string] => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return ['#10B981', '#059669'];
      case 'neutral':
        return ['#A3A3A3', '#737373'];
      case 'negative':
        return ['#EF4444', '#B91C1C'];
      default:
        return ['#3B82F6', '#1D4ED8'];
    }
  };

  // Get emoji based on sentiment
  const getEmoji = () => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return '😄';
      case 'neutral':
        return '😐';
      case 'negative':
        return '😞';
      default:
        return '🙂';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <LinearGradient
          colors={getColor()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.scoreGradient}
        >
          <Text style={styles.emoji}>{getEmoji()}</Text>
          <Text style={styles.label}>{sentiment}</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scoreContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  scoreGradient: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
