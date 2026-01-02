import type { Question } from "@/src/quiz/types";
import type { PropsWithChildren } from "react";

export interface BaseTileProps {
  itemWidth: number;
}

export interface ClickableTileProps {
  onClick: (questionId: Question["id"]) => void;
}

export interface QuestionTileProps extends BaseTileProps, ClickableTileProps {
  item: Question;
  quizTitle?: string;
}

export type ActiveCardProps = BaseTileProps &
  PropsWithChildren & {
    onPress: () => void;
  };

export type InactiveCardProps = BaseTileProps;

export type QuestionTileImageProps = {
  item: Question;
  size: number;
  quizTitle?: string;
};


export type SolvedOverlayProps = {
  isVisible: boolean;
};