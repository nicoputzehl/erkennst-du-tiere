import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { getDefaultConfig } from 'expo/metro-config';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
export default config;