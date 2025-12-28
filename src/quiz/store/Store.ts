import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import {
	type StorageValue,
	persist,
	subscribeWithSelector,
} from "zustand/middleware";

import { HintUtils } from "../domain/hints";
import type { UserPointsState } from "../types/hint";


import { type HintSlice, createHintSlice } from "./slices/Hint";
import { type QuizSlice, createQuizSlice } from "./slices/Quiz";
import { type UISlice, createUISlice } from "./slices/UI";

export interface QuizStore extends QuizSlice, HintSlice, UISlice {
	userPoints: UserPointsState;
	clearPersistedData: () => Promise<void>;
}

const STORAGE_KEY = "quiz_store_v1";

type PersistedQuizStore = Pick<
	QuizStore,
	"quizStates" | "navigationHistory" | "pendingUnlocks" | "userPoints"
>;

export const useQuizStore = create<QuizStore>()(
	persist(
		subscribeWithSelector((set, get, store) => ({
			...createQuizSlice(set, get, store),
			...createHintSlice(set, get, store),
			...createUISlice(set, get, store),

			userPoints: HintUtils.getInitialUserPoints(),
			clearPersistedData: async () => {
				try {
					await AsyncStorage.removeItem(STORAGE_KEY);
					set({
						// QuizSlice reset
						quizzes: {},
						quizConfigs: {},
						isQuizDataLoaded: false,
						quizStates: {},
						pendingUnlocks: [],
						userPoints: HintUtils.getInitialUserPoints(),
						// UISlice reset
						currentQuizId: null,
						isLoading: false,
						loadingOperations: new Set(),
						toast: null,
						navigationHistory: [],
					});
				} catch (error) {
					console.error("[QuizStore] Failed to clear persisted data:", error);
					throw error;
				}
			},
		})),
		{
			name: STORAGE_KEY,
			storage: {
				getItem: async (name: string) => {
					try {
						const value = await AsyncStorage.getItem(name);
						return value ? JSON.parse(value) : null;
					} catch (error) {
						console.error(
							`[QuizStore] Failed to get item from storage (${name}):`,
							error,
						);
						throw error;
					}
				},
				setItem: async (
					name: string,
					value: StorageValue<PersistedQuizStore>,
				) => {
					try {
						await AsyncStorage.setItem(name, JSON.stringify(value));
					} catch (error) {
						console.error(
							`[QuizStore] Failed to set item to storage (${name}):`,
							error,
						);
						throw error;
					}
				},
				removeItem: async (name: string) => {
					try {
						await AsyncStorage.removeItem(name);
					} catch (error) {
						console.error(
							`[QuizStore] Failed to remove item from storage (${name}):`,
							error,
						);
						throw error;
					}
				},
			},
			partialize: (state): PersistedQuizStore => ({
				quizStates: state.quizStates,
				navigationHistory: state.navigationHistory,
				pendingUnlocks: state.pendingUnlocks,
				userPoints: state.userPoints,
			}),
			onRehydrateStorage: (state) => {
				console.log(
					"[QuizStore] Rehydrating store - START onRehydrateStorage callback",
				);
				return (persistedState, error) => {
					if (error) {
						console.error("[QuizStore] Hydration failed", error);
						useQuizStore
							.getState()
							.showToast("Fehler beim Laden der Daten!", "error");
					} else {
						console.log(
							"[QuizStore] Hydration successful. Now performing post-hydration tasks.",
						);
						useQuizStore.getState().detectMissedUnlocks();
					}
					console.log(
						"[QuizStore] Rehydrating store - END onRehydrateStorage callback",
					);
				};
			},
		},
	),
);
