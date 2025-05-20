import React, { createContext, useContext, ReactNode } from 'react';
import * as ProgressService from '../services/progressTracker';

interface ProgressTrackerContextType {
	getQuizProgress: (quizId: string) => number;
	getQuizProgressString: (quizId: string) => string | null;
	isQuizCompleted: (quizId: string) => boolean;
	getNextActiveQuestion: (
		quizId: string,
		currentQuestionId?: number
	) => number | null;
}

const ProgressTrackerContext = createContext<ProgressTrackerContextType | null>(
	null
);

export function ProgressTrackerProvider({ children }: { children: ReactNode }) {
	const contextValue: ProgressTrackerContextType = {
		getQuizProgress: ProgressService.getQuizProgress,
		getQuizProgressString: ProgressService.getQuizProgressString,
		isQuizCompleted: ProgressService.isQuizCompleted,
		getNextActiveQuestion: ProgressService.getNextActiveQuestion,
	};

	return (
		<ProgressTrackerContext.Provider value={contextValue}>
			{children}
		</ProgressTrackerContext.Provider>
	);
}

export function useProgressTracker() {
	const context = useContext(ProgressTrackerContext);
	if (!context) {
		throw new Error(
			'useProgressTracker must be used within a ProgressTrackerProvider'
		);
	}
	return context;
}
