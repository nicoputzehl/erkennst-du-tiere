import { memo } from "react";
import { QuestionStatus } from "../../../types";
import { ActiveCard } from "./ActiveCard";
import { InactiveCard } from "./InactiveCard";
import { QuestionTileImage } from "./QuestionListImage";
import { SolvedOverlay } from "./SolvedOverlay";
import type { QuestionTileProps } from "../types";

export const QuestionListTile: React.FC<QuestionTileProps> = memo(
	({ item, itemWidth, onClick, quizTitle }) => {
		const isSolved = item.status === QuestionStatus.SOLVED;
		const isInactive = item.status === "inactive";

		if (isInactive) {
			return <InactiveCard itemWidth={itemWidth} />
		}

		return (
			<ActiveCard itemWidth={itemWidth} onPress={() => onClick(item.id)} >
				<QuestionTileImage size={itemWidth} item={item} quizTitle={quizTitle} />
				<SolvedOverlay isVisible={isSolved} />
			</ActiveCard>
		)
	},
);

QuestionListTile.displayName = "QuestionListTile";
