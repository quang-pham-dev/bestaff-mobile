import { describe, expect, it } from 'vitest';

import { useHaptics } from '../use-haptics';

describe('useHaptics', () => {
  describe('exports', () => {
    it('should be exported from the module', () => {
      // Then: useHaptics should be defined
      expect(useHaptics).toBeDefined();
    });

    it('should be a function', () => {
      // Then: useHaptics should be a function
      expect(typeof useHaptics).toBe('function');
    });
  });

  describe('return value structure', () => {
    it('should return an object with expected methods', () => {
      // When: Hook is called
      const result = useHaptics();

      // Then: All methods should be defined
      expect(result.lightImpact).toBeDefined();
      expect(result.mediumImpact).toBeDefined();
      expect(result.heavyImpact).toBeDefined();
      expect(result.success).toBeDefined();
      expect(result.warning).toBeDefined();
      expect(result.error).toBeDefined();
      expect(result.selection).toBeDefined();
    });

    it('should return functions', () => {
      // When: Hook is called
      const result = useHaptics();

      // Then: All returned values should be functions
      expect(typeof result.lightImpact).toBe('function');
      expect(typeof result.mediumImpact).toBe('function');
      expect(typeof result.heavyImpact).toBe('function');
      expect(typeof result.success).toBe('function');
      expect(typeof result.warning).toBe('function');
      expect(typeof result.error).toBe('function');
      expect(typeof result.selection).toBe('function');
    });
  });
});
