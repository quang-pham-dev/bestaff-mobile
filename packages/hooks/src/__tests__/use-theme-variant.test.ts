import { describe, expect, it } from 'vitest';

import { useThemeVariant } from '../use-theme-variant';

describe('useThemeVariant', () => {
  describe('exports', () => {
    it('should be exported from the module', () => {
      // Then: useThemeVariant should be defined
      expect(useThemeVariant).toBeDefined();
    });

    it('should be a function', () => {
      // Then: useThemeVariant should be a function
      expect(typeof useThemeVariant).toBe('function');
    });
  });

  describe('error handling', () => {
    it('should throw when used outside provider', () => {
      // Given: Hook is called outside ThemeProvider
      const variants = {
        primary: () => ({ color: 'blue' }),
      };

      // When/Then: Should throw
      expect(() => {
        useThemeVariant(variants, 'primary');
      }).toThrow();
    });
  });
});
