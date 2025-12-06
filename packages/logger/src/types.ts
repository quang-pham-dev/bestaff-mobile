import type { LoggerOptions as PinoLoggerOptions } from 'pino';

// Log levels
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// Environment types
export type Environment = 'development' | 'production' | 'test' | 'staging';

// Service types for different parts of the orbit platform
export type ServiceType = 'mobile';

// Transport types
export type TransportType = 'console' | 'file' | 'custom';

// Log context for structured logging
export interface LogContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  traceId?: string;
  spanId?: string;
  service?: ServiceType;
  environment?: Environment;
  version?: string;
  [key: string]: unknown;
}

// Performance metrics
export interface PerformanceMetrics {
  duration?: number;
  memory?: {
    used: number;
    total: number;
  };
  cpu?:
    | number
    | {
        user: number;
        system: number;
      };
  [key: string]: unknown;
}

// Error information
export interface ErrorInfo {
  name: string;
  message: string;
  stack?: string;
  code?: string | number;
  statusCode?: number;
  cause?: unknown;
  [key: string]: unknown;
}

// Transport configuration
export interface TransportConfig {
  type: TransportType;
  level?: LogLevel;
  options?: Record<string, unknown>;
}

// Logger configuration
export interface LoggerConfig {
  service: ServiceType;
  environment: Environment;
  level?: LogLevel;
  version?: string;
  transports?: TransportConfig[];
  enablePretty?: boolean;
  enableHttp?: boolean;
  enableMetrics?: boolean;
  context?: LogContext;
  pinoOptions?: Partial<PinoLoggerOptions>;
}

// Enhanced logger interface
export interface BeStaffLogger {
  // Standard log methods with context support
  trace(obj: object, msg?: string, ...args: unknown[]): void;
  trace(msg: string, ...args: unknown[]): void;

  debug(obj: object, msg?: string, ...args: unknown[]): void;
  debug(msg: string, ...args: unknown[]): void;

  info(obj: object, msg?: string, ...args: unknown[]): void;
  info(msg: string, ...args: unknown[]): void;

  warn(obj: object, msg?: string, ...args: unknown[]): void;
  warn(msg: string, ...args: unknown[]): void;

  error(obj: object, msg?: string, ...args: unknown[]): void;
  error(msg: string, ...args: unknown[]): void;

  fatal(obj: object, msg?: string, ...args: unknown[]): void;
  fatal(msg: string, ...args: unknown[]): void;

  // Enhanced methods
  withContext(context: Partial<LogContext>): BeStaffLogger;
  withError(error: Error | ErrorInfo): BeStaffLogger;
  withMetrics(metrics: PerformanceMetrics): BeStaffLogger;
  withRequest(requestId: string, userId?: string): BeStaffLogger;

  // Performance logging
  time(label?: string): () => void;
  timeEnd(label: string, level?: LogLevel): void;

  // Utility methods
  child(bindings: Record<string, unknown>): BeStaffLogger;
  flush(): void;

  // Pino compatibility properties
  level: string;
  levelVal: number;
  isLevelEnabled(level: string): boolean;
}

// HTTP logging options
export interface HttpLoggerOptions {
  enabled?: boolean;
  level?: LogLevel;
  serializers?: Record<string, (obj: unknown) => unknown>;
  customLogLevel?: (req: unknown, res: unknown, err?: Error) => LogLevel;
  customSuccessMessage?: (req: unknown, res: unknown) => string;
  customErrorMessage?: (req: unknown, res: unknown, err: Error) => string;
  includeReqId?: boolean;
  reqIdHeader?: string;
  genReqId?: () => string;
}

// Logger factory options
export interface LoggerFactoryOptions {
  defaultConfig?: Partial<LoggerConfig>;
  globalContext?: LogContext;
}

// Async local storage context for request tracing
export interface AsyncContext {
  requestId?: string;
  traceId?: string;
  spanId?: string;
  userId?: string;
  sessionId?: string;
}
