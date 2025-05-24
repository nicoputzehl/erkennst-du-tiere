import { Image } from 'expo-image';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { QUESTION_CONSTANTS } from '../constants/constants';

interface QuestionImageProps {
  imageUrl: string;
  thumbnailUrl?: string;
}

export const QuestionImage: React.FC<QuestionImageProps> = memo(({ 
  imageUrl, 
  thumbnailUrl 
}) => {



  return (
    <View style={styles.container}>
        <Image
          source={imageUrl}
          style={[styles.image, thumbnailUrl && styles.fullImageOverlay]}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={thumbnailUrl ? 400 : 300} // Slower transition if replacing thumbnail
          priority="high"
          placeholder={!thumbnailUrl ? require('@/assets/images/placeholder.jpg') : undefined}
          placeholderContentFit="cover"
          onError={(error) => {
            console.warn(`Failed to load question image:`, error);
          }}
          allowDownscaling={true}
          recyclingKey={imageUrl}
        />
    </View>
  );
}, (prevProps, nextProps) => {
  // Memo comparison - re-rendern wenn imageUrl oder thumbnailUrl ändert
  return prevProps.imageUrl === nextProps.imageUrl && 
         prevProps.thumbnailUrl === nextProps.thumbnailUrl;
});

QuestionImage.displayName = 'QuestionImage';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: QUESTION_CONSTANTS.imageHeight,
    backgroundColor: '#f5f5f5', // Fallback Hintergrund
    borderRadius: 0, // Optional: abgerundete Ecken
    overflow: 'hidden',
    position: 'relative', // Für Overlay-Positioning
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fullImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});