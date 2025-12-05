import type { StateCreator } from "zustand";
import type { QuizStore } from "../Store";

export interface ToastState {
	id: number;
	visible: boolean;
	message: string;
	type: "success" | "error" | "info" | "warning";
}

export interface UISlice {
	currentQuizId: string | null;
	isLoading: boolean;
	loadingOperations: Set<string>;
	toast: ToastState[] | null;
	toastIdCounter: number;
	navigationHistory: string[];
	setLoading: (operation: string, loading: boolean) => void;
	showToast: (
		message: string,
		type?: ToastState["type"],
	) => void;
	removeToast: (id: number) => void;
	markToastHidden: (id: number) => void;
	hideToast: () => void;
	setCurrentQuiz: (quizId: string | null) => void;
}

export const createUISlice: StateCreator<QuizStore, [], [], UISlice> = (
	set,
	get,
) => ({
	currentQuizId: null,
	isLoading: false,
	loadingOperations: new Set(),
	toast: [],
	toastIdCounter: 0,
	navigationHistory: [],
	setLoading: (operation: string, loading: boolean) => {
		set((state) => {
			const newOperations = new Set(state.loadingOperations);
			if (loading) {
				newOperations.add(operation);
			} else {
				newOperations.delete(operation);
			}
			return {
				loadingOperations: newOperations,
				isLoading: operation === "global" ? loading : newOperations.size > 0,
			};
		});
	},
	showToast: (message: string, type = "info" as const) => {
		const { toastIdCounter } = get();
		const newId = toastIdCounter + 1;

		const newToast: ToastState = {
			id: newId,
			message,
			type,
			visible: true,
		};

		console.log(`[UISlice] Showing ${type} toast with ID ${newId}: ${message}`);

		set((state) => ({
			toast: [...(state.toast || []), newToast],
			toastIdCounter: newId,
		}));
	},
	hideToast: () => {
		set({ toast: null });
	},
	markToastHidden: (id: number) => {
		set((state) => ({
			toast: (state.toast || []).map((toastItem) =>
				toastItem.id === id ? { ...toastItem, visible: false } : toastItem,
			),
		}));
		console.log(`[UISlice] Marking toast with ID ${id} as hidden`);
	},
	removeToast: (id: number) => {
		set((state) => ({
			// Filtern Sie den Toast mit der passenden ID aus dem Array
			toast: (state.toast || []).filter((toastItem) => toastItem.id !== id),
		}));
		console.log(`[UISlice] Hiding toast with ID ${id}`);
	},
	setCurrentQuiz: (quizId: string | null) => {
		set((state) => ({
			currentQuizId: quizId,
			navigationHistory: quizId
				? [
					quizId,
					...state.navigationHistory.filter((id) => id !== quizId),
				].slice(0, 10)
				: state.navigationHistory,
		}));
	},
});
