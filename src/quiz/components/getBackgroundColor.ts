import type { ToastType } from "../store/slices/UI";

	export const getBackgroundColor = (type: ToastType) => {
		switch (type) {
			case "success":
				return "#4CAF50";
			case "error":
				return "#F44336";
			case "warning":
				return "#FF9800";
			default:
				return "#2196F3";
		}
	};