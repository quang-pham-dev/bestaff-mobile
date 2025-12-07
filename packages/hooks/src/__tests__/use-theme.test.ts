import { describe, expect, it } from 'vitest';

import { useTheme } from '../use-theme';

describe('useTheme', () => {
  describe('exports', () => {
    it('should be exported from the module', () => {
      // Then: useTheme should be defined
      expect(useTheme).toBeDefined();
    });

    it('should be a function', () => {
      // Then: useTheme should be a function
      expect(typeof useTheme).toBe('function');
    });
  });

  describe('error handling', () => {
    it('should throw when used outside provider', () => {
      // Given: Hook is called outside ThemeProvider

      // When/Then: Should throw (any error, since context is null in test env)
      expect(() => {
        useTheme();
      }).toThrow();
    });
  });
});
