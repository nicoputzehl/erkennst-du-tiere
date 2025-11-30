import { ThemedText } from "@/src/common/components/ThemedText";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import type { UsedHint } from "@/src/quiz/types";
import { View } from "react-native";
import sharedHintstyles from "./Hints.styles";

type HintsReceivedProps = {
	hints: UsedHint[];
};

export const HintsReceived = ({ hints }: HintsReceivedProps) => {
	const borderColor = useThemeColor({}, "success");
	if (hints.length === 0) {
		return null;
	}
	return (
		<View>
			{hints.map((hint) => (
				<View
					key={hint.id}
					style={[
						sharedHintstyles.card,
						sharedHintstyles.receivedHint,
						{ borderColor },
					]}
				>
					<ThemedText type="subtitle" style={sharedHintstyles.hintTitle}>
						{hint.title}
					</ThemedText>
					<ThemedText style={sharedHintstyles.hintDescription}>
						{hint.content}
					</ThemedText>
				</View>
			))}
		</View>
	);
};
