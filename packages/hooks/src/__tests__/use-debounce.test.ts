import { describe, expect, it } from 'vitest';

import { useDebounce } from '../use-debounce';

describe('useDebounce', () => {
  describe('exports', () => {
    it('should be exported from the module', () => {
      // Then: useDebounce should be defined
      expect(useDebounce).toBeDefined();
    });

    it('should be a function', () => {
      // Then: useDebounce should be a function
      expect(typeof useDebounce).toBe('function');
    });
  });

  describe('function signature', () => {
    it('should accept two parameters', () => {
      // Then: Function should have length 2
      expect(useDebounce.length).toBe(2);
    });
  });
});
