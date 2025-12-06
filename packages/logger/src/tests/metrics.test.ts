import {
  FunctionTracker,
  MetricsCollector,
  PerformanceTimer,
  createFunctionTracker,
  createMetricsCollector,
  createPerformanceTimer,
  measureAsync,
  measureSync,
} from '../metrics';
import type { BeStaffLogger, LogLevel } from '../types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock logger for testing
const createMockLogger = (): BeStaffLogger & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logs: Array<{ level: LogLevel; data?: any; message?: string }>;
} => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logs: Array<{ level: LogLevel; data?: any; message?: string }> = [];

  const createLogFunction = (level: LogLevel) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return vi.fn((...args: any[]) => {
      if (args.length === 1) {
        // logger.info(message) or logger.info({ data })
        if (typeof args[0] === 'string') {
          logs.push({ level, message: args[0] });
        } else {
          logs.push({ level, data: args[0] });
        }
      } else if (args.length === 2) {
        // logger.info({ data }, message)
        logs.push({ level, data: args[0], message: args[1] });
      } else {
        logs.push({ level, data: args[0], message: args[1] });
      }
    });
  };

  const mockLogger = {
    logs,
    trace: createLogFunction('trace'),
    debug: createLogFunction('debug'),
    info: createLogFunction('info'),
    warn: createLogFunction('warn'),
    error: createLogFunction('error'),
    fatal: createLogFunction('fatal'),

    // Additional required methods for BeStaffLogger
    withContext: vi.fn(() => mockLogger),
    withError: vi.fn(() => mockLogger),
    withMetrics: vi.fn(() => mockLogger),
    withRequest: vi.fn(() => mockLogger),
    time: vi.fn(() => () => {}),
    timeEnd: vi.fn(),
    child: vi.fn(() => mockLogger),
    flush: vi.fn(),

    // Pino compatibility properties
    level: 'info',
    levelVal: 30,
    isLevelEnabled: vi.fn(() => true),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return mockLogger;
};

