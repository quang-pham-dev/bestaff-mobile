import {
  LogPerformance,
  createFunctionTracker,
  createMetricsCollector,
  createPerformanceTimer,
  measureAsync,
  measureSync,
} from './metrics';
import {
  expressMiddleware,
  fastifyPlugin,
  nextjsMiddleware,
} from './middleware';
import { initializeServiceLoggers } from './services';
import {
  createApiLogger,
  createDatabaseLogger,
  createDomainLogger,
  createFeatureLogger,
  createJobLogger,
  createRequestLogger,
  createTestLogger,
  createUserLogger,
  mobileLogger,
} from './services';
// Default export - create logger for current service
import { currentServiceLogger } from './services';
import type {
  BeStaffLogger,
  Environment,
  HttpLoggerOptions,
  LoggerConfig,
  ServiceType,
} from './types';

export type {
  BeStaffLogger,
  LoggerConfig,
  LogLevel,
  Environment,
  ServiceType,
  LogContext,
  ErrorInfo,
  PerformanceMetrics,
  HttpLoggerOptions,
  TransportConfig,
  TransportType,
  LoggerFactoryOptions,
  AsyncContext,
} from './types';

// Configuration utilities
export {
  createBaseConfig,
  getEnvironment,
  getServiceName,
  getVersion,
  getLogLevel,
  shouldEnablePretty,
  isBrowser,
  isNode,
} from './config';

// Logger factory
export {
  LoggerFactory,
  createLogger,
  getLoggerFactory,
  configureLogger,
} from './factory';

// Core logger implementation
export { BeStaffLoggerImpl, createBeStaffLogger } from './logger';

// Formatting utilities
export {
  ErrorSerializer,
  PerformanceFormatter,
  ContextFormatter,
  MessageFormatter,
} from './formatters';

// HTTP middleware
export {
  HttpLoggerMiddleware,
  createHttpMiddleware,
  expressMiddleware,
  fastifyPlugin,
  nextjsMiddleware,
  pinoHttpMiddleware,
} from './middleware';

// Service-specific loggers
export {
  ServiceLoggers,
  mobileLogger,
  currentServiceLogger,
  createDomainLogger,
  createFeatureLogger,
  createUserLogger,
  createRequestLogger,
  createDatabaseLogger,
  createApiLogger,
  createJobLogger,
  createTestLogger,
  initializeServiceLoggers,
  getAllServiceLoggers,
} from './services';

// Performance monitoring and metrics
export {
  LogPerformance,
  PerformanceTimer,
  MetricsCollector,
  FunctionTracker,
  createPerformanceTimer,
  createMetricsCollector,
  createFunctionTracker,
  measureAsync,
  measureSync,
} from './metrics';

export default currentServiceLogger;

// Convenience exports for quick usage
const logger = currentServiceLogger();

export {
  // Quick access to current service logger
  logger,
};

// Re-export pino types for convenience
export type {
  Logger as PinoLogger,
  LoggerOptions as PinoLoggerOptions,
} from 'pino';

/**
 * Initialize the logger package with global configuration
 *
 * @example
 * ```typescript
 * import { initialize } from '@orbit-platform/logger';
 *
 * initialize({
 *   service: 'web',
 *   environment: 'production',
 *   level: 'info'
 * });
 * ```
 */
export function initialize(config?: Partial<LoggerConfig>): void {
  return initializeServiceLoggers(config);
}

/**
 * Quick setup for common use cases
 */
export const quick = {
  /**
   * Get logger for mobile applications
   */
  mobile: () => mobileLogger(),

  /**
   * Get logger for current service (auto-detected)
   */
  current: () => currentServiceLogger(),

  /**
   * Create Express.js middleware
   */
  expressMiddleware: (
    service: ServiceType,
    environment?: Environment,
    options?: HttpLoggerOptions,
  ) => expressMiddleware(service, environment, options),

  /**
   * Create Fastify plugin
   */
  fastifyPlugin: (
    service: ServiceType,
    environment?: Environment,
    options?: HttpLoggerOptions,
  ) => fastifyPlugin(service, environment, options),

  /**
   * Create Next.js middleware
   */
  nextjsMiddleware: (
    service: ServiceType,
    environment?: Environment,
    options?: HttpLoggerOptions,
  ) => nextjsMiddleware(service, environment, options),
};

/**
 * Utility functions for common logging scenarios
 */
export const utils = {
  /**
   * Create a request-scoped logger
   */
  request: (requestId: string, userId?: string, service?: ServiceType) =>
    createRequestLogger(requestId, userId, service),

  /**
   * Create a user-scoped logger
   */
  user: (userId: string, service?: ServiceType) =>
    createUserLogger(userId, service),

  /**
   * Create a feature-scoped logger
   */
  feature: (feature: string, service?: ServiceType) =>
    createFeatureLogger(feature, service),

  /**
   * Create a domain-scoped logger
   */
  domain: (domain: string, service?: ServiceType) =>
    createDomainLogger(domain, service),

  /**
   * Create a database logger
   */
  database: (database: string, service?: ServiceType) =>
    createDatabaseLogger(database, service),

  /**
   * Create an API logger
   */
  api: (apiName: string, service?: ServiceType) =>
    createApiLogger(apiName, service),

  /**
   * Create a job logger
   */
  job: (jobName: string, jobId?: string, service?: ServiceType) =>
    createJobLogger(jobName, jobId, service),

  /**
   * Create a test logger
   */
  test: (testSuite?: string, testCase?: string) =>
    createTestLogger(testSuite, testCase),
};

/**
 * Performance monitoring utilities
 */
export const performance = {
  /**
   * Decorator for automatic performance logging
   */
  get decorator() {
    return LogPerformance;
  },

  /**
   * Create a performance timer
   */
  timer: (logger: BeStaffLogger) => createPerformanceTimer(logger),

  /**
   * Create a metrics collector
   */
  metrics: (logger: BeStaffLogger) => createMetricsCollector(logger),

  /**
   * Create a function tracker
   */
  tracker: (logger: BeStaffLogger) => createFunctionTracker(logger),

  /**
   * Measure async function performance
   */
  measureAsync,

  /**
   * Measure sync function performance
   */
  measureSync,
};
