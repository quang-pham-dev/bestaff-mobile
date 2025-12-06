import {
  LoggerFactory,
  configureLogger,
  createLogger,
  getLoggerFactory,
} from '../factory';
import type { Environment, ServiceType } from '../types';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('LoggerFactory', () => {
  beforeEach(() => {
    // Clear singleton instance before each test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (LoggerFactory as any).instance = undefined;
  });

  describe('constructor', () => {
    it('should create factory with default options', () => {
      const factory = new LoggerFactory();
      expect(factory).toBeInstanceOf(LoggerFactory);
    });

    it('should create factory with custom options', () => {
      const options = {
        defaultConfig: { level: 'error' as const },
        globalContext: { platform: 'bestaff' },
      };

      const factory = new LoggerFactory(options);
      expect(factory.getGlobalContext()).toEqual({ platform: 'bestaff' });
    });
  });

  describe('singleton pattern', () => {
    it('should return same instance for multiple calls', () => {
      const factory1 = LoggerFactory.getInstance();
      const factory2 = LoggerFactory.getInstance();

      expect(factory1).toBe(factory2);
    });

    it('should use options only on first call', () => {
      const options1 = { globalContext: { version: '1.0.0' } };
      const options2 = { globalContext: { version: '2.0.0' } };

      const factory1 = LoggerFactory.getInstance(options1);
      const factory2 = LoggerFactory.getInstance(options2);

      expect(factory1).toBe(factory2);
      expect(factory1.getGlobalContext()).toEqual({ version: '1.0.0' });
    });
  });

  describe('createLogger', () => {
    let factory: LoggerFactory;

    beforeEach(() => {
      factory = new LoggerFactory();
    });

    it('should create logger for mobile service', () => {
      const logger = factory.createLogger('mobile', 'development');

      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.withContext).toBe('function');
    });

    it('should cache loggers', () => {
      const logger1 = factory.createLogger('mobile', 'development');
      const logger2 = factory.createLogger('mobile', 'development');

      expect(logger1).toBe(logger2);
    });

    it('should create different loggers for different environments', () => {
      const devLogger = factory.createLogger('mobile', 'development');
      const prodLogger = factory.createLogger('mobile', 'production');

      expect(devLogger).not.toBe(prodLogger);
    });

    it('should apply custom configuration', () => {
      const config = {
        level: 'error' as const,
        context: { customField: 'value' },
      };

      const logger = factory.createLogger('mobile', 'development', config);

      expect(logger).toBeDefined();
      // Note: We can't easily test the internal configuration without exposing it
    });
  });

  describe('global context management', () => {
    let factory: LoggerFactory;

    beforeEach(() => {
      factory = new LoggerFactory();
    });

    it('should set and get global context', () => {
      const context = { platform: 'orbit', version: '1.0.0' };

      factory.setGlobalContext(context);

      expect(factory.getGlobalContext()).toEqual(context);
    });

    it('should merge global context', () => {
      factory.setGlobalContext({ platform: 'orbit' });
      factory.setGlobalContext({ version: '1.0.0' });

      expect(factory.getGlobalContext()).toEqual({
        platform: 'orbit',
        version: '1.0.0',
      });
    });

    it('should return copy of global context', () => {
      const original = { platform: 'orbit' };
      factory.setGlobalContext(original);

      const retrieved = factory.getGlobalContext();
      retrieved.modified = true;

      expect(factory.getGlobalContext()).toEqual({ platform: 'orbit' });
    });
  });

  describe('cache management', () => {
    let factory: LoggerFactory;

    beforeEach(() => {
      factory = new LoggerFactory();
    });

    it('should clear cache', () => {
      const logger1 = factory.createLogger('mobile', 'development');

      factory.clearCache();

      const logger2 = factory.createLogger('mobile', 'development');

      expect(logger1).not.toBe(logger2);
    });

    it('should get cached logger', () => {
      const logger = factory.createLogger('mobile', 'development');

      const cached = factory.getCachedLogger('mobile', 'development');

      expect(cached).toBe(logger);
    });

    it('should return undefined for non-cached logger', () => {
      const cached = factory.getCachedLogger('mobile', 'development');

      expect(cached).toBeUndefined();
    });
  });

  describe('child logger creation', () => {
    let factory: LoggerFactory;

    beforeEach(() => {
      factory = new LoggerFactory();
    });

    it('should create child logger', () => {
      const parent = factory.createLogger('mobile', 'development');
      const context = { requestId: 'req-123' };

      const child = factory.createChildLogger(parent, context);

      expect(child).toBeDefined();
      expect(child).not.toBe(parent);
      expect(typeof child.info).toBe('function');
    });
  });

  describe('browser vs Node.js environments', () => {
    let factory: LoggerFactory;

    beforeEach(() => {
      factory = new LoggerFactory();
    });

    it('should handle Node.js environment', () => {
      // We're running in Node.js during tests
      const logger = factory.createLogger('mobile', 'development');

      expect(logger).toBeDefined();
    });

    // Note: Testing browser environment would require additional setup
    // or mocking of browser globals
  });
});

