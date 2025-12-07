import { describe, expect, it } from 'vitest';

import { useBackHandler } from '../use-back-handler';

describe('useBackHandler', () => {
  describe('exports', () => {
    it('should be exported from the module', () => {
      // Then: useBackHandler should be defined
      expect(useBackHandler).toBeDefined();
    });

    it('should be a function', () => {
      // Then: useBackHandler should be a function
      expect(typeof useBackHandler).toBe('function');
    });
  });

  describe('function signature', () => {
    it('should accept one parameter', () => {
      // Then: Function should have length 1
      expect(useBackHandler.length).toBe(1);
    });
  });
});
