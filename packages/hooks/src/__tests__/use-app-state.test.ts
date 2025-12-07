import { describe, expect, it } from 'vitest';

import { useAppState } from '../use-app-state';

describe('useAppState', () => {
  describe('exports', () => {
    it('should be exported from the module', () => {
      // Then: useAppState should be defined
      expect(useAppState).toBeDefined();
    });

    it('should be a function', () => {
      // Then: useAppState should be a function
      expect(typeof useAppState).toBe('function');
    });
  });

  describe('function signature', () => {
    it('should accept one parameter (props object)', () => {
      // Then: Function should have length 1
      expect(useAppState.length).toBe(1);
    });
  });
});
