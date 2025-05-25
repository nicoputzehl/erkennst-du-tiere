import { Image } from 'expo-image';
import React, { memo } from 'react';
import { StyleSheet, Animated } from 'react-native';

interface QuestionImageProps {
  imageUrl: string;
  thumbnailUrl?: string;
  animatedHeight?: Animated.Value;
}

export const QuestionImage: React.FC<QuestionImageProps> = memo(({ 
  imageUrl, 
  thumbnailUrl,
  animatedHeight
}) => {

  return (
    <Animated.View style={[
      styles.container, 
      animatedHeight && { height: animatedHeight }
    ]}>
        <Image
          source={imageUrl}
          style={[styles.image, thumbnailUrl && styles.fullImageOverlay]}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={thumbnailUrl ? 400 : 300}
          priority="high"
          placeholder={!thumbnailUrl ? require('@/assets/images/placeholder.jpg') : undefined}
          placeholderContentFit="cover"
          onError={(error) => {
            console.warn(`Failed to load question image:`, error);
          }}
          allowDownscaling={true}
          recyclingKey={imageUrl}
        />
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  return prevProps.imageUrl === nextProps.imageUrl && 
         prevProps.thumbnailUrl === nextProps.thumbnailUrl &&
         prevProps.animatedHeight === nextProps.animatedHeight;
});

QuestionImage.displayName = 'QuestionImage';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 400, // Default height, wird durch animatedHeight überschrieben
    backgroundColor: '#f5f5f5', 
    borderRadius: 0,
    overflow: 'hidden',
    position: 'relative',
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