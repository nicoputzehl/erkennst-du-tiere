
import { useHints } from '@/src/quiz/store/hooks/useHints';
import { ScrollView, StyleSheet } from 'react-native';
import { PointsDisplay } from './PointsDisplay';
import ReceivedHints from './ReceivedHints';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

interface HintsContentProps {
  quizId: string;
  questionId: string;
}

export const HintsContent: React.FC<HintsContentProps> = ({
  quizId,
  questionId,
}) => {
  
  const {
    purchasableHints,
    pointsBalance,
    handleUseHint,
    availableHints,
    getUsedHints
  } = useHints(quizId, Number.parseInt(questionId));


  console.log(getUsedHints(quizId, Number.parseInt(questionId)))
  console.table({availableHints})
  
  return (
    <ScrollView style={styles.container}>
      {/* Points Balance */}
      <PointsDisplay quizId={quizId} />
      <ReceivedHints hints={availableHints} />
      
      {/* Available Hints to Purchase */}
      {/* <PurchasableHints 
        hints={purchasableHints}
        onPurchase={handleUseHint}
      /> */}
      
      {/* Already Used Hints */}
      {/* <UsedHints quizId={quizId} questionId={Number.parseInt(questionId)} /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});