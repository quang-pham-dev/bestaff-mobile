import { getEnvironment, getServiceName, getVersion } from './config';
import { configureLogger, createLogger } from './factory';
import type {
  BeStaffLogger,
  Environment,
  LoggerConfig,
  ServiceType,
} from './types';

/**
 * Pre-configured logger instances for different services
 */
export class ServiceLoggers {
  private static loggers: Map<ServiceType, BeStaffLogger> = new Map();
  private static initialized = false;

  /**
   * Initialize service loggers with global configuration
   */
  static initialize(globalConfig?: Partial<LoggerConfig>): void {
    if (this.initialized) return;

    if (globalConfig) {
      configureLogger({
        defaultConfig: globalConfig,
        globalContext: {
          platform: 'bestaff-mobile',
          version: getVersion(),
          environment: getEnvironment(),
        },
      });
    }

    this.initialized = true;
  }

  /**
   * Get or create a logger for a specific service
   */
  static getServiceLogger(
    service: ServiceType,
    environment?: Environment,
  ): BeStaffLogger {
    if (!this.loggers.has(service)) {
      this.loggers.set(service, this.createServiceLogger(service, environment));
    }
    return this.loggers.get(service)!;
  }

  /**
   * Create a service-specific logger
   */
  private static createServiceLogger(
    service: ServiceType,
    environment?: Environment,
  ): BeStaffLogger {
    const env = environment || getEnvironment();

    switch (service) {
      case 'mobile':
        return createLogger('mobile', env, {
          enablePretty: true,
          enableHttp: false,
          enableMetrics: false,
          level: env === 'development' ? 'debug' : 'warn',
          context: {
            service: 'mobile',
            type: 'frontend',
            platform: 'react-native',
          },
        });

      default:
        return createLogger(service, env);
    }
  }

  /**
   * Clear all cached loggers
   */
  static clearCache(): void {
    this.loggers.clear();
  }

  /**
   * Update logger for a specific service
   */
  static updateServiceLogger(
    service: ServiceType,
    config: Partial<LoggerConfig>,
  ): void {
    const existingLogger = this.loggers.get(service);
    if (existingLogger) {
      this.loggers.delete(service);
    }

    const newLogger = createLogger(service, undefined, config);
    this.loggers.set(service, newLogger);
  }
}

/**
 * Mobile application logger
 */
export const mobileLogger = (): BeStaffLogger => {
  return ServiceLoggers.getServiceLogger('mobile');
};

/**
 * Get logger for current service (auto-detected)
 */
export const currentServiceLogger = (): BeStaffLogger => {
  const service = getServiceName();
  return ServiceLoggers.getServiceLogger(service);
};

/**
 * Create a domain-specific logger (e.g., for different business domains)
 */
export function createDomainLogger(
  domain: string,
  service?: ServiceType,
  config?: Partial<LoggerConfig>,
): BeStaffLogger {
  const svc = service || getServiceName();
  const baseLogger = ServiceLoggers.getServiceLogger(svc);

  return baseLogger.withContext({
    domain,
    ...config?.context,
  });
}

/**
 * Create a feature-specific logger
 */
export function createFeatureLogger(
  feature: string,
  service?: ServiceType,
  config?: Partial<LoggerConfig>,
): BeStaffLogger {
  const svc = service || getServiceName();
  const baseLogger = ServiceLoggers.getServiceLogger(svc);

  return baseLogger.withContext({
    feature,
    ...config?.context,
  });
}

/**
 * Create a user-scoped logger
 */
export function createUserLogger(
  userId: string,
  service?: ServiceType,
  additionalContext?: Record<string, unknown>,
): BeStaffLogger {
  const svc = service || getServiceName();
  const baseLogger = ServiceLoggers.getServiceLogger(svc);

  return baseLogger.withContext({
    userId,
    ...additionalContext,
  });
}

/**
 * Create a request-scoped logger
 */
export function createRequestLogger(
  requestId: string,
  userId?: string,
  service?: ServiceType,
  additionalContext?: Record<string, unknown>,
): BeStaffLogger {
  const svc = service || getServiceName();
  const baseLogger = ServiceLoggers.getServiceLogger(svc);

  return baseLogger.withContext({
    requestId,
    ...(userId !== undefined && { userId }),
    ...additionalContext,
  });
}

/**
 * Logger for database operations
 */
export function createDatabaseLogger(
  database: string,
  service?: ServiceType,
): BeStaffLogger {
  const svc = service || getServiceName();
  const baseLogger = ServiceLoggers.getServiceLogger(svc);

  return baseLogger.withContext({
    database,
    component: 'database',
  });
}

/**
 * Logger for external API calls
 */
export function createApiLogger(
  apiName: string,
  service?: ServiceType,
): BeStaffLogger {
  const svc = service || getServiceName();
  const baseLogger = ServiceLoggers.getServiceLogger(svc);

  return baseLogger.withContext({
    api: apiName,
    component: 'external-api',
  });
}

/**
 * Logger for background jobs/tasks
 */
export function createJobLogger(
  jobName: string,
  jobId?: string,
  service?: ServiceType,
): BeStaffLogger {
  const svc = service || getServiceName();
  const baseLogger = ServiceLoggers.getServiceLogger(svc);

  return baseLogger.withContext({
    job: jobName,
    jobId,
    component: 'background-job',
  });
}

/**
 * Logger for testing
 */
export function createTestLogger(
  testSuite?: string,
  testCase?: string,
): BeStaffLogger {
  const baseLogger = createLogger('mobile', 'test', {
    level: 'warn',
    enablePretty: false,
    enableHttp: false,
    enableMetrics: false,
  });

  return baseLogger.withContext({
    testSuite,
    testCase,
    component: 'test',
  });
}

/**
 * Initialize service loggers with platform-wide defaults
 */
export function initializeServiceLoggers(
  globalConfig?: Partial<LoggerConfig>,
): void {
  ServiceLoggers.initialize(globalConfig);
}

/**
 * Get all available service loggers
 */
export function getAllServiceLoggers(): Record<ServiceType, BeStaffLogger> {
  const services: ServiceType[] = ['mobile'];

  return services.reduce(
    (loggers, service) => {
      loggers[service] = ServiceLoggers.getServiceLogger(service);
      return loggers;
    },
    {} as Record<ServiceType, BeStaffLogger>,
  );
}
