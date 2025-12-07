import { describe, expect, it } from 'vitest';

import { useIsFirstTime } from '../use-is-first-time';

describe('useIsFirstTime', () => {
  describe('exports', () => {
    it('should be exported from the module', () => {
      // Then: useIsFirstTime should be defined
      expect(useIsFirstTime).toBeDefined();
    });

    it('should be a function', () => {
      // Then: useIsFirstTime should be a function
      expect(typeof useIsFirstTime).toBe('function');
    });
  });

  describe('function signature', () => {
    it('should accept no parameters', () => {
      // Then: Function should have length 0
      expect(useIsFirstTime.length).toBe(0);
    });
  });
});
