import type { ErrorInfo, LogContext, PerformanceMetrics } from './types';

/**
 * Error serialization utilities
 */
export class ErrorSerializer {
  /**
   * Serialize an Error object to a structured format
   */
  static serialize(error: Error | ErrorInfo | unknown): ErrorInfo {
    if (!error) {
      return { name: 'Unknown', message: 'No error information available' };
    }

    // If it's already a structured ErrorInfo
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      'message' in error
    ) {
      return error as ErrorInfo;
    }

    // If it's a standard Error object
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        ...(error.stack !== undefined && { stack: error.stack }),
        // Extract additional properties that might exist on custom errors
        ...this.extractAdditionalErrorProps(error),
      };
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        name: 'StringError',
        message: error,
      };
    }

    // Handle other types
    return {
      name: 'UnknownError',
      message: String(error),
    };
  }

  /**
   * Extract additional properties from error objects
   */
  private static extractAdditionalErrorProps(
    error: Error,
  ): Record<string, unknown> {
    const additionalProps: Record<string, unknown> = {};
    const standardProps = ['name', 'message', 'stack', 'cause'];

    for (const [key, value] of Object.entries(error)) {
      if (!standardProps.includes(key)) {
        additionalProps[key] = value;
      }
    }

    return additionalProps;
  }

  /**
   * Create a sanitized error for logging (removes sensitive data)
   */
  static sanitize(error: Error | ErrorInfo | unknown): ErrorInfo {
    const serialized = this.serialize(error);

    // Remove potentially sensitive stack traces in production
    if (process.env.NODE_ENV === 'production') {
      delete serialized.stack;
    }

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'authorization', 'cookie'];
    sensitiveFields.forEach((field) => {
      if (field in serialized) {
        serialized[field] = '[REDACTED]';
      }
    });

    return serialized;
  }
}

/**
 * Performance metrics utilities
 */
export class PerformanceFormatter {
  private static timers = new Map<string, number>();

  /**
   * Start a performance timer
   */
  static startTimer(label: string): void {
    this.timers.set(label, Date.now());
  }

  /**
   * End a performance timer and return metrics
   */
  static endTimer(label: string): PerformanceMetrics {
    const startTime = this.timers.get(label);
    if (!startTime) {
      return { duration: 0 };
    }

    const duration = Date.now() - startTime;
    this.timers.delete(label);

    return {
      duration,
      ...this.getSystemMetrics(),
    };
  }

  /**
   * Get current system metrics
   */
  static getSystemMetrics(): PerformanceMetrics {
    const metrics: PerformanceMetrics = {};

    // Node.js memory usage
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      metrics.memory = {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
      };
    }

    // Browser performance metrics
    if (typeof performance !== 'undefined') {
      if ((performance as any).memory) {
        metrics.memory = {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
        };
      }
    }

    return metrics;
  }

  /**
   * Format duration in human-readable format
   */
  static formatDuration(duration: number): string {
    if (duration < 1000) {
      return `${duration}ms`;
    }

    const seconds = (duration / 1000).toFixed(2);
    return `${seconds}s`;
  }

  /**
   * Format memory usage in human-readable format
   */
  static formatMemory(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)}${units[unitIndex]}`;
  }
}

/**
 * Context formatting utilities
 */
export class ContextFormatter {
  /**
   * Merge multiple contexts with priority
   */
  static mergeContexts(
    ...contexts: Array<Partial<LogContext> | undefined>
  ): LogContext {
    return contexts.reduce<LogContext>((merged, context) => {
      if (!context) return merged;
      return { ...merged, ...context };
    }, {});
  }

  /**
   * Extract request context from HTTP request-like objects
   */
  static extractRequestContext(req: any): Partial<LogContext> {
    const context: Partial<LogContext> = {};

    // Common request ID headers
    const requestIdHeaders = [
      'x-request-id',
      'x-correlation-id',
      'request-id',
      'correlation-id',
    ];

    for (const header of requestIdHeaders) {
      if (req.headers?.[header]) {
        context.requestId = req.headers[header];
        break;
      }
    }

    // Extract trace information
    const traceHeaders = ['x-trace-id', 'trace-id', 'traceparent'];

    for (const header of traceHeaders) {
      if (req.headers?.[header]) {
        context.traceId = req.headers[header];
        break;
      }
    }

    // Extract user information
    if (req.user?.id) {
      context.userId = req.user.id;
    }

    // Extract session information
    if (req.session?.id) {
      context.sessionId = req.session.id;
    }

    return context;
  }

  /**
   * Sanitize context for logging (remove sensitive data)
   */
  static sanitizeContext(context: LogContext): LogContext {
    const sanitized = { ...context };

    // List of sensitive fields to redact
    const sensitiveFields = [
      'password',
      'token',
      'authorization',
      'cookie',
      'secret',
      'key',
      'apiKey',
      'accessToken',
      'refreshToken',
    ];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Convert context to structured log fields
   */
  static toLogFields(context: LogContext): Record<string, unknown> {
    return Object.entries(context).reduce(
      (fields, [key, value]) => {
        // Handle nested objects
        if (typeof value === 'object' && value !== null) {
          try {
            fields[key] = JSON.stringify(value);
          } catch {
            fields[key] = '[Object]';
          }
        } else {
          fields[key] = value;
        }
        return fields;
      },
      {} as Record<string, unknown>,
    );
  }
}

/**
 * Message formatting utilities
 */
export class MessageFormatter {
  /**
   * Format a log message with context
   */
  static format(message: string, context?: Record<string, unknown>): string {
    if (!context || Object.keys(context).length === 0) {
      return message;
    }

    // Simple template replacement
    return message.replace(/\{(\w+)\}/g, (match, key) => {
      return context[key]?.toString() || match;
    });
  }

  /**
   * Create a structured log message
   */
  static createStructured(
    message: string,
    context?: LogContext,
    error?: Error | ErrorInfo,
    metrics?: PerformanceMetrics,
  ): Record<string, unknown> {
    const logEntry: Record<string, unknown> = {
      msg: message,
    };

    if (context) {
      Object.assign(logEntry, ContextFormatter.toLogFields(context));
    }

    if (error) {
      logEntry.error = ErrorSerializer.sanitize(error);
    }

    if (metrics) {
      logEntry.metrics = metrics;
    }

    return logEntry;
  }

  /**
   * Truncate long messages
   */
  static truncate(message: string, maxLength = 1000): string {
    if (message.length <= maxLength) {
      return message;
    }

    return `${message.substring(0, maxLength - 3)}...`;
  }

  /**
   * Mask sensitive data in messages
   */
  static maskSensitive(message: string): string {
    // Common patterns for sensitive data
    const patterns = [
      // Credit card numbers
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
      // Email addresses (partial masking)
      /([\w.-]+)@([\w.-]+\.[\w.-]+)/g,
      // Phone numbers
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      // API keys (basic pattern)
      /[a-zA-Z0-9]{20,}/g,
    ];

    let masked = message;

    patterns.forEach((pattern) => {
      if (pattern.source.includes('([')) {
        // Patterns with groups - partial masking
        masked = masked.replace(pattern, (match, ...groups) => {
          if (groups.length >= 2) {
            // Email masking - show first 2 chars of username
            const username = groups[0];
            const domain = groups[1];
            return `${username.substring(0, 2)}***@${domain}`;
          }
          return '***';
        });
      } else {
        // Simple replacement
        masked = masked.replace(pattern, '***');
      }
    });

    return masked;
  }
}
