import { describe, expect, it } from 'vitest';

import {
  BREAKPOINT_BASELINE,
  BREAKPOINT_LARGE,
  BREAKPOINT_SMALL,
  DEFAULT_SCALE_FACTOR,
  GUIDELINE_BASE_HEIGHT,
  GUIDELINE_BASE_WIDTH,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  MIN_TOUCH_TARGET,
} from '../constants';

describe('Responsive Constants', () => {
  describe('Baseline Dimensions', () => {
    it('should have correct baseline width (iPhone 8)', () => {
      expect(GUIDELINE_BASE_WIDTH).toBe(375);
    });

    it('should have correct baseline height (iPhone X)', () => {
      expect(GUIDELINE_BASE_HEIGHT).toBe(812);
    });
  });

  describe('Breakpoints', () => {
    it('should have small breakpoint at 360', () => {
      expect(BREAKPOINT_SMALL).toBe(360);
    });

    it('should have baseline breakpoint at 420', () => {
      expect(BREAKPOINT_BASELINE).toBe(420);
    });

    it('should have large breakpoint at 768', () => {
      expect(BREAKPOINT_LARGE).toBe(768);
    });

    it('should have breakpoints in ascending order', () => {
      expect(BREAKPOINT_SMALL).toBeLessThan(BREAKPOINT_BASELINE);
      expect(BREAKPOINT_BASELINE).toBeLessThan(BREAKPOINT_LARGE);
    });
  });

  describe('Font Constraints', () => {
    it('should have minimum font size of 10', () => {
      expect(MIN_FONT_SIZE).toBe(10);
    });

    it('should have maximum font size of 32', () => {
      expect(MAX_FONT_SIZE).toBe(32);
    });

    it('should have min less than max', () => {
      expect(MIN_FONT_SIZE).toBeLessThan(MAX_FONT_SIZE);
    });
  });

  describe('Scale Factor', () => {
    it('should have default scale factor of 0.5', () => {
      expect(DEFAULT_SCALE_FACTOR).toBe(0.5);
    });

    it('should be between 0 and 1', () => {
      expect(DEFAULT_SCALE_FACTOR).toBeGreaterThanOrEqual(0);
      expect(DEFAULT_SCALE_FACTOR).toBeLessThanOrEqual(1);
    });
  });

  describe('Accessibility', () => {
    it('should have minimum touch target of 44', () => {
      expect(MIN_TOUCH_TARGET).toBe(44);
    });
  });
});
