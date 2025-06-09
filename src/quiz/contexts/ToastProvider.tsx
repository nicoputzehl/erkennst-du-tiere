import type React from "react";
import { type ReactNode, createContext, useContext, useState } from "react";
import { Toast, type ToastProps } from "../components/Toast";

type ToastData = Omit<ToastProps, "visible" | "onHide">;

interface ToastContextType {
	showToast: (data: ToastData) => void;
	showSuccessToast: (message: string, duration?: number) => void;
	showErrorToast: (message: string, duration?: number) => void;
	showInfoToast: (message: string, duration?: number) => void;
	showWarningToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [toastData, setToastData] = useState<ToastData | null>(null);
	const [visible, setVisible] = useState(false);

	const showToast = (data: ToastData) => {
		setToastData(data);
		setVisible(true);
	};

	const hideToast = () => {
		setVisible(false);
		setTimeout(() => {
			setToastData(null);
		}, 300); // Wait for animation to complete
	};

	const showSuccessToast = (message: string, duration?: number) => {
		showToast({ message, type: "success", duration });
	};

	const showErrorToast = (message: string, duration?: number) => {
		showToast({ message, type: "error", duration });
	};

	const showInfoToast = (message: string, duration?: number) => {
		showToast({ message, type: "info", duration });
	};

	const showWarningToast = (message: string, duration?: number) => {
		showToast({ message, type: "warning", duration });
	};

	const contextValue: ToastContextType = {
		showToast,
		showSuccessToast,
		showErrorToast,
		showInfoToast,
		showWarningToast,
	};

	return (
		<ToastContext.Provider value={contextValue}>
			{children}
			{toastData && (
				<Toast visible={visible} onHide={hideToast} {...toastData} />
			)}
		</ToastContext.Provider>
	);
};

export const useToast = (): ToastContextType => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
