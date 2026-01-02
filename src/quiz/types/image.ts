export interface QuizImages {
	imageUrl: number;
	thumbnailUrl?: number;
	unsolvedImageUrl?: number;
	unsolvedThumbnailUrl?: number;

	imageName?: string;              // z.B. "question_12"
	unsolvedImageName?: string;
}
