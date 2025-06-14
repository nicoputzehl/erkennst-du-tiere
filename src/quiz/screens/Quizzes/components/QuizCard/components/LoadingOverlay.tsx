import { memo } from "react";
import { ActivityIndicator, View } from "react-native";
import { styles } from "../quizCard.styles";

export const LoadingOverlay = memo(() => (
	<View style={styles.loadingOverlay}>
		<ActivityIndicator size="small" color="#fff" />
	</View>
));

LoadingOverlay.displayName = "LoadingOverlay";
