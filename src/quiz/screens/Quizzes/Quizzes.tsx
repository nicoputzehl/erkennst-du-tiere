import { ThemedView } from '@/src/common/components/ThemedView';
import { ThemedText } from '@/src/common/components/ThemedText';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { useThemeColor } from '@/src/common/hooks/useThemeColor';
import { useColorScheme } from '@/src/common/hooks/useColorScheme';
import { Quiz } from '../../types';
import { QuizGrid } from './components/QuizGrid';
import { useQuizzesScreen } from './hooks/useQuizzesScreen';
import Header from '@/src/common/components/Header';

type QuizzesProps = {
	quizzes: Quiz[];
};

export default function QuizzesScreen({ quizzes }: QuizzesProps) {
	const { isLoading } = useQuizzesScreen(quizzes);
	const colorScheme = useColorScheme();

	// Theme-basierte Farben
	const textColor = useThemeColor({}, 'text');
	const tintColor = useThemeColor({}, 'tint');

	const handleNavigateToSettings = () => {
		router.navigate('/settings');
	};

	const renderLoadingState = () => (
		<View style={styles.loadingContainer}>
			<ActivityIndicator
				size='large'
				color={typeof tintColor === 'string' ? tintColor : '#0a7ea4'}
			/>
			<ThemedText
				style={[
					styles.loadingText,
					{ color: typeof tintColor === 'string' ? tintColor : '#0a7ea4' },
				]}
			>
				Quizzes werden geladen...
			</ThemedText>
		</View>
	);

	const renderContent = () => (
		<ScrollView
			style={styles.scrollView}
			contentContainerStyle={styles.scrollContent}
			showsVerticalScrollIndicator={false}
		>
			<QuizGrid quizzes={quizzes} />
		</ScrollView>
	);

	// Dynamische Styles basierend auf Theme
	const dynamicStyles = StyleSheet.create({
		header: {
			...styles.header,
			backgroundColor:
				colorScheme === 'dark'
					? 'rgba(0, 0, 0, 0.2)'
					: 'rgba(255, 255, 255, 0.1)',
			borderBottomWidth: 1,
			borderBottomColor:
				colorScheme === 'dark'
					? 'rgba(255, 255, 255, 0.1)'
					: 'rgba(0, 0, 0, 0.1)',
		},
		settingsButton: {
			...styles.settingsButton,
			backgroundColor:
				colorScheme === 'dark'
					? 'rgba(255, 255, 255, 0.1)'
					: 'rgba(0, 0, 0, 0.1)',
		},
	});

	return (
		<ThemedView
			style={styles.container}
			gradientType='primary' // Nutzt jetzt Colors.gradientPrimary
		>
			<Header
				title='Erkennst du: Tiere'
				rightSlot={
					<TouchableOpacity
						onPress={handleNavigateToSettings}
						style={dynamicStyles.settingsButton}
						activeOpacity={0.7}
						accessibilityLabel='Einstellungen öffnen'
						accessibilityRole='button'
					>
						<FontAwesome6
							name='gear'
							size={24}
							color={typeof textColor === 'string' ? textColor : '#FFFFFF'}
						/>
					</TouchableOpacity>
				}
			/>
			{/* <View style={dynamicStyles.header}>
        <ThemedText 
          type="title" 
          style={[styles.headerTitle, { color: typeof textColor === 'string' ? textColor : '#FFFFFF' }]}
        >
          Erkennst du: Tiere
        </ThemedText>
        <TouchableOpacity
          onPress={handleNavigateToSettings}
          style={dynamicStyles.settingsButton}
          activeOpacity={0.7}
          accessibilityLabel="Einstellungen öffnen"
          accessibilityRole="button"
        >
          <FontAwesome6 
            name="gear" 
            size={24} 
            color={typeof textColor === 'string' ? textColor : '#FFFFFF'} 
          />
        </TouchableOpacity>
      </View> */}

			{isLoading ? renderLoadingState() : renderContent()}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 12,
		marginBottom: 8,
	},
	headerTitle: {
		flex: 1,
		textAlign: 'center',
		marginRight: 40, // Kompensiert Settings-Button für perfekte Zentrierung
	},
	settingsButton: {
		padding: 10,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
		alignItems: 'center',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
		paddingTop: 8,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		textAlign: 'center',
		opacity: 0.8,
	},
});
