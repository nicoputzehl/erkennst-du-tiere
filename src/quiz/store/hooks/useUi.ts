import { useMemo } from "react";
import { useQuizStore } from "../Store";
import { log } from "@/src/common/helper/logging";

export function useUI() {
	const toast = useQuizStore((state) => state.toast);
	const isLoading = useQuizStore((state) => state.isLoading);
	const navigationHistory = useQuizStore((state) => state.navigationHistory);
	const pendingUnlocks = useQuizStore((state) => state.pendingUnlocks);

	const setLoading = useQuizStore((state) => state.setLoading);
	const showToast = useQuizStore((state) => state.showToast);
	const hideToast = useQuizStore((state) => state.hideToast);
	const addPendingUnlock = useQuizStore((state) => state.addPendingUnlock);
	const removeToast = useQuizStore((state) => state.removeToast);
	const markToastHidden = useQuizStore((state) => state.markToastHidden);

	const showSuccess = useMemo(
		() => (message: string) =>
			showToast(message, "success"),
		[showToast],
	);
	const showError = useMemo(
		() => (message: string) =>
			showToast(message, "error"),
		[showToast],
	);
	const showInfo = useMemo(
		() => (message: string) =>
			showToast(message, "info"),
		[showToast],
	);
	const showWarning = useMemo(
		() => (message: string) =>
			showToast(message, "warning"),
		[showToast],
	);

	const getPendingUnlocksCount = useMemo(
		() => () => pendingUnlocks.filter((unlock) => !unlock.shown).length,
		[pendingUnlocks],
	);

	const checkPendingUnlocks = useMemo(
		() => () => {
			const unshown = pendingUnlocks.filter((unlock) => !unlock.shown);

			if (unshown.length > 0) {
				log(
					`[useUI] Found ${unshown.length} unshown unlock notifications`,
				);

				useQuizStore.setState((state) => ({
					pendingUnlocks: state.pendingUnlocks.map((unlock) =>
						unshown.includes(unlock) ? { ...unlock, shown: true } : unlock,
					),
				}));

				unshown.forEach((unlock, index) => {
					setTimeout(
						() => {
							// Idee, Emojis je Quiz
							// Random Messages oder verschiedene
							showSuccess(
								`🥳 Das Quiz "${unlock.quizTitle}" wurde freigespielt!`,
							);
						},
						300 + index * 500,
					);
				});
			}
		},
		[pendingUnlocks, showSuccess],
	);

	return {
		toast,
		isLoading,
		navigationHistory,
		pendingUnlocks,
		setLoading,
		showToast,
		hideToast,
		removeToast,
		markToastHidden,
		showSuccess,
		showError,
		showInfo,
		showWarning,
		addPendingUnlock,

		getPendingUnlocksCount,
		checkPendingUnlocks,
	};
}
