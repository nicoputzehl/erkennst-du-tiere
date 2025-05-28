import { useMemo, useCallback, memo } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { QuestionStatus, QuizQuestion } from '../../../types'; // Vereinfachte Types ohne Generics
import { ImageType, useImageDisplay } from '@/src/quiz/hooks/useImageDisplay';

interface QuestionListTileProps {
	item: QuizQuestion;
	itemWidth: number;
	onClick: (questionId: string) => void;
}

export const QuestionListTile: React.FC<QuestionListTileProps> = memo(
	({ item, itemWidth, onClick }) => {
		const { getImageUrl } = useImageDisplay(item);
		const isSolved = item.status === QuestionStatus.SOLVED;

		const cardStyle = useMemo(
			() => ({
				width: itemWidth,
				height: itemWidth,
				backgroundColor: isSolved ? 'rgba(rgba(0, 150, 0, 0.1))' : '#f5f5f5',
			}),
			[isSolved, itemWidth]
		);

		const imageStyle = useMemo(
			() => ({
				width: itemWidth,
				height: itemWidth,
				borderRadius: 8,
			}),
			[itemWidth]
		);

		const handleClick = useCallback(() => {
			onClick(item.id.toString());
		}, [onClick, item.id]);

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
				onPress={handleClick}
			>
				<Image
					source={getImageUrl(ImageType.THUMBNAIL)}
					style={imageStyle}
					contentFit='contain'
					cachePolicy='memory-disk'
					transition={200}
				/>
				{isSolved && (
					<View style={styles.iconOverlay}>
						<FontAwesome6 name={'check'} size={32} color={'green'} />
					</View>
				)}
			</TouchableOpacity>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.item.id === nextProps.item.id &&
			prevProps.item.status === nextProps.item.status &&
			prevProps.item.images.imageUrl === nextProps.item.images.imageUrl &&
			prevProps.item.images.thumbnailUrl ===
				nextProps.item.images.thumbnailUrl &&
			prevProps.item.images.unsolvedImageUrl ===
				nextProps.item.images.unsolvedImageUrl &&
			prevProps.item.images.unsolvedThumbnailUrl ===
				nextProps.item.images.unsolvedThumbnailUrl &&
			prevProps.itemWidth === nextProps.itemWidth &&
			prevProps.onClick === nextProps.onClick
		);
	}
);

QuestionListTile.displayName = 'QuestionListTile';

const styles = StyleSheet.create({
	questionCard: {
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
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
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},
});