describe('module functions', () => {
  beforeEach(() => {
    // Clear singleton instance before each test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (LoggerFactory as any).instance = undefined;
  });

  describe('createLogger', () => {
    it('should create logger using factory', () => {
      const logger = createLogger('mobile', 'development');

      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
    });

    it('should use singleton factory', () => {
      const logger1 = createLogger('mobile', 'development');
      const logger2 = createLogger('mobile', 'development');

      expect(logger1).toBe(logger2);
    });
  });

  describe('getLoggerFactory', () => {
    it('should return singleton factory instance', () => {
      const factory1 = getLoggerFactory();
      const factory2 = getLoggerFactory();

      expect(factory1).toBe(factory2);
      expect(factory1).toBeInstanceOf(LoggerFactory);
    });
  });

  describe('configureLogger', () => {
    it('should configure global factory', () => {
      const options = {
        defaultConfig: { level: 'warn' as const },
        globalContext: { platform: 'bestaff' },
      };

      configureLogger(options);

      const factory = getLoggerFactory();
      expect(factory.getGlobalContext()).toEqual({ platform: 'bestaff' });
    });

    it('should replace existing factory instance', () => {
      const factory1 = getLoggerFactory();

      configureLogger({ globalContext: { version: '1.0.0' } });

      const factory2 = getLoggerFactory();
      expect(factory2).not.toBe(factory1);
      expect(factory2.getGlobalContext()).toEqual({ version: '1.0.0' });
    });
  });
});

describe('environment detection', () => {
  const originalEnv = process.env;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const originalWindow = (global as any).window;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const originalDocument = (global as any).document;

  afterEach(() => {
    process.env = originalEnv;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = originalWindow;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).document = originalDocument;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (LoggerFactory as any).instance = undefined;
  });

  it('should detect Node.js environment', () => {
    const factory = new LoggerFactory();
    const logger = factory.createLogger('mobile', 'development');

    expect(logger).toBeDefined();
  });

  // Note: Full browser environment testing would require jsdom or similar
  // For now, we test that the factory can be created without errors
});

describe('error handling', () => {
  let factory: LoggerFactory;

  beforeEach(() => {
    factory = new LoggerFactory();
  });

  it('should handle invalid service type gracefully', () => {
    // TypeScript would prevent this, but testing runtime behavior
    const logger = factory.createLogger(
      'invalid-service' as ServiceType,
      'development',
    );

    expect(logger).toBeDefined();
  });

  it('should handle invalid environment gracefully', () => {
    // TypeScript would prevent this, but testing runtime behavior
    const logger = factory.createLogger('mobile', 'invalid-env' as Environment);

    expect(logger).toBeDefined();
  });

  it('should handle malformed configuration', () => {
    const config = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      level: 'invalid-level' as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transports: [{ type: 'invalid-transport' as any }],
    };

    // Invalid level should throw pino error
    expect(() => {
      factory.createLogger('mobile', 'development', config);
    }).toThrow();
  });
});
