import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface SentimentBadgeProps {
  sentiment: string;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment }) => {
  const getColors = () => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          text: '#10B981',
          border: 'rgba(16, 185, 129, 0.3)',
        };
      case 'negative':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          text: '#EF4444',
          border: 'rgba(239, 68, 68, 0.3)',
        };
      case 'neutral':
        return {
          bg: 'rgba(148, 163, 184, 0.1)',
          text: '#64748B',
          border: 'rgba(148, 163, 184, 0.3)',
        };
      default:
        return {
          bg: 'rgba(59, 130, 246, 0.1)',
          text: '#3B82F6',
          border: 'rgba(59, 130, 246, 0.3)',
        };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
          },
        ]}
      >
        {sentiment}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    textTransform: 'capitalize',
  },
});