import { useLocalSearchParams } from "expo-router";
import { HintsScreen } from "@/src/quiz/screens/Hints/HintsScreen";

export default function HintsRoute() {
  const { quizId, questionId } = useLocalSearchParams<{
    quizId: string;
    questionId: string;
  }>();

  return (
    <HintsScreen 
      quizId={quizId || null} 
      questionId={questionId || null} 
    />
  );
}