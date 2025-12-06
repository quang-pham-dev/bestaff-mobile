import type {
  Environment,
  LogLevel,
  LoggerConfig,
  ServiceType,
  TransportConfig,
} from './types';
import type { LoggerOptions as PinoLoggerOptions } from 'pino';

// Default log levels by environment
const DEFAULT_LOG_LEVELS: Record<Environment, LogLevel> = {
  development: 'debug',
  test: 'warn',
  staging: 'info',
  production: 'info',
};

// Default transport configurations by environment
const DEFAULT_TRANSPORTS: Record<Environment, TransportConfig[]> = {
  development: [
    {
      type: 'console',
      level: 'debug',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  ],
  test: [
    {
      type: 'console',
      level: 'warn',
      options: {
        colorize: false,
        sync: true,
      },
    },
  ],
  staging: [
    {
      type: 'console',
      level: 'info',
      options: {
        colorize: false,
        translateTime: 'SYS:iso',
      },
    },
  ],
  production: [
    {
      type: 'console',
      level: 'info',
      options: {
        colorize: false,
        translateTime: 'SYS:iso',
      },
    },
  ],
};

// Base pino options by environment
const BASE_PINO_OPTIONS: Record<Environment, Partial<PinoLoggerOptions>> = {
  development: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
        singleLine: false,
        hideObject: false,
      },
    },
    formatters: {
      level: (label: string) => ({ level: label }),
    },
  },
  test: {
    level: 'warn',
    enabled: false,
  },
  staging: {
    level: 'info',
    formatters: {
      level: (label: string) => ({ level: label }),
    },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  },
  production: {
    level: 'info',
    formatters: {
      level: (label: string) => ({ level: label }),
    },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    redact: {
      paths: [
        'password',
        'token',
        'authorization',
        'cookie',
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',
      ],
      censor: '[REDACTED]',
    },
  },
};

// Service-specific configurations
const SERVICE_CONFIGS: Record<ServiceType, Partial<LoggerConfig>> = {
  mobile: {
    enablePretty: true,
    enableHttp: false,
    enableMetrics: false,
  },
};

/**
 * Get environment from various sources
 */
export function getEnvironment(): Environment {
  const env = process.env.NODE_ENV || process.env.ENVIRONMENT || 'development';

  switch (env.toLowerCase()) {
    case 'prod':
    case 'production':
      return 'production';
    case 'stage':
    case 'staging':
      return 'staging';
    case 'test':
    case 'testing':
      return 'test';
    case 'dev':
    case 'development':
    default:
      return 'development';
  }
}

/**
 * Get service name from package.json or environment
 */
export function getServiceName(): ServiceType {
  const service = process.env.SERVICE_NAME || process.env.APP_NAME || 'mobile';

  // Map common service names to our types
  const serviceMap: Record<string, ServiceType> = {
    mobile: 'mobile',
  };

  return serviceMap[service.toLowerCase()] || 'mobile';
}

/**
 * Get application version
 */
export function getVersion(): string {
  return process.env.APP_VERSION || process.env.npm_package_version || '1.0.0';
}

/**
 * Create base logger configuration
 */
export function createBaseConfig(
  service?: ServiceType,
  environment?: Environment,
  overrides?: Partial<LoggerConfig>,
): LoggerConfig {
  const env = environment || getEnvironment();
  const svc = service || getServiceName();
  const version = getVersion();

  const baseConfig: LoggerConfig = {
    service: svc,
    environment: env,
    level: DEFAULT_LOG_LEVELS[env],
    version,
    transports: DEFAULT_TRANSPORTS[env],
    enablePretty: env === 'development',
    enableHttp: true,
    enableMetrics: env !== 'test',
    context: {
      service: svc,
      environment: env,
      version,
    },
    pinoOptions: {
      ...BASE_PINO_OPTIONS[env],
      name: `orbit-${svc}`,
      base: {
        service: svc,
        environment: env,
        version,
      },
    },
  };

  // Apply service-specific configurations
  const serviceConfig = SERVICE_CONFIGS[svc] || {};

  // Merge configurations
  const mergedConfig = {
    ...baseConfig,
    ...serviceConfig,
    ...overrides,
  };

  // Ensure test environment settings are preserved
  if (env === 'test') {
    mergedConfig.enableMetrics = false;
  }

  return {
    ...mergedConfig,
    context: {
      ...baseConfig.context,
      ...serviceConfig.context,
      ...overrides?.context,
    },
    pinoOptions: {
      ...baseConfig.pinoOptions,
      ...serviceConfig.pinoOptions,
      ...overrides?.pinoOptions,
    },
  };
}

/**
 * Get log level from environment variable
 */
export function getLogLevel(environment: Environment): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;

  if (
    envLevel &&
    ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].includes(envLevel)
  ) {
    return envLevel;
  }

  return DEFAULT_LOG_LEVELS[environment];
}

/**
 * Check if pretty logging should be enabled
 */
export function shouldEnablePretty(environment: Environment): boolean {
  if (process.env.LOG_PRETTY !== undefined) {
    return process.env.LOG_PRETTY === 'true';
  }

  return environment === 'development';
}

/**
 * Check if we're running in a browser environment
 */
export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.document !== 'undefined'
  );
}

/**
 * Check if we're running in a Node.js environment
 */
export function isNode(): boolean {
  return typeof process !== 'undefined' && !!process.versions?.node;
}
