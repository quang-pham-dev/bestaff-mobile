import { describe, expect, it } from 'vitest';

import { useColorScheme } from '../use-color-scheme';

describe('useColorScheme', () => {
  describe('re-export verification', () => {
    it('should be exported from the module', () => {
      // Given: The useColorScheme hook is imported

      // When: We check if it's defined

      // Then: It should be defined
      expect(useColorScheme).toBeDefined();
    });

    it('should be a function', () => {
      // Given: The useColorScheme hook

      // Then: It should be a function
      expect(typeof useColorScheme).toBe('function');
    });
  });
});
