import { describe, expect, it } from 'vitest';

import {
  ACTIVE_BREAKPOINT,
  BREAKPOINTS,
  ORIENTATION,
  getActiveBreakpoint,
  getBreakpoints,
  getOrientation,
  isLandscape,
  isPhone,
  isPortrait,
  isSmallScreen,
  isTablet,
} from '../breakpoints';
import {
  BREAKPOINT_BASELINE,
  BREAKPOINT_LARGE,
  BREAKPOINT_SMALL,
} from '../constants';

describe('Breakpoint Utilities', () => {
  describe('getBreakpoints()', () => {
    it('should return small=true for width < 360', () => {
      const bp = getBreakpoints(320);
      expect(bp.small).toBe(true);
      expect(bp.baseline).toBe(false);
      expect(bp.large).toBe(false);
      expect(bp.tablet).toBe(false);
    });

    it('should return baseline=true for width 360-419', () => {
      const bp = getBreakpoints(400);
      expect(bp.small).toBe(false);
      expect(bp.baseline).toBe(true);
      expect(bp.large).toBe(false);
      expect(bp.tablet).toBe(false);
    });

    it('should return large=true for width 420-767', () => {
      const bp = getBreakpoints(500);
      expect(bp.small).toBe(false);
      expect(bp.baseline).toBe(false);
      expect(bp.large).toBe(true);
      expect(bp.tablet).toBe(false);
    });

    it('should return tablet=true for width >= 768', () => {
      const bp = getBreakpoints(800);
      expect(bp.small).toBe(false);
      expect(bp.baseline).toBe(false);
      expect(bp.large).toBe(false);
      expect(bp.tablet).toBe(true);
    });

    it('should handle exact breakpoint boundaries', () => {
      expect(getBreakpoints(BREAKPOINT_SMALL - 1).small).toBe(true);
      expect(getBreakpoints(BREAKPOINT_SMALL).baseline).toBe(true);
      expect(getBreakpoints(BREAKPOINT_BASELINE - 1).baseline).toBe(true);
      expect(getBreakpoints(BREAKPOINT_BASELINE).large).toBe(true);
      expect(getBreakpoints(BREAKPOINT_LARGE - 1).large).toBe(true);
      expect(getBreakpoints(BREAKPOINT_LARGE).tablet).toBe(true);
    });
  });

  describe('getActiveBreakpoint()', () => {
    it('should return "small" for width < 360', () => {
      expect(getActiveBreakpoint(320)).toBe('small');
    });

    it('should return "baseline" for width 360-419', () => {
      expect(getActiveBreakpoint(400)).toBe('baseline');
    });

    it('should return "large" for width 420-767', () => {
      expect(getActiveBreakpoint(600)).toBe('large');
    });

    it('should return "tablet" for width >= 768', () => {
      expect(getActiveBreakpoint(1024)).toBe('tablet');
    });
  });

  describe('Convenience checks', () => {
    it('isSmallScreen should return true for small widths', () => {
      expect(isSmallScreen(320)).toBe(true);
      expect(isSmallScreen(400)).toBe(false);
    });

    it('isTablet should return true for tablet widths', () => {
      expect(isTablet(800)).toBe(true);
      expect(isTablet(400)).toBe(false);
    });

    it('isPhone should return true for non-tablet widths', () => {
      expect(isPhone(400)).toBe(true);
      expect(isPhone(800)).toBe(false);
    });
  });

  describe('Orientation', () => {
    it('getOrientation should return portrait when height >= width', () => {
      expect(getOrientation(375, 812)).toBe('portrait');
      expect(getOrientation(400, 400)).toBe('portrait'); // Equal = portrait
    });

    it('getOrientation should return landscape when width > height', () => {
      expect(getOrientation(812, 375)).toBe('landscape');
    });

    it('isPortrait should detect portrait orientation', () => {
      expect(isPortrait(375, 812)).toBe(true);
      expect(isPortrait(812, 375)).toBe(false);
    });

    it('isLandscape should detect landscape orientation', () => {
      expect(isLandscape(812, 375)).toBe(true);
      expect(isLandscape(375, 812)).toBe(false);
    });
  });

  describe('Static constants', () => {
    it('BREAKPOINTS should be pre-computed', () => {
      expect(BREAKPOINTS).toHaveProperty('small');
      expect(BREAKPOINTS).toHaveProperty('baseline');
      expect(BREAKPOINTS).toHaveProperty('large');
      expect(BREAKPOINTS).toHaveProperty('tablet');
    });

    it('ACTIVE_BREAKPOINT should be a valid breakpoint key', () => {
      expect(['small', 'baseline', 'large', 'tablet']).toContain(
        ACTIVE_BREAKPOINT,
      );
    });

    it('ORIENTATION should be portrait or landscape', () => {
      expect(['portrait', 'landscape']).toContain(ORIENTATION);
    });
  });
});
