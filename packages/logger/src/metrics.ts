import { PerformanceFormatter } from './formatters';
import type { BeStaffLogger, LogLevel } from './types';

/**
 * Performance monitoring decorator
 */
export function LogPerformance(
  logger?: BeStaffLogger,
  level: LogLevel = 'info',
  label?: string,
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const logLabel = label || `${target.constructor.name}.${propertyName}`;
      const startTime = Date.now();

      if (logger) {
        logger.debug(`Starting ${logLabel}`);
      }

      try {
        const result = method.apply(this, args);

        // Handle async methods
        if (result && typeof result.then === 'function') {
          return result
            .then((value: any) => {
              const duration = Date.now() - startTime;
              const metrics = PerformanceFormatter.getSystemMetrics();
              metrics.duration = duration;

              if (logger) {
                logger[level](
                  {
                    performance: {
                      method: logLabel,
                      duration: PerformanceFormatter.formatDuration(duration),
                      success: true,
                      metrics,
                    },
                  },
                  `Completed ${logLabel} in ${PerformanceFormatter.formatDuration(duration)}`,
                );
              }

              return value;
            })
            .catch((error: Error) => {
              const duration = Date.now() - startTime;

              if (logger) {
                logger.error(
                  {
                    performance: {
                      method: logLabel,
                      duration: PerformanceFormatter.formatDuration(duration),
                      success: false,
                    },
                    error: {
                      name: error.name,
                      message: error.message,
                      stack: error.stack,
                    },
                  },
                  `Failed ${logLabel} after ${PerformanceFormatter.formatDuration(duration)}`,
                );
              }

              throw error;
            });
        } else {
          // Handle sync methods
          const duration = Date.now() - startTime;
          const metrics = PerformanceFormatter.getSystemMetrics();
          metrics.duration = duration;

          if (logger) {
            logger[level](
              {
                performance: {
                  method: logLabel,
                  duration: PerformanceFormatter.formatDuration(duration),
                  success: true,
                  metrics,
                },
              },
              `Completed ${logLabel} in ${PerformanceFormatter.formatDuration(duration)}`,
            );
          }

          return result;
        }
      } catch (error) {
        const duration = Date.now() - startTime;

        if (logger) {
          logger.error(
            {
              performance: {
                method: logLabel,
                duration: PerformanceFormatter.formatDuration(duration),
                success: false,
              },
              error: {
                name: (error as Error).name,
                message: (error as Error).message,
                stack: (error as Error).stack,
              },
            },
            `Failed ${logLabel} after ${PerformanceFormatter.formatDuration(duration)}`,
          );
        }

        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Performance timer class for manual performance tracking
 */
export class PerformanceTimer {
  private timers = new Map<string, number>();
  private logger: BeStaffLogger;

  constructor(logger: BeStaffLogger) {
    this.logger = logger;
  }

  /**
   * Start a timer
   */
  start(label: string): void {
    this.timers.set(label, Date.now());
    this.logger.debug(`Timer started: ${label}`);
  }

  /**
   * End a timer and log the result
   */
  end(
    label: string,
    level: LogLevel = 'info',
    additionalData?: Record<string, unknown>,
  ): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      this.logger.warn(`Timer '${label}' not found`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.timers.delete(label);

    const metrics = PerformanceFormatter.getSystemMetrics();
    metrics.duration = duration;

    this.logger[level](
      {
        timer: label,
        duration: PerformanceFormatter.formatDuration(duration),
        metrics,
        ...additionalData,
      },
      `Timer '${label}' completed in ${PerformanceFormatter.formatDuration(duration)}`,
    );

    return duration;
  }

  /**
   * Get elapsed time without ending timer
   */
  elapsed(label: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      return 0;
    }
    return Date.now() - startTime;
  }

  /**
   * Check if timer exists
   */
  exists(label: string): boolean {
    return this.timers.has(label);
  }

  /**
   * Clear all timers
   */
  clear(): void {
    this.timers.clear();
  }

  /**
   * Get all active timers
   */
  getActiveTimers(): string[] {
    return Array.from(this.timers.keys());
  }
}

/**
 * System metrics collector
 */
export class MetricsCollector {
  private logger: BeStaffLogger;
  private collectInterval?: NodeJS.Timeout | number;
  private isCollecting = false;

  constructor(logger: BeStaffLogger) {
    this.logger = logger;
  }

  /**
   * Start collecting system metrics at regular intervals
   */
  startCollection(intervalMs = 60000): void {
    if (this.isCollecting) {
      this.logger.warn('Metrics collection already started');
      return;
    }

    this.isCollecting = true;
    this.collectInterval = setInterval(() => {
      this.collectSystemMetrics();
    }, intervalMs);

    this.logger.info(
      `Started metrics collection with ${intervalMs}ms interval`,
    );
  }

  /**
   * Stop collecting system metrics
   */
  stopCollection(): void {
    if (this.collectInterval) {
      clearInterval(this.collectInterval);
      delete (this as any).collectInterval;
    }

    this.isCollecting = false;
    this.logger.info('Stopped metrics collection');
  }

  /**
   * Collect and log current system metrics
   */
  collectSystemMetrics(): void {
    const metrics = PerformanceFormatter.getSystemMetrics();

    // Add additional Node.js specific metrics
    if (typeof process !== 'undefined') {
      const cpuUsage = process.cpuUsage();
      const uptime = process.uptime();

      (metrics as any).cpu = {
        user: cpuUsage.user,
        system: cpuUsage.system,
      };

      metrics.uptime = uptime;

      // Event loop lag (approximate)
      if (process.hrtime) {
        const start = process.hrtime.bigint();
        setImmediate(() => {
          const lag = Number(process.hrtime.bigint() - start) / 1e6; // Convert to ms
          this.logger.debug(
            {
              eventLoopLag: lag,
              metrics,
            },
            'System metrics collected',
          );
        });
        return;
      }
    }

    this.logger.debug({ metrics }, 'System metrics collected');
  }

  /**
   * Log custom metrics
   */
  logMetrics(
    name: string,
    value: number,
    unit: string,
    tags?: Record<string, string>,
    level: LogLevel = 'info',
  ): void {
    this.logger[level](
      {
        metric: {
          name,
          value,
          unit,
          tags,
          timestamp: new Date().toISOString(),
        },
      },
      `Metric: ${name} = ${value} ${unit}`,
    );
  }

  /**
   * Log counter metric
   */
  logCounter(name: string, count = 1, tags?: Record<string, string>): void {
    this.logMetrics(name, count, 'count', tags);
  }

  /**
   * Log gauge metric
   */
  logGauge(
    name: string,
    value: number,
    unit: string,
    tags?: Record<string, string>,
  ): void {
    this.logMetrics(name, value, unit, tags);
  }

  /**
   * Log histogram metric
   */
  logHistogram(
    name: string,
    value: number,
    unit: string,
    tags?: Record<string, string>,
  ): void {
    this.logMetrics(name, value, unit, { ...tags, type: 'histogram' });
  }
}

/**
 * Function execution tracker
 */
export class FunctionTracker {
  private logger: BeStaffLogger;
  private executions = new Map<
    string,
    { count: number; totalDuration: number; errors: number }
  >();

  constructor(logger: BeStaffLogger) {
    this.logger = logger;
  }

  /**
   * Track function execution
   */
  async track<T>(
    name: string,
    fn: () => Promise<T> | T,
    logLevel: LogLevel = 'debug',
  ): Promise<T> {
    const startTime = Date.now();
    const stats = this.executions.get(name) || {
      count: 0,
      totalDuration: 0,
      errors: 0,
    };

    try {
      const result = await fn();
      const duration = Date.now() - startTime;

      stats.count++;
      stats.totalDuration += duration;
      this.executions.set(name, stats);

      this.logger[logLevel](
        {
          function: name,
          duration: PerformanceFormatter.formatDuration(duration),
          stats: {
            executions: stats.count,
            averageDuration: PerformanceFormatter.formatDuration(
              stats.totalDuration / stats.count,
            ),
            errorRate: stats.errors / stats.count,
          },
        },
        `Function ${name} executed in ${PerformanceFormatter.formatDuration(duration)}`,
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      stats.count++;
      stats.totalDuration += duration;
      stats.errors++;
      this.executions.set(name, stats);

      this.logger.error(
        {
          function: name,
          duration: PerformanceFormatter.formatDuration(duration),
          error: {
            name: (error as Error).name,
            message: (error as Error).message,
          },
          stats: {
            executions: stats.count,
            averageDuration: PerformanceFormatter.formatDuration(
              stats.totalDuration / stats.count,
            ),
            errorRate: stats.errors / stats.count,
          },
        },
        `Function ${name} failed after ${PerformanceFormatter.formatDuration(duration)}`,
      );

      throw error;
    }
  }

  /**
   * Get execution statistics
   */
  getStats(name?: string): Record<string, any> {
    if (name) {
      const stats = this.executions.get(name);
      if (!stats) return {};

      return {
        executions: stats.count,
        totalDuration: PerformanceFormatter.formatDuration(stats.totalDuration),
        averageDuration: PerformanceFormatter.formatDuration(
          stats.totalDuration / stats.count,
        ),
        errors: stats.errors,
        errorRate: stats.errors / stats.count,
      };
    }

    const allStats: Record<string, any> = {};
    for (const [functionName, stats] of this.executions) {
      allStats[functionName] = {
        executions: stats.count,
        totalDuration: PerformanceFormatter.formatDuration(stats.totalDuration),
        averageDuration: PerformanceFormatter.formatDuration(
          stats.totalDuration / stats.count,
        ),
        errors: stats.errors,
        errorRate: stats.errors / stats.count,
      };
    }

    return allStats;
  }

  /**
   * Clear execution statistics
   */
  clearStats(name?: string): void {
    if (name) {
      this.executions.delete(name);
    } else {
      this.executions.clear();
    }
  }

  /**
   * Log execution statistics
   */
  logStats(name?: string, level: LogLevel = 'info'): void {
    const stats = this.getStats(name);

    this.logger[level](
      {
        functionStats: stats,
      },
      name
        ? `Statistics for function ${name}`
        : 'Function execution statistics',
    );
  }
}

/**
 * Create a performance timer for a logger
 */
export function createPerformanceTimer(
  logger: BeStaffLogger,
): PerformanceTimer {
  return new PerformanceTimer(logger);
}

/**
 * Create a metrics collector for a logger
 */
export function createMetricsCollector(
  logger: BeStaffLogger,
): MetricsCollector {
  return new MetricsCollector(logger);
}

/**
 * Create a function tracker for a logger
 */
export function createFunctionTracker(logger: BeStaffLogger): FunctionTracker {
  return new FunctionTracker(logger);
}

/**
 * Utility function to measure async function performance
 */
export async function measureAsync<T>(
  logger: BeStaffLogger,
  label: string,
  fn: () => Promise<T>,
  level: LogLevel = 'info',
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    const metrics = PerformanceFormatter.getSystemMetrics();
    metrics.duration = duration;

    logger[level](
      {
        measure: label,
        duration: PerformanceFormatter.formatDuration(duration),
        success: true,
        metrics,
      },
      `Completed ${label} in ${PerformanceFormatter.formatDuration(duration)}`,
    );

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    logger.error(
      {
        measure: label,
        duration: PerformanceFormatter.formatDuration(duration),
        success: false,
        error: {
          name: (error as Error).name,
          message: (error as Error).message,
        },
      },
      `Failed ${label} after ${PerformanceFormatter.formatDuration(duration)}`,
    );

    throw error;
  }
}

/**
 * Utility function to measure sync function performance
 */
export function measureSync<T>(
  logger: BeStaffLogger,
  label: string,
  fn: () => T,
  level: LogLevel = 'info',
): T {
  const startTime = Date.now();

  try {
    const result = fn();
    const duration = Date.now() - startTime;
    const metrics = PerformanceFormatter.getSystemMetrics();
    metrics.duration = duration;

    logger[level](
      {
        measure: label,
        duration: PerformanceFormatter.formatDuration(duration),
        success: true,
        metrics,
      },
      `Completed ${label} in ${PerformanceFormatter.formatDuration(duration)}`,
    );

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    logger.error(
      {
        measure: label,
        duration: PerformanceFormatter.formatDuration(duration),
        success: false,
        error: {
          name: (error as Error).name,
          message: (error as Error).message,
        },
      },
      `Failed ${label} after ${PerformanceFormatter.formatDuration(duration)}`,
    );

    throw error;
  }
}
