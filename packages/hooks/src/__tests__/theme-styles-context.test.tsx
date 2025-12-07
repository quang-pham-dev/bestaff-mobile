import { describe, expect, it } from 'vitest';

import ThemeStylesProvider, {
  ThemeStylesContext,
} from '../theme-styles-context';

describe('ThemeStylesContext', () => {
  describe('exports', () => {
    it('should export ThemeStylesContext', () => {
      // Then: ThemeStylesContext should be defined
      expect(ThemeStylesContext).toBeDefined();
    });

    it('should export ThemeStylesProvider as default', () => {
      // Then: ThemeStylesProvider should be defined
      expect(ThemeStylesProvider).toBeDefined();
    });

    it('should have ThemeStylesProvider as a function', () => {
      // Then: ThemeStylesProvider should be a function
      expect(typeof ThemeStylesProvider).toBe('function');
    });
  });

  describe('ThemeStylesProvider', () => {
    it('should have displayName', () => {
      // Then: ThemeStylesProvider should have displayName
      expect(ThemeStylesProvider.displayName).toBe('ThemeStylesProvider');
    });
  });

  describe('ThemeStylesContext', () => {
    it('should have Provider property', () => {
      // Then: ThemeStylesContext should have Provider
      expect(ThemeStylesContext.Provider).toBeDefined();
    });

    it('should have Consumer property', () => {
      // Then: ThemeStylesContext should have Consumer
      expect(ThemeStylesContext.Consumer).toBeDefined();
    });
  });
});
