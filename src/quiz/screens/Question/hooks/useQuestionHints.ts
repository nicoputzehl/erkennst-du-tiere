import { useCallback, useState } from "react";

export function useQuestionHints() {
	const [isContextualHintVisible, setIsContextualHintVisible] = useState(false);
	const [contextualHintContent, setContextualHintContent] =
		useState<string>("");
	const [isAutoFreeHintVisible, setIsAutoFreeHintVisible] = useState(false);
	const [autoFreeHintContent, setAutoFreeHintContent] = useState<string>("");

	const [purchasedHints, setPurchasedHints] = useState<string[]>([]);

	const handleContextualHintClose = useCallback(() => {
		setIsContextualHintVisible(false);
	}, []);

	const handleAutoFreeHintClose = useCallback(() => {
		setIsAutoFreeHintVisible(false);
	}, []);

	const addPurchasedHint = useCallback((content: string) => {
		setPurchasedHints((prev) => [...prev, content]);
	}, []);

	const resetContextualHints = useCallback(() => {
		setContextualHintContent("");
		setAutoFreeHintContent("");
	}, []);

	const handleHintPurchased = useCallback(
		(content: string) => {
			addPurchasedHint(content);
		},
		[addPurchasedHint],
	);

	return {
		contextualHintContent,
		setContextualHintContent,
		isContextualHintVisible,
		setIsContextualHintVisible,
		handleContextualHintClose,
		resetContextualHints,

		autoFreeHintContent,
		setAutoFreeHintContent,
		isAutoFreeHintVisible,
		setIsAutoFreeHintVisible,
		handleAutoFreeHintClose,

		purchasedHints,
		handleHintPurchased,
	};
}
