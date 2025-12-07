import { describe, expect, it } from 'vitest';

import { ThemeContext, ThemeProvider } from '../theme-context';

describe('ThemeContext', () => {
  describe('exports', () => {
    it('should export ThemeContext', () => {
      // Then: ThemeContext should be defined
      expect(ThemeContext).toBeDefined();
    });

    it('should export ThemeProvider', () => {
      // Then: ThemeProvider should be defined
      expect(ThemeProvider).toBeDefined();
    });

    it('should have ThemeProvider as a function', () => {
      // Then: ThemeProvider should be a function
      expect(typeof ThemeProvider).toBe('function');
    });
  });

  describe('ThemeProvider', () => {
    it('should have displayName', () => {
      // Then: ThemeProvider should have displayName
      expect(ThemeProvider.displayName).toBe('ThemeProvider');
    });
  });

  describe('ThemeContext', () => {
    it('should have Provider property', () => {
      // Then: ThemeContext should have Provider
      expect(ThemeContext.Provider).toBeDefined();
    });

    it('should have Consumer property', () => {
      // Then: ThemeContext should have Consumer
      expect(ThemeContext.Consumer).toBeDefined();
    });
  });
});
