import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AlreadyAnsweredProps {
  funFact?: string;
}

export const AlreadyAnswered: React.FC<AlreadyAnsweredProps> = ({ funFact }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Die Frage hast du bereits beantwortet!
      </Text>
      {funFact && (
        <Text style={styles.funFact}>{funFact}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'green',
    marginBottom: 12,
  },
  funFact: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 20,
  },
});