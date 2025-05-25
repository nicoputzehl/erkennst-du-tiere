import { Platform } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ExternalPathString, Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';

const WIKIPEDIA_URL = 'https://de.wikipedia.org/wiki/';

interface WikipediaLinkProps {
	slug: string;
}

export const WikipediaLink = ({ slug }: WikipediaLinkProps) => {
  // if (!wikipediaPath) return null;
  const link = WIKIPEDIA_URL + slug as ExternalPathString;
	return (
		<Link
			target='_blank'
			href={link}
			onPress={async (event) => {
				if (Platform.OS !== 'web') {
					// Prevent the default behavior of linking to the default browser on native.
					event.preventDefault();
					// Open the link in an in-app browser.
					await openBrowserAsync(link);
				}
			}}
		>
			<FontAwesome6 name='wikipedia-w' size={48} color='black' />
		</Link>
	);
};


