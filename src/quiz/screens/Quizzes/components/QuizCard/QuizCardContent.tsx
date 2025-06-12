import { ThemedText } from "@/src/common/components/ThemedText";
import { memo, useCallback, useEffect } from "react";
import { TouchableOpacity, View, type ViewStyle } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence
} from 'react-native-reanimated';
import { styles } from "./QuizCard.styles";
import type { QuizCardViewProps } from "./QuizCard.types";
import { QuizCardProgress } from "./QuizCardProgress";
import {
  LoadingOverlay,
  LockIcon,
  QuizCardImage,
  UnlockProgress,
} from "./components";

// TODO: IDEA Wenn eine Karte neu freigeschaltet wurde, dann wird sie erst freigeschaltet, wenn man auf den Screen kommt
// mit Animation des Titels

const QuizCardStartItem = memo(
  ({ variant, quiz }: Pick<QuizCardViewProps, "variant" | "quiz">) => {
    if (variant === "locked") {
      return (
        <View style={styles.quizCardStartItem}>
          <LockIcon />
        </View>
      );
    }
    return (
      <View style={styles.quizCardStartItem}>
        <QuizCardImage quiz={quiz} />
      </View>
    );
  },
);
QuizCardStartItem.displayName = "QuizCardStartItem";

const QuizCardProgressSection = memo(
  ({
    variant,
    unlockProgress,
    quizCardProgress,
    quizCardProgressString,
  }: Pick<
    QuizCardViewProps,
    "variant" | "unlockProgress" | "quizCardProgress" | "quizCardProgressString"
  >) => {
    if (variant === "locked") {
      return <UnlockProgress unlockProgress={unlockProgress} />;
    }
    return (
      <View style={styles.activeProgressContainer}>
        <QuizCardProgress
          quizCardProgress={quizCardProgress ?? 0}
          quizCardProgressString={quizCardProgressString ?? null}
        />
      </View>
    );
  },
);
QuizCardProgressSection.displayName = "QuizCardProgressSection";

export const QuizCardContent = memo(
  ({
    quiz,
    variant,
    onPress,
    isLoading = false,
    quizCardProgress,
    quizCardProgressString,
    unlockProgress,
  }: QuizCardViewProps) => {
    const rotation = useSharedValue(0);
    const isNewCard = variant === "active" && !quizCardProgress;

    useEffect(() => {
      if (isNewCard) {
        // 300ms Timeout vor dem Start der Wackel Animation
        const timer = setTimeout(() => {
          rotation.value = withSequence(
            withSpring(-3, { damping: 1500, stiffness: 8000 }),
            withSpring(3, { damping: 1500, stiffness: 8000 }),
            withSpring(-2, { damping: 1500, stiffness: 8000 }),
            withSpring(2, { damping: 1500, stiffness: 8000 }),
            withSpring(0, { damping: 1500, stiffness: 8000 })
          );
        }, 150);

        return () => clearTimeout(timer);
      }
    }, [isNewCard, rotation]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotate: `${rotation.value}deg` }],
      };
    });

    const getCardStyle = useCallback((): ViewStyle[] => {
      const baseStyle: ViewStyle[] = [styles.quizCardOuter];
      if (variant === "locked") {
        baseStyle.push(styles.locked);
      } else {
        // if (!quizCardProgress) baseStyle.push(styles.new);
        if (isLoading) baseStyle.push(styles.loadingCard);
      }
      return baseStyle;
    }, [variant, isLoading]);

    const handlePress = useCallback(() => {
      if (variant === "active" && onPress) {
        onPress(quiz.id);
      }
    }, [variant, onPress, quiz.id]);

    const innerContent = (
      <View style={styles.quizCardInner}>
        <QuizCardStartItem variant={variant} quiz={quiz} />
        <View style={styles.quizCardContent}>
          <ThemedText style={styles.quizTitle} numberOfLines={2}>
            {quiz.title}
          </ThemedText>
          <QuizCardProgressSection
            variant={variant}
            unlockProgress={unlockProgress}
            quizCardProgress={quizCardProgress}
            quizCardProgressString={quizCardProgressString}
          />
        </View>
      </View>
    );

    if (variant === "locked") {
      return <View style={getCardStyle()}>{innerContent}</View>;
    }

    // Wrappen mit Animated.View für neue Karten
    const CardWrapper = isNewCard ? Animated.View : View;
    const wrapperStyle = isNewCard ? [getCardStyle(), animatedStyle] : getCardStyle();

    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <CardWrapper style={wrapperStyle}>
          {isLoading ? <LoadingOverlay /> : innerContent}
        </CardWrapper>
      </TouchableOpacity>
    );
  },
);
QuizCardContent.displayName = "QuizCardView";