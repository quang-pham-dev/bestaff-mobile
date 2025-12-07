import { describe, expect, it } from 'vitest';

import { useThemeStyles } from '../use-theme-styles';

describe('useThemeStyles', () => {
  describe('exports', () => {
    it('should be exported from the module', () => {
      // Then: useThemeStyles should be defined
      expect(useThemeStyles).toBeDefined();
    });

    it('should be a function', () => {
      // Then: useThemeStyles should be a function
      expect(typeof useThemeStyles).toBe('function');
    });
  });

  describe('error handling', () => {
    it('should throw when used outside provider', () => {
      // Given: Hook is called outside ThemeStylesProvider

      // When/Then: Should throw (will throw from useTheme first)
      expect(() => {
        useThemeStyles();
      }).toThrow();
    });
  });
});
