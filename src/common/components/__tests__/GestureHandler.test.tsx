import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { GestureHandler } from "../GestureHandler";

describe("GestureHandler", () => {
	const mockOnSwipeLeft = jest.fn();
	const mockOnSwipeRight = jest.fn();
	const mockOnSwipeUp = jest.fn();
	const mockOnSwipeDown = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders children correctly", () => {
		const { getByText } = render(
			<GestureHandler>
				<Text>Test Child</Text>
			</GestureHandler>,
		);
		expect(getByText("Test Child")).toBeTruthy();
	});

	it("does not call any handler if no movement is detected", () => {
		const { getByTestId } = render(
			<GestureHandler
				onSwipeLeft={mockOnSwipeLeft}
				onSwipeRight={mockOnSwipeRight}
				onSwipeUp={mockOnSwipeUp}
				onSwipeDown={mockOnSwipeDown}
			>
				<Text testID="child">Test Child</Text>
			</GestureHandler>,
		);

		// No gesture events fired, so handlers should not be called
		expect(mockOnSwipeLeft).not.toHaveBeenCalled();
		expect(mockOnSwipeRight).not.toHaveBeenCalled();
		expect(mockOnSwipeUp).not.toHaveBeenCalled();
		expect(mockOnSwipeDown).not.toHaveBeenCalled();
	});

	it("accepts custom thresholds", () => {
		const { getByText } = render(
			<GestureHandler
				dxThreshold={50}
				dyThreshold={50}
				leftThreshold={100}
				rightThreshold={100}
				upThreshold={100}
				downThreshold={100}
			>
				<Text>Test Child</Text>
			</GestureHandler>,
		);
		expect(getByText("Test Child")).toBeTruthy();
	});

	it("renders without any handlers", () => {
		const { getByText } = render(
			<GestureHandler>
				<Text>Test Child</Text>
			</GestureHandler>,
		);
		expect(getByText("Test Child")).toBeTruthy();
	});
});
