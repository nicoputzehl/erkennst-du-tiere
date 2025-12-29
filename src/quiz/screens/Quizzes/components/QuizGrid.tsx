import type { Quiz } from "@/src/quiz/types"; // Vereinfachte Types ohne Generics
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { QuizCard } from "./QuizCard/QuizCard";
import { log } from "@/src/common/helper/logging";

type QuizGridProps = {
	quizzes: Quiz[];
};

export const QuizGrid = ({ quizzes }: QuizGridProps) => {
	// Debug-Logging
	useEffect(() => {
		log(`[QuizGrid] Rendering ${quizzes.length} quizzes`);
		for (const quiz of quizzes) {
			log(`[QuizGrid] Quiz: ${quiz.id} - ${quiz.title}`);
		}
	}, [quizzes]);
log({quizzes})
	return (
		<View style={styles.grid}>
			{quizzes.map((quiz) => (
				<QuizCard key={quiz.id} quiz={quiz} />
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 16,
	},
});
