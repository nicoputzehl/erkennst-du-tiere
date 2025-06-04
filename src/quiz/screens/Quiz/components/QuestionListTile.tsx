import { useMemo, useCallback, memo } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useThemeColor } from '@/src/common/hooks/useThemeColor';
import { useColorScheme } from '@/src/common/hooks/useColorScheme';
import { Question, QuestionStatus } from '../../../types';
import { ImageType, useImageDisplay } from '@/src/quiz/hooks/useImageDisplay';

interface QuestionListTileProps {
	item: Question;
	itemWidth: number;
	onClick: (questionId: string) => void;
}

export const QuestionListTile: React.FC<QuestionListTileProps> = memo(
	({ item, itemWidth, onClick }) => {
		const colorScheme = useColorScheme();
		const { getImageUrl } = useImageDisplay(item);
		const isSolved = item.status === QuestionStatus.SOLVED;
		const isInactive = item.status === 'inactive';



		// Theme-basierte Farben
		const iconColor = useThemeColor({}, 'icon');

		const cardStyle = useMemo(() => {
			return {
				width: itemWidth,
				height: itemWidth,
				backgroundColor: isSolved
					? colorScheme === 'dark'
						? 'rgba(76, 175, 80, 0.2)'
						: 'rgba(76, 175, 80, 0.1)'
					: isInactive
					? colorScheme === 'dark'
						? 'rgba(158, 158, 158, 0.2)'
						: 'rgba(158, 158, 158, 0.1)'
					: colorScheme === 'dark'
					? 'rgba(255, 255, 255, 0.1)'
					: 'rgba(0, 0, 0, 0.05)',
				borderWidth: isSolved ? 2 : 1,
				borderColor: isSolved
					? '#4CAF50'
					: colorScheme === 'dark'
					? 'rgba(255, 255, 255, 0.2)'
					: 'rgba(0, 0, 0, 0.1)',
				shadowColor: colorScheme === 'dark' ? '#000' : '#000',
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
				shadowRadius: 4,
				elevation: 3,
			};
		}, [isSolved, isInactive, itemWidth, colorScheme]);

		const imageStyle = useMemo(
			() => ({
				width: itemWidth - 4, // Account for border
				height: itemWidth - 4,
				borderRadius: 6,
			}),
			[itemWidth]
		);

		const handleClick = useCallback(() => {
			onClick(item.id.toString());
		}, [onClick, item.id]);

		const renderInactiveCard = () => (
			<View style={[styles.questionCard, cardStyle]}>
				<View style={styles.container}>
					<FontAwesome6
						name='lock'
						size={48}
						color={typeof iconColor === 'string' ? iconColor : 'gray'}
					/>
				</View>
			</View>
		);

		const renderActiveCard = () => (
			<TouchableOpacity
				style={[styles.questionCard, cardStyle]}
				onPress={handleClick}
				activeOpacity={0.8}
				accessibilityRole='button'
				accessibilityLabel={`Quiz-Frage ${item.id}${
					isSolved ? ', bereits gelöst' : ''
				}`}
			>
				<Image
					source={getImageUrl(ImageType.THUMBNAIL)}
					style={imageStyle}
					contentFit='cover'
					cachePolicy='memory-disk'
					transition={200}
					placeholder={{ blurhash: 'LGF5]+Yk^37c.8x]M{s-00?b%NWB' }}
				/>
				{isSolved && (
					<View style={styles.iconOverlay}>
						<View style={styles.checkmarkBackground}>
							<FontAwesome6
								name='check'
								size={24}
								color='#fff'
							/>
						</View>
					</View>
				)}
			</TouchableOpacity>
		);

		return isInactive ? renderInactiveCard() : renderActiveCard();
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
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	iconOverlay: {
		position: 'absolute',
		top: 8,
		right: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkmarkBackground: {
		backgroundColor: '#4CAF50',
		borderRadius: 16,
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
	},
});
