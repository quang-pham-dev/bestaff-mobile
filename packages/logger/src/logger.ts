import {
  ContextFormatter,
  ErrorSerializer,
  MessageFormatter,
  PerformanceFormatter,
} from './formatters';
import type {
  BeStaffLogger,
  ErrorInfo,
  LogContext,
  LogLevel,
  LoggerConfig,
  PerformanceMetrics,
} from './types';
import type { Logger as PinoLogger } from 'pino';

/**
 * Enhanced logger implementation with context awareness and request tracing
 */
export class BeStaffLoggerImpl implements BeStaffLogger {
  private pinoLogger: PinoLogger;
  private config: LoggerConfig;
  private context: LogContext;
  private timers = new Map<string, number>();

  constructor(pinoLogger: PinoLogger, config: LoggerConfig) {
    this.pinoLogger = pinoLogger;
    this.config = config;
    this.context = config.context || {};
  }

  // Standard log methods with enhanced functionality
  trace(obj: object | string, msg?: string, ...args: unknown[]): void {
    this.log('trace', obj, msg, ...args);
  }

  debug(obj: object | string, msg?: string, ...args: unknown[]): void {
    this.log('debug', obj, msg, ...args);
  }

  info(obj: object | string, msg?: string, ...args: unknown[]): void {
    this.log('info', obj, msg, ...args);
  }

  warn(obj: object | string, msg?: string, ...args: unknown[]): void {
    this.log('warn', obj, msg, ...args);
  }

  error(obj: object | string, msg?: string, ...args: unknown[]): void {
    this.log('error', obj, msg, ...args);
  }

  fatal(obj: object | string, msg?: string, ...args: unknown[]): void {
    this.log('fatal', obj, msg, ...args);
  }

  /**
   * Internal log method that handles all log levels
   */
  private log(
    level: LogLevel,
    obj: object | string,
    msg?: string,
    ...args: unknown[]
  ): void {
    if (typeof obj === 'string') {
      // Simple message logging
      const formattedMsg = MessageFormatter.format(obj, this.context);
      const logData = MessageFormatter.createStructured(
        formattedMsg,
        this.context,
      );
      this.pinoLogger[level](logData, obj, ...args);
    } else {
      // Structured logging with object
      const sanitizedContext = ContextFormatter.sanitizeContext(this.context);
      const mergedObj = {
        ...ContextFormatter.toLogFields(sanitizedContext),
        ...obj,
      };

      if (msg) {
        const formattedMsg = MessageFormatter.format(msg, this.context);
        this.pinoLogger[level](mergedObj, formattedMsg);
      } else {
        this.pinoLogger[level](mergedObj);
      }
    }
  }

  /**
   * Create a logger with additional context
   */
  withContext(context: Partial<LogContext>): BeStaffLogger {
    const mergedContext = ContextFormatter.mergeContexts(this.context, context);
    const newLogger = new BeStaffLoggerImpl(this.pinoLogger, this.config);
    newLogger.context = mergedContext;
    return newLogger;
  }

  /**
   * Create a logger with error context
   */
  withError(error: Error | ErrorInfo): BeStaffLogger {
    const errorInfo = ErrorSerializer.serialize(error);
    return this.withContext({ error: errorInfo });
  }

  /**
   * Create a logger with performance metrics
   */
  withMetrics(metrics: PerformanceMetrics): BeStaffLogger {
    return this.withContext({ metrics });
  }

  /**
   * Create a logger with request context
   */
  withRequest(requestId: string, userId?: string): BeStaffLogger {
    const requestContext: Partial<LogContext> = { requestId };
    if (userId) {
      requestContext.userId = userId;
    }
    return this.withContext(requestContext);
  }

  /**
   * Start a performance timer
   */
  time(label = 'default'): () => void {
    const startTime = Date.now();
    this.timers.set(label, startTime);

    // Return a function to end the timer
    return () => {
      this.timeEnd(label);
    };
  }

  /**
   * End a performance timer and log the result
   */
  timeEnd(label: string, level: LogLevel = 'info'): void {
    const startTime = this.timers.get(label);
    if (!startTime) {
      this.warn(`Timer '${label}' not found`);
      return;
    }

    const duration = Date.now() - startTime;
    this.timers.delete(label);

    const metrics = PerformanceFormatter.getSystemMetrics();
    metrics.duration = duration;

    this[level](
      {
        timer: label,
        duration: PerformanceFormatter.formatDuration(duration),
        metrics,
      },
      `Timer '${label}' completed in ${PerformanceFormatter.formatDuration(duration)}`,
    );
  }

