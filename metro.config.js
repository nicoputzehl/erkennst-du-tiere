import { getDefaultConfig } from 'expo/metro-config';

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
export default config;