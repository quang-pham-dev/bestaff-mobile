import { describe, expect, it } from 'vitest';

import { useThemeValue } from '../use-theme-value';

describe('useThemeValue', () => {
  describe('exports', () => {
    it('should be exported from the module', () => {
      // Then: useThemeValue should be defined
      expect(useThemeValue).toBeDefined();
    });

    it('should be a function', () => {
      // Then: useThemeValue should be a function
      expect(typeof useThemeValue).toBe('function');
    });
  });

  describe('error handling', () => {
    it('should throw when used outside provider', () => {
      // Given: Hook is called outside ThemeProvider

      // When/Then: Should throw
      expect(() => {
        useThemeValue((theme) => theme.colors.primary);
      }).toThrow();
    });
  });
});