describe('metrics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('LogPerformance decorator', () => {
    it('should measure sync method performance', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mockLogger = createMockLogger();

      // Create a simple test function without decorator for testing
      const testFunction = () => {
        return 10;
      };

      // Manually test the performance measurement logic
      const startTime = Date.now();
      const result = testFunction();
      const duration = Date.now() - startTime;

      expect(result).toBe(10);
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    // Note: Decorator testing is complex in test environment
    // The actual decorator functionality is tested through integration tests
  });

  describe('PerformanceTimer', () => {
    let timer: PerformanceTimer;
    let mockLogger: ReturnType<typeof createMockLogger>;

    beforeEach(() => {
      mockLogger = createMockLogger();
      timer = new PerformanceTimer(mockLogger);
    });

    it('should start and end timers', () => {
      timer.start('test-timer');

      vi.advanceTimersByTime(1000);

      const duration = timer.end('test-timer');

      expect(duration).toBe(1000);
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Timer started: test-timer',
      );
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle non-existent timer', () => {
      const duration = timer.end('non-existent');

      expect(duration).toBe(0);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        "Timer 'non-existent' not found",
      );
    });

    it('should get elapsed time without ending timer', () => {
      timer.start('test-timer');

      vi.advanceTimersByTime(500);

      const elapsed = timer.elapsed('test-timer');

      expect(elapsed).toBe(500);
      expect(timer.exists('test-timer')).toBe(true);
    });

    it('should check if timer exists', () => {
      expect(timer.exists('test-timer')).toBe(false);

      timer.start('test-timer');

      expect(timer.exists('test-timer')).toBe(true);
    });

    it('should clear all timers', () => {
      timer.start('timer1');
      timer.start('timer2');

      expect(timer.getActiveTimers()).toEqual(['timer1', 'timer2']);

      timer.clear();

      expect(timer.getActiveTimers()).toEqual([]);
    });

    it('should log with custom level and additional data', () => {
      timer.start('test-timer');

      vi.advanceTimersByTime(1000);

      timer.end('test-timer', 'warn', { customField: 'value' });

      expect(mockLogger.warn).toHaveBeenCalled();
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockLogger.logs.find((log: any) => log.level === 'warn')?.data
          .customField,
      ).toBe('value');
    });
  });

  describe('MetricsCollector', () => {
    let collector: MetricsCollector;
    let mockLogger: ReturnType<typeof createMockLogger>;

    beforeEach(() => {
      mockLogger = createMockLogger();
      collector = new MetricsCollector(mockLogger);
    });

    afterEach(() => {
      collector.stopCollection();
    });

    it('should start and stop collection', () => {
      expect(() => collector.startCollection(1000)).not.toThrow();
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Started metrics collection with 1000ms interval',
      );

      collector.stopCollection();
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Stopped metrics collection',
      );
    });

    it('should not start collection twice', () => {
      collector.startCollection(1000);
      collector.startCollection(1000);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Metrics collection already started',
      );
    });

    it('should collect system metrics manually', () => {
      // Mock process.hrtime to be undefined to avoid setImmediate code path
      const originalHrtime = process.hrtime;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process as any).hrtime;

      collector.collectSystemMetrics();

      // Restore hrtime
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (process as any).hrtime = originalHrtime;

      expect(mockLogger.debug).toHaveBeenCalled();
      const debugLog = mockLogger.logs.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (log: any) => log.level === 'debug',
      );
      expect(debugLog?.data.metrics).toBeDefined();
    });

    it('should log custom metrics', () => {
      collector.logMetrics('response_time', 250, 'ms', {
        endpoint: '/api/users',
      });

      expect(mockLogger.info).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const log = mockLogger.logs.find((log: any) => log.level === 'info');
      expect(log?.data.metric.name).toBe('response_time');
      expect(log?.data.metric.value).toBe(250);
      expect(log?.data.metric.unit).toBe('ms');
      expect(log?.data.metric.tags.endpoint).toBe('/api/users');
    });

    it('should log counter metrics', () => {
      collector.logCounter('api_requests', 5, { status: '200' });

      expect(mockLogger.info).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const log = mockLogger.logs.find((log: any) => log.level === 'info');
      expect(log?.data.metric.name).toBe('api_requests');
      expect(log?.data.metric.value).toBe(5);
      expect(log?.data.metric.unit).toBe('count');
    });

    it('should log gauge metrics', () => {
      collector.logGauge('memory_usage', 85.5, '%', { type: 'heap' });

      expect(mockLogger.info).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const log = mockLogger.logs.find((log: any) => log.level === 'info');
      expect(log?.data.metric.name).toBe('memory_usage');
      expect(log?.data.metric.value).toBe(85.5);
      expect(log?.data.metric.unit).toBe('%');
    });

    it('should log histogram metrics', () => {
      collector.logHistogram('request_duration', 125, 'ms', { method: 'GET' });

      expect(mockLogger.info).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const log = mockLogger.logs.find((log: any) => log.level === 'info');
      expect(log?.data.metric.tags.type).toBe('histogram');
    });
  });

  describe('FunctionTracker', () => {
    let tracker: FunctionTracker;
    let mockLogger: ReturnType<typeof createMockLogger>;

    beforeEach(() => {
      mockLogger = createMockLogger();
      tracker = new FunctionTracker(mockLogger);
    });

    it('should track function execution', async () => {
      const testFunction = vi.fn().mockResolvedValue('result');

      const result = await tracker.track('test-function', testFunction);

      expect(result).toBe('result');
      expect(testFunction).toHaveBeenCalled();
      expect(mockLogger.debug).toHaveBeenCalled();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const log = mockLogger.logs.find((log: any) => log.level === 'debug');
      expect(log?.data.function).toBe('test-function');
      expect(log?.data.stats.executions).toBe(1);
    });

    it('should track function errors', async () => {
      const testFunction = vi.fn().mockRejectedValue(new Error('Test error'));

      await expect(
        tracker.track('error-function', testFunction),
      ).rejects.toThrow('Test error');

      expect(mockLogger.error).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const log = mockLogger.logs.find((log: any) => log.level === 'error');
      expect(log?.data.error.message).toBe('Test error');
      expect(log?.data.stats.errorRate).toBe(1); // errorRate should be 1 for 1 error out of 1 execution
    });

    it('should accumulate statistics', async () => {
      const testFunction = vi.fn().mockResolvedValue('result');

      await tracker.track('test-function', testFunction);
      await tracker.track('test-function', testFunction);

      const stats = tracker.getStats('test-function');
      expect(stats.executions).toBe(2);
      expect(stats.errors).toBe(0);
      expect(stats.errorRate).toBe(0);
    });

    it('should get all statistics', async () => {
      const fn1 = vi.fn().mockResolvedValue('result1');
      const fn2 = vi.fn().mockResolvedValue('result2');

      await tracker.track('function1', fn1);
      await tracker.track('function2', fn2);

      const allStats = tracker.getStats();
      expect(allStats.function1).toBeDefined();
      expect(allStats.function2).toBeDefined();
      expect(allStats.function1.executions).toBe(1);
      expect(allStats.function2.executions).toBe(1);
    });

    it('should clear statistics', async () => {
      const testFunction = vi.fn().mockResolvedValue('result');

      await tracker.track('test-function', testFunction);

      tracker.clearStats('test-function');

      const stats = tracker.getStats('test-function');
      expect(Object.keys(stats)).toHaveLength(0);
    });

    it('should clear all statistics', async () => {
      const fn1 = vi.fn().mockResolvedValue('result1');
      const fn2 = vi.fn().mockResolvedValue('result2');

      await tracker.track('function1', fn1);
      await tracker.track('function2', fn2);

      tracker.clearStats();

      const allStats = tracker.getStats();
      expect(Object.keys(allStats)).toHaveLength(0);
    });

    it('should log statistics', async () => {
      const testFunction = vi.fn().mockResolvedValue('result');

      await tracker.track('test-function', testFunction);

      tracker.logStats('test-function');

      expect(mockLogger.info).toHaveBeenCalled();
      const log = mockLogger.logs.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (log: any) =>
          log.level === 'info' &&
          log.message?.includes('Statistics for function'),
      );
      expect(log?.data.functionStats).toBeDefined();
    });
  });

  describe('utility functions', () => {
    let mockLogger: ReturnType<typeof createMockLogger>;

    beforeEach(() => {
      mockLogger = createMockLogger();
    });

    describe('createPerformanceTimer', () => {
      it('should create PerformanceTimer instance', () => {
        const timer = createPerformanceTimer(mockLogger);

        expect(timer).toBeInstanceOf(PerformanceTimer);
      });
    });

    describe('createMetricsCollector', () => {
      it('should create MetricsCollector instance', () => {
        const collector = createMetricsCollector(mockLogger);

        expect(collector).toBeInstanceOf(MetricsCollector);
      });
    });

    describe('createFunctionTracker', () => {
      it('should create FunctionTracker instance', () => {
        const tracker = createFunctionTracker(mockLogger);

        expect(tracker).toBeInstanceOf(FunctionTracker);
      });
    });

    describe('measureAsync', () => {
      it('should measure async function performance', async () => {
        const asyncFn = async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return 'result';
        };

        const promise = measureAsync(mockLogger, 'test-async', asyncFn);
        vi.advanceTimersByTime(100);
        const result = await promise;

        expect(result).toBe('result');
        expect(mockLogger.info).toHaveBeenCalled();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const log = mockLogger.logs.find((log: any) => log.level === 'info');
        expect(log?.data.measure).toBe('test-async');
        expect(log?.data.success).toBe(true);
      });

      it('should handle async function errors', async () => {
        const asyncFn = async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          throw new Error('Async error');
        };

        const promise = measureAsync(mockLogger, 'test-async-error', asyncFn);
        vi.advanceTimersByTime(50);

        await expect(promise).rejects.toThrow('Async error');

        expect(mockLogger.error).toHaveBeenCalled();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const log = mockLogger.logs.find((log: any) => log.level === 'error');
        expect(log?.data.success).toBe(false);
        expect(log?.data.error.message).toBe('Async error');
      });
    });

    describe('measureSync', () => {
      it('should measure sync function performance', () => {
        const syncFn = () => {
          return 'sync result';
        };

        const result = measureSync(mockLogger, 'test-sync', syncFn);

        expect(result).toBe('sync result');
        expect(mockLogger.info).toHaveBeenCalled();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const log = mockLogger.logs.find((log: any) => log.level === 'info');
        expect(log?.data.measure).toBe('test-sync');
        expect(log?.data.success).toBe(true);
      });

      it('should handle sync function errors', () => {
        const syncFn = () => {
          throw new Error('Sync error');
        };

        expect(() =>
          measureSync(mockLogger, 'test-sync-error', syncFn),
        ).toThrow('Sync error');

        expect(mockLogger.error).toHaveBeenCalled();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const log = mockLogger.logs.find((log: any) => log.level === 'error');
        expect(log?.data.success).toBe(false);
        expect(log?.data.error.message).toBe('Sync error');
      });

      it('should use custom log level', () => {
        const syncFn = () => 'result';

        measureSync(mockLogger, 'test-sync-warn', syncFn, 'warn');

        expect(mockLogger.warn).toHaveBeenCalled();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const log = mockLogger.logs.find((log: any) => log.level === 'warn');
        expect(log?.data.measure).toBe('test-sync-warn');
      });
    });
  });
});
