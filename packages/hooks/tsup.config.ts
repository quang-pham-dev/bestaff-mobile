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
    'expo-haptics',
    'expo-secure-store',
    'react-native-reanimated',
  ],
  dts: true,
  ...options,
}));
