import { describe, expect, it } from 'vitest';

import { useEntryAnimation } from '../use-entry-animation';

describe('useEntryAnimation', () => {
  describe('exports', () => {
    it('should be exported from the module', () => {
      // Then: useEntryAnimation should be defined
      expect(useEntryAnimation).toBeDefined();
    });

    it('should be a function', () => {
      // Then: useEntryAnimation should be a function
      expect(typeof useEntryAnimation).toBe('function');
    });
  });

  describe('function signature', () => {
    it('should accept one optional parameter', () => {
      // Then: Function accepts config object
      expect(useEntryAnimation.length).toBeLessThanOrEqual(1);
    });
  });
});
