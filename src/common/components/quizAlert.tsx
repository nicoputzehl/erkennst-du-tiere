import { Alert, type AlertButton } from "react-native";

interface AlertProps {
	title: string;
	text: string;
	cancel?: AlertButton;
	confirm?: AlertButton;
}

const quizAlert = ({ title, text, cancel, confirm }: AlertProps) => {
	const buttons: AlertButton[] = [];
	if (cancel) {
		buttons.push(cancel);
	}
	if (confirm) {
		buttons.push(confirm);
	}
	return Alert.alert(title, text, buttons, { cancelable: true });
};

export default quizAlert;
