import { View } from "react-native";
import { useUI } from "../store";
import AnimatedToast from "./AnimatedToast";

export function ToastContainer() {
	const { toast: toasts, removeToast, markToastHidden } = useUI();

	if (!toasts || toasts.length === 0) return null;

	return (
		<View
			pointerEvents="box-none"
			style={{
				position: "absolute",
				top: 40,
				left: 0,
				right: 0,
				zIndex: 9999,
			}}
		>
			{toasts.map((t, index) => (
				<AnimatedToast
					key={t.id}
					toast={t}
					index={index}
					markHidden={() => markToastHidden(t.id)}
					onRemove={() => {
						console.log("[ToastContainer] removeToast", t.id);
						removeToast(t.id);
					}}
				/>
			))}
		</View>
	);
}
