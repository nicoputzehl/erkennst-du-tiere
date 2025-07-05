import { router } from "expo-router";

export const NavigationService = {
  toQuiz: (id: string) => router.push(`/quiz/${id}`),
  toQuestion: (quizId: string, questionId: string) => 
    router.push(`/quiz/${quizId}/${questionId}`),
  toHints: (quizId: string, questionId: string) => 
    router.push(`/quiz/${quizId}/${questionId}/hints-modal`),
  back: () => router.back(),
  toSettings: () => router.push(`/settings`)
};