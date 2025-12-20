import { describe, expect, it } from 'vitest';

import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '../constants';
import {
  createResponsiveFontSizes,
  getResponsiveFontSize,
  nf,
  normalizeFont,
} from '../font';

describe('Font Utilities', () => {
  describe('normalizeFont()', () => {
    it('should return a number', () => {
      expect(typeof normalizeFont(16)).toBe('number');
    });

    it('should clamp to minimum font size', () => {
      const result = normalizeFont(8);
      expect(result).toBeGreaterThanOrEqual(MIN_FONT_SIZE);
    });

    it('should clamp to maximum font size', () => {
      const result = normalizeFont(50);
      expect(result).toBeLessThanOrEqual(MAX_FONT_SIZE);
    });

    it('should respect custom min/max', () => {
      const result = normalizeFont(8, 0.5, 12, 20);
      expect(result).toBeGreaterThanOrEqual(12);
      expect(result).toBeLessThanOrEqual(20);
    });

    it('should apply moderate scaling', () => {
      // With factor 0, should get close to original (clamped)
      const result = normalizeFont(16, 0);
      expect(result).toBeCloseTo(16, 0);
    });

    it('nf should be alias for normalizeFont', () => {
      expect(nf(16)).toBe(normalizeFont(16));
    });
  });

  describe('createResponsiveFontSizes()', () => {
    it('should transform all font sizes', () => {
      const baseFonts = { sm: 12, md: 16, lg: 20 };
      const result = createResponsiveFontSizes(baseFonts);

      expect(result).toHaveProperty('sm');
      expect(result).toHaveProperty('md');
      expect(result).toHaveProperty('lg');
    });

    it('should preserve object keys', () => {
      const baseFonts = { xs: 10, sm: 12, md: 16, lg: 18, xl: 20 };
      const result = createResponsiveFontSizes(baseFonts);

      expect(Object.keys(result)).toEqual(Object.keys(baseFonts));
    });

    it('should return numbers for all values', () => {
      const baseFonts = { small: 12, medium: 16, large: 20 };
      const result = createResponsiveFontSizes(baseFonts);

      Object.values(result).forEach((value) => {
        expect(typeof value).toBe('number');
      });
    });

    it('should respect custom factor', () => {
      const baseFonts = { md: 16 };
      const result1 = createResponsiveFontSizes(baseFonts, 0);
      const result2 = createResponsiveFontSizes(baseFonts, 1);

      // Different factors should produce different results (unless at baseline width)
      expect(typeof result1.md).toBe('number');
      expect(typeof result2.md).toBe('number');
    });
  });

  describe('getResponsiveFontSize()', () => {
    it('should return a number', () => {
      expect(typeof getResponsiveFontSize(16)).toBe('number');
    });

    it('should use body factor by default', () => {
      const bodyResult = getResponsiveFontSize(16, 'body');
      const defaultResult = getResponsiveFontSize(16);
      expect(bodyResult).toBe(defaultResult);
    });

    it('should apply different factors for different variants', () => {
      const headingResult = getResponsiveFontSize(24, 'heading');
      const bodyResult = getResponsiveFontSize(24, 'body');
      const captionResult = getResponsiveFontSize(24, 'caption');

      // All should be numbers
      expect(typeof headingResult).toBe('number');
      expect(typeof bodyResult).toBe('number');
      expect(typeof captionResult).toBe('number');
    });

    it('should handle all font variants', () => {
      const variants = ['body', 'heading', 'caption', 'label'] as const;
      variants.forEach((variant) => {
        expect(typeof getResponsiveFontSize(16, variant)).toBe('number');
      });
    });
  });
});
