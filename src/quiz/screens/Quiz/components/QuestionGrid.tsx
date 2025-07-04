import { QuestionListTile } from "@/src/quiz/screens/Quiz/components/QuestionListTile";
import type { Question } from "@/src/quiz/types";
import type React from "react";
import { useCallback, useMemo } from "react";
import { FlatList, type ListRenderItem } from "react-native";
import { QUIZ_LAYOUT } from "../constants/constants";

interface QuestionGridProps {
	questions: Question[];
	itemWidth: number;
	onQuestionClick: (questionId: string) => void;
}

export const QuestionGrid: React.FC<QuestionGridProps> = ({
	questions,
	itemWidth,
	onQuestionClick,
}) => {
	const renderItem: ListRenderItem<Question> = useCallback(
		({ item }) => (
			<QuestionListTile
				item={item}
				itemWidth={itemWidth}
				onClick={onQuestionClick}
			/>
		),
		[itemWidth, onQuestionClick],
	);

	const keyExtractor = useCallback((item: Question) => item.id.toString(), []);

	const flatListProps = useMemo(
		() => ({
			numColumns: QUIZ_LAYOUT.numColumns as 3,
			columnWrapperStyle: {
				gap: QUIZ_LAYOUT.gap,
				justifyContent: "center" as const,
			},
			contentContainerStyle: {
				gap: QUIZ_LAYOUT.gap,
				justifyContent: "flex-start" as const,
				alignItems: "center" as const,
				flexGrow: 1,
			},
			showsVerticalScrollIndicator: false,
			removeClippedSubviews: true,
			maxToRenderPerBatch: 15,
			updateCellsBatchingPeriod: 50,
			initialNumToRender: 21, // 3x7 für optimale Performance
			windowSize: 7,
			getItemLayout: (_data: any, index: number) => ({
				length: itemWidth + QUIZ_LAYOUT.gap,
				offset: (itemWidth + QUIZ_LAYOUT.gap) * Math.floor(index / 3),
				index,
			}),
		}),
		[itemWidth],
	);

	return (
		<FlatList
			data={questions}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			{...flatListProps}
		/>
	);
};
