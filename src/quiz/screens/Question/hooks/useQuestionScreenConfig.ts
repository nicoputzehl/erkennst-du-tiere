import { useNavigation } from "expo-router";
import { useEffect } from "react";

export const useQuestionScreenConfig = ({ quizTitle }: { quizTitle?: string }) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitle: quizTitle || 'Zurück',
      title: "",
      headerBackTitleVisible: false,
    });
  }, [navigation, quizTitle]);


};