  /**
   * Create a child logger with additional bindings
   */
  child(bindings: Record<string, unknown>): BeStaffLogger {
    const childPinoLogger = this.pinoLogger.child(bindings);
    const childLogger = new BeStaffLoggerImpl(childPinoLogger, this.config);
    childLogger.context = ContextFormatter.mergeContexts(
      this.context,
      bindings,
    );
    return childLogger;
  }

  /**
   * Flush all pending log entries
   */
  flush(): void {
    if (typeof this.pinoLogger.flush === 'function') {
      this.pinoLogger.flush();
    }
  }

  // Expose pino properties and methods
  get level(): string {
    return this.pinoLogger.level;
  }

  set level(level: string) {
    this.pinoLogger.level = level;
  }

  get levelVal(): number {
    return this.pinoLogger.levelVal;
  }

  get useLevelLabels(): boolean {
    return this.pinoLogger.useLevelLabels;
  }

  get levels(): unknown {
    return this.pinoLogger.levels;
  }

  isLevelEnabled(level: string): boolean {
    return this.pinoLogger.isLevelEnabled(level);
  }

  // Additional utility methods
  silent(): void {
    if (typeof this.pinoLogger.silent === 'function') {
      (this.pinoLogger as any).silent();
    }
  }

  // Bindings and version
  get bindings(): unknown {
    return this.pinoLogger.bindings;
  }

  get version(): string {
    return this.pinoLogger.version;
  }

  // Stream operations
  addLevel(name: string, value: number): boolean {
    return (this.pinoLogger as any).addLevel?.(name, value) || false;
  }

  // Serializers
  get serializers(): unknown {
    return (this.pinoLogger as any).serializers || {};
  }

  // Additional context methods
  getCurrentContext(): LogContext {
    return { ...this.context };
  }

  clearContext(): BeStaffLogger {
    const newLogger = new BeStaffLoggerImpl(this.pinoLogger, this.config);
    newLogger.context = {};
    return newLogger;
  }

  /**
   * Log an HTTP request
   */

  logRequest(req: any, level: LogLevel = 'info'): void {
    const requestContext = ContextFormatter.extractRequestContext(req);
    const logData = {
      ...requestContext,
      method: req.method,
      url: req.url || req.originalUrl,
      userAgent: req.headers?.['user-agent'],
      ip: req.ip || req.connection?.remoteAddress,
    };

    this[level](logData, `${req.method} ${req.url || req.originalUrl}`);
  }

  /**
   * Log an HTTP response
   */

  logResponse(res: any, duration?: number, level: LogLevel = 'info'): void {
    const logData: any = {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
    };

    if (duration !== undefined) {
      logData.responseTime = PerformanceFormatter.formatDuration(duration);
      logData.duration = duration;
    }

    this[level](logData, `Response ${res.statusCode}`);
  }

  /**
   * Log a database query
   */

  logQuery(query: any, duration?: number, level: LogLevel = 'debug'): void {
    const logData: any = {
      query: MessageFormatter.maskSensitive(query),
    };

    if (duration !== undefined) {
      logData.queryTime = PerformanceFormatter.formatDuration(duration);
      logData.duration = duration;
    }

    this[level](logData, 'Database query executed');
  }

  /**
   * Log a cache operation
   */
  logCache(
    operation: 'hit' | 'miss' | 'set' | 'delete',
    key: string,
    level: LogLevel = 'debug',
  ): void {
    this[level](
      {
        cache: {
          operation,
          key,
        },
      },
      `Cache ${operation}: ${key}`,
    );
  }

  /**
   * Log an external API call
   */
  logApiCall(
    method: string,
    url: string,
    statusCode?: number,
    duration?: number,
    level: LogLevel = 'info',
  ): void {
    const logData: any = {
      api: {
        method,
        url,
        statusCode,
      },
    };

    if (duration !== undefined) {
      logData.api.duration = duration;
      logData.api.responseTime = PerformanceFormatter.formatDuration(duration);
    }

    this[level](logData, `API call: ${method} ${url} ${statusCode || ''}`);
  }
}

/**
 * Create an BeStaffLogger instance from a pino logger
 */
export function createBeStaffLogger(
  pinoLogger: PinoLogger,
  config: LoggerConfig,
): BeStaffLogger {
  return new BeStaffLoggerImpl(pinoLogger, config);
}
