import { QuizOverviewScreen } from "@/src/quiz/screens/QuizOverview/QuizOverviewScreen";
import { useLocalSearchParams } from "expo-router";

export default function QuizOverviewRoute() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  
  return <QuizOverviewScreen quizId={quizId || null} />;
}