import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';
import { QUESTION_CONSTANTS } from '../constants/constants';

interface QuestionImageProps {
  imageUrl: string;
}

export const QuestionImage: React.FC<QuestionImageProps> = ({ imageUrl }) => {
  return (
    <Image
      source={imageUrl}
      style={styles.image}
      contentFit="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: QUESTION_CONSTANTS.imageHeight,
  },
});