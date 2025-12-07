import { describe, expect, it } from 'vitest';

import { useThemeColor } from '../use-theme-color';

describe('useThemeColor', () => {
  describe('exports', () => {
    it('should be exported from the module', () => {
      // Then: useThemeColor should be defined
      expect(useThemeColor).toBeDefined();
    });

    it('should be a function', () => {
      // Then: useThemeColor should be a function
      expect(typeof useThemeColor).toBe('function');
    });
  });

  describe('error handling', () => {
    it('should throw when used outside provider', () => {
      // Given: Hook is called outside ThemeProvider

      // When/Then: Should throw
      expect(() => {
        useThemeColor({}, 'primary');
      }).toThrow();
    });
  });
});
