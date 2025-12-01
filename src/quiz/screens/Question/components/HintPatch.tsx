import type React from 'react';
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { HintType, type VisibleHint } from '@/src/quiz/types';

type HintPatchProps = {
  hints: VisibleHint[]
};

export const HintPatch: React.FC<HintPatchProps> = ({ hints }) => {
  const [expanded, setExpanded] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;


  if (hints.length === 0) return null;

  const firstletter = hints.find(h => h.type === HintType.FIRST_LETTER);
  const lettercount = hints.find(h => h.type === HintType.LETTER_COUNT);

  let hintText = '';
  if (firstletter && lettercount) {
    hintText = `Hinweis: ${lettercount.value} Buchstaben, beginnt mit ${firstletter.value}`;
  } else if (firstletter) {
    hintText = `Hinweis: Erster Buchstabe ist ${firstletter.value}`;
  } else if (lettercount) {
    hintText = `Hinweis: ${lettercount.value} Buchstaben`;
  } else {
    return null;
  }


  const toggle = () => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.timing(anim, {
      toValue,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const animatedWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '90%'],
  });

  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={toggle}>
        <FontAwesome6 name="lightbulb" size={36} color="gold" />
      </TouchableOpacity>

      <Animated.View style={[styles.container, { width: animatedWidth, opacity: anim }]}>
        <View style={styles.clip}>
          <Text
            style={styles.text}
            numberOfLines={1}
            ellipsizeMode="clip"
          >
            {hintText}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 8,
  },
  container: {
    borderRadius: 6,
    backgroundColor: '#fffbeab0',
    borderWidth: 1,
    borderColor: 'gold',
    overflow: 'hidden',
  },
  clip: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});
