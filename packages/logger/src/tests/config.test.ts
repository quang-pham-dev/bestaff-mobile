import {
  createBaseConfig,
  getEnvironment,
  getLogLevel,
  getServiceName,
  getVersion,
  isBrowser,
  isNode,
  shouldEnablePretty,
} from '../config';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getEnvironment', () => {
    it('should return development by default', () => {
      delete process.env.NODE_ENV;
      delete process.env.ENVIRONMENT;
      expect(getEnvironment()).toBe('development');
    });

    it('should return production for NODE_ENV=production', () => {
      process.env.NODE_ENV = 'production';
      expect(getEnvironment()).toBe('production');
    });

    it('should return staging for NODE_ENV=staging', () => {
      process.env.NODE_ENV = 'staging';
      expect(getEnvironment()).toBe('staging');
    });

    it('should return test for NODE_ENV=test', () => {
      process.env.NODE_ENV = 'test';
      expect(getEnvironment()).toBe('test');
    });

    it('should handle ENVIRONMENT variable', () => {
      delete process.env.NODE_ENV; // Ensure NODE_ENV doesn't override
      process.env.ENVIRONMENT = 'production';
      expect(getEnvironment()).toBe('production');
    });

    it('should handle case insensitive values', () => {
      process.env.NODE_ENV = 'PRODUCTION';
      expect(getEnvironment()).toBe('production');
    });

    it('should handle short forms', () => {
      process.env.NODE_ENV = 'prod';
      expect(getEnvironment()).toBe('production');
    });
  });

  describe('getServiceName', () => {
    it('should return mobile by default', () => {
      delete process.env.SERVICE_NAME;
      delete process.env.APP_NAME;
      expect(getServiceName()).toBe('mobile');
    });

    it('should return mobile for SERVICE_NAME=mobile', () => {
      process.env.SERVICE_NAME = 'mobile';
      expect(getServiceName()).toBe('mobile');
    });

    it('should return value from APP_NAME', () => {
      process.env.APP_NAME = 'bestaff-mobile';
      expect(getServiceName()).toBe('mobile');
    });

    it('should map mobile correctly', () => {
      process.env.SERVICE_NAME = 'mobile';
      expect(getServiceName()).toBe('mobile');

      process.env.SERVICE_NAME = 'MOBILE';
      expect(getServiceName()).toBe('mobile');
    });

    it('should handle case insensitive mapping', () => {
      process.env.SERVICE_NAME = 'MOBILE';
      expect(getServiceName()).toBe('mobile');
    });

    it('should fallback to mobile for unknown services', () => {
      process.env.SERVICE_NAME = 'unknown-service';
      expect(getServiceName()).toBe('mobile');
    });
  });

  describe('getVersion', () => {
    it('should return version from APP_VERSION', () => {
      process.env.APP_VERSION = '2.0.0';
      expect(getVersion()).toBe('2.0.0');
    });

    it('should return version from npm_package_version', () => {
      process.env.npm_package_version = '1.5.0';
      expect(getVersion()).toBe('1.5.0');
    });

    it('should return default version', () => {
      delete process.env.APP_VERSION;
      delete process.env.npm_package_version;
      expect(getVersion()).toBe('1.0.0');
    });

    it('should prioritize APP_VERSION over npm_package_version', () => {
      process.env.APP_VERSION = '2.0.0';
      process.env.npm_package_version = '1.5.0';
      expect(getVersion()).toBe('2.0.0');
    });
  });

  describe('getLogLevel', () => {
    it('should return environment default when no LOG_LEVEL set', () => {
      delete process.env.LOG_LEVEL;
      expect(getLogLevel('development')).toBe('debug');
      expect(getLogLevel('production')).toBe('info');
      expect(getLogLevel('test')).toBe('warn');
      expect(getLogLevel('staging')).toBe('info');
    });

    it('should return LOG_LEVEL when valid', () => {
      process.env.LOG_LEVEL = 'error';
      expect(getLogLevel('development')).toBe('error');
    });

    it('should ignore invalid LOG_LEVEL', () => {
      process.env.LOG_LEVEL = 'invalid';
      expect(getLogLevel('development')).toBe('debug');
    });

    it('should handle case insensitive LOG_LEVEL', () => {
      process.env.LOG_LEVEL = 'ERROR';
      expect(getLogLevel('development')).toBe('error');
    });
  });

  describe('shouldEnablePretty', () => {
    it('should return true for development by default', () => {
      delete process.env.LOG_PRETTY;
      expect(shouldEnablePretty('development')).toBe(true);
    });

    it('should return false for production by default', () => {
      delete process.env.LOG_PRETTY;
      expect(shouldEnablePretty('production')).toBe(false);
    });

    it('should respect LOG_PRETTY environment variable', () => {
      process.env.LOG_PRETTY = 'true';
      expect(shouldEnablePretty('production')).toBe(true);

      process.env.LOG_PRETTY = 'false';
      expect(shouldEnablePretty('development')).toBe(false);
    });
  });

  describe('isBrowser', () => {
    it('should return false in Node.js environment', () => {
      expect(isBrowser()).toBe(false);
    });
  });

  describe('isNode', () => {
    it('should return true in Node.js environment', () => {
      expect(isNode()).toBe(true);
    });
  });

  describe('createBaseConfig', () => {
    it('should create default configuration', () => {
      // Force development environment for this test
      process.env.NODE_ENV = 'development';
      // Clear version env vars to test default
      delete process.env.APP_VERSION;
      delete process.env.npm_package_version;
      const config = createBaseConfig();

      expect(config.service).toBe('mobile');
      expect(config.environment).toBe('development');
      expect(config.level).toBe('debug');
      expect(config.version).toBe('1.0.0');
      expect(config.enablePretty).toBe(true);
      expect(config.enableHttp).toBe(false); // mobile service has HTTP disabled
      expect(config.enableMetrics).toBe(false); // mobile service has metrics disabled
    });

    it('should create configuration with specified service and environment', () => {
      const config = createBaseConfig('mobile', 'production');

      expect(config.service).toBe('mobile');
      expect(config.environment).toBe('production');
      expect(config.level).toBe('info');
      expect(config.enablePretty).toBe(true); // mobile service has pretty enabled
    });

    it('should apply overrides', () => {
      const config = createBaseConfig('mobile', 'development', {
        level: 'error',
        enablePretty: false,
        context: {
          customField: 'value',
        },
      });

      expect(config.level).toBe('error');
      expect(config.enablePretty).toBe(false);
      expect(config.context?.customField).toBe('value');
      expect(config.context?.service).toBe('mobile'); // Base context should be preserved
    });

    it('should merge pino options correctly', () => {
      const config = createBaseConfig('mobile', 'development', {
        pinoOptions: {
          level: 'warn',
          base: {
            customBase: 'value',
          },
        },
      });

      expect(config.pinoOptions?.level).toBe('warn');
      expect(config.pinoOptions?.base?.customBase).toBe('value');
      // Base merging happens in the actual logger creation, not in config
      expect(config.pinoOptions?.base).toBeDefined();
    });

    it('should apply service-specific configurations', () => {
      const mobileConfig = createBaseConfig('mobile', 'development');
      expect(mobileConfig.enableHttp).toBe(false);
      expect(mobileConfig.enableMetrics).toBe(false);
    });

    it('should handle test environment correctly', () => {
      const config = createBaseConfig('mobile', 'test');

      expect(config.level).toBe('warn');
      expect(config.enableMetrics).toBe(false);
      expect(config.pinoOptions?.enabled).toBe(false);
    });
  });
});
