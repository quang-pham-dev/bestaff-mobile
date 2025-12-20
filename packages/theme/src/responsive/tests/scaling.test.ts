import { describe, expect, it } from 'vitest';

import { GUIDELINE_BASE_HEIGHT, GUIDELINE_BASE_WIDTH } from '../constants';
import {
  clamp,
  moderateScale,
  moderateVerticalScale,
  ms,
  mvs,
  roundToPixel,
  s,
  scale,
  verticalScale,
  vs,
} from '../scaling';

// Mock values - 375x812 is the baseline
const MOCK_WIDTH = 375;
const MOCK_HEIGHT = 812;

describe('Responsive Scaling', () => {
  describe('scale()', () => {
    it('should return same value when screen width equals baseline', () => {
      // At baseline width (375), scale(16) should return 16
      const result = scale(16);
      const expected = (MOCK_WIDTH / GUIDELINE_BASE_WIDTH) * 16;
      expect(result).toBe(expected);
    });

    it('should scale proportionally to screen width', () => {
      const result = scale(100);
      expect(result).toBe((MOCK_WIDTH / GUIDELINE_BASE_WIDTH) * 100);
    });

    it('should return 0 for input 0', () => {
      expect(scale(0)).toBe(0);
    });

    it('should handle negative values', () => {
      const result = scale(-16);
      expect(result).toBe((MOCK_WIDTH / GUIDELINE_BASE_WIDTH) * -16);
    });
  });

  describe('verticalScale()', () => {
    it('should scale based on screen height', () => {
      const result = verticalScale(100);
      expect(result).toBe((MOCK_HEIGHT / GUIDELINE_BASE_HEIGHT) * 100);
    });

    it('should return 0 for input 0', () => {
      expect(verticalScale(0)).toBe(0);
    });
  });

  describe('moderateScale()', () => {
    it('should apply moderate scaling with default factor', () => {
      const size = 16;
      const scaledSize = scale(size);
      const expected = size + (scaledSize - size) * 0.5;
      expect(moderateScale(size)).toBe(expected);
    });

    it('should return original size when factor is 0', () => {
      expect(moderateScale(16, 0)).toBe(16);
    });

    it('should return full scale when factor is 1', () => {
      const size = 16;
      expect(moderateScale(size, 1)).toBe(scale(size));
    });

    it('should work with custom factor', () => {
      const size = 20;
      const factor = 0.3;
      const scaledSize = scale(size);
      const expected = size + (scaledSize - size) * factor;
      expect(moderateScale(size, factor)).toBe(expected);
    });
  });

  describe('moderateVerticalScale()', () => {
    it('should apply moderate vertical scaling', () => {
      const size = 16;
      const scaledSize = verticalScale(size);
      const expected = size + (scaledSize - size) * 0.5;
      expect(moderateVerticalScale(size)).toBe(expected);
    });
  });

  describe('clamp()', () => {
    it('should return value when within bounds', () => {
      expect(clamp(15, 10, 20)).toBe(15);
    });

    it('should return min when value is below min', () => {
      expect(clamp(5, 10, 20)).toBe(10);
    });

    it('should return max when value is above max', () => {
      expect(clamp(25, 10, 20)).toBe(20);
    });

    it('should handle equal min and max', () => {
      expect(clamp(15, 10, 10)).toBe(10);
    });

    it('should handle negative values', () => {
      expect(clamp(-5, -10, 0)).toBe(-5);
      expect(clamp(-15, -10, 0)).toBe(-10);
    });
  });

  describe('roundToPixel()', () => {
    it('should round to nearest pixel', () => {
      // Mocked to return Math.round
      expect(roundToPixel(16.4)).toBe(16);
      expect(roundToPixel(16.6)).toBe(17);
    });
  });

  describe('Shorthand aliases', () => {
    it('s should be alias for scale', () => {
      expect(s(16)).toBe(scale(16));
    });

    it('vs should be alias for verticalScale', () => {
      expect(vs(16)).toBe(verticalScale(16));
    });

    it('ms should be alias for moderateScale', () => {
      expect(ms(16)).toBe(moderateScale(16));
    });

    it('mvs should be alias for moderateVerticalScale', () => {
      expect(mvs(16)).toBe(moderateVerticalScale(16));
    });
  });
});
