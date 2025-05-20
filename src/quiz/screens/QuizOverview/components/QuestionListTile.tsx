import { useMemo } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import { QuizQuestion } from '../../../types';

interface QuestionListTileProps {
	item: QuizQuestion;
	itemWidth: number;
	onClick: (questionId: string) => void;
}

export const QuestionListTile: React.FC<QuestionListTileProps> = ({
	item,
	itemWidth,
	onClick,
}) => {
	const cardStyle = useMemo(
		() => ({
			width: itemWidth,
			height: itemWidth,
			backgroundColor: item.status === 'solved' ? '#e8f5e9' : '#f5f5f5',
		}),
		[item.status, itemWidth]
	);

	const handleClick = () => {
		onClick(item.id.toString());
	};

	if (item.status === 'inactive') {
		return (
			<View style={[styles.questionCard, cardStyle]}>
				<View style={styles.container}>
					<FontAwesome6 name={'lock'} size={48} color={'gray'} />
				</View>
			</View>
		);
	}

	return (
		<TouchableOpacity
			style={[styles.questionCard, cardStyle]}
			onPress={() => handleClick()}
		>
			<Image source={item.imageUrl} style={styles.image} contentFit='cover' />
			{item.status === 'solved' && (
				<View style={styles.iconOverlay}>
					<FontAwesome6 name={'check'} size={32} color={'green'} />
				</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	questionCard: {
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 8,
	},
	iconOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, 0.1)', // Optional: leichter Overlay für bessere Sichtbarkeit
	},
});
