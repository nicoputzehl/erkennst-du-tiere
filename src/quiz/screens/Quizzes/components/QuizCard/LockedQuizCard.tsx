import { UnlockProgress } from "@/src/quiz/contexts/UnlockManagerProvider";
import { Quiz } from "@/src/quiz/types";
import { View, Text, StyleSheet } from "react-native";

type LockedQuizCardProps = {
  quiz: Quiz;
  unlockProgress: UnlockProgress | null;
};

export const LockedQuizCard = ({ quiz, unlockProgress }: LockedQuizCardProps) => {

  return (
    <View style={styles.lockedContainer}>
      {/* Erste Karte mit Titel und Schloss */}
      <View style={[styles.quizCard, styles.locked]}>
        <Text style={[styles.quizTitle, styles.lockedText]}>
          {quiz.title} {'🔒'}
        </Text>
      </View>

      {/* Zweite Karte mit Bedingungen */}
      <View style={[styles.quizCard, styles.locked]}>
        {unlockProgress?.condition && (
          <View style={styles.unlockInfo}>
            <Text>{unlockProgress.condition.description}</Text>
            <Text style={styles.unlockProgress}>
              Fortschritt: {unlockProgress.progress.toFixed(0)}
              {unlockProgress.condition.type === 'percentage'
                ? '%'
                : unlockProgress.condition.type === 'completionCount'
                ? ` von ${unlockProgress.condition.requiredCount}`
                : ''}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
	lockedContainer: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
	},
	quizCard: {
		backgroundColor: '#f5f5f5',
		padding: 16,
		borderRadius: 8,
		flex: 1,
		height: 100,
		maxWidth: '47%',
		minWidth: '47%',
	},
	quizTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 8,
		zIndex: 1,
	},
	locked: {
		backgroundColor: '#e0e0e0',
		opacity: 0.6,
	},
	lockedText: {
		color: '#666',
	},
	unlockInfo: {
		marginTop: 8,
	},
	unlockDescription: {
		fontSize: 12,
		color: '#888',
		fontStyle: 'italic',
	},
	unlockProgress: {
		fontSize: 12,
		color: '#666',
		fontWeight: '500',
		marginTop: 4,
	},
});
