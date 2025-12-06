import { Options, defineConfig } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: {
    index: 'src/index.ts',
  },
  banner: {
    js: "'use client'",
  },
  clean: true,
  format: ['cjs', 'esm'],
  external: [
    'react',
    'react-native',
    'expo',
    'expo-router',
    '@expo/vector-icons',
    'expo-av',
    'react-dom',
    '@bestaff/hooks',
    '@bestaff/theme',
    '@bestaff/utils',
  ],
  dts: true,
  ...options,
}));
