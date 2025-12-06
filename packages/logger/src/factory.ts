import { createBaseConfig, isBrowser, isNode } from './config';
import { createBeStaffLogger } from './logger';
import type {
  BeStaffLogger,
  Environment,
  LoggerConfig,
  LoggerFactoryOptions,
  ServiceType,
  TransportConfig,
} from './types';
import pino from 'pino';
import type {
  Logger as PinoLogger,
  LoggerOptions as PinoLoggerOptions,
} from 'pino';

/**
 * Logger factory for creating configured loggers
 */
export class LoggerFactory {
  private static instance: LoggerFactory;
  private globalContext: Record<string, unknown> = {};
  private defaultConfig: Partial<LoggerConfig>;
  private loggers = new Map<string, BeStaffLogger>();

  constructor(options: LoggerFactoryOptions = {}) {
    this.defaultConfig = options.defaultConfig || {};
    if (options.globalContext) {
      this.globalContext = { ...options.globalContext };
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance(options?: LoggerFactoryOptions): LoggerFactory {
    if (!LoggerFactory.instance) {
      LoggerFactory.instance = new LoggerFactory(options);
    }
    return LoggerFactory.instance;
  }

  /**
   * Create a logger for a specific service
   */
  createLogger(
    service: ServiceType,
    environment?: Environment,
    config?: Partial<LoggerConfig>,
  ): BeStaffLogger {
    const cacheKey = `${service}-${environment || 'default'}`;

    if (this.loggers.has(cacheKey)) {
      return this.loggers.get(cacheKey)!;
    }

    const finalConfig = createBaseConfig(service, environment, {
      ...this.defaultConfig,
      ...config,
    });

    const pinoLogger = this.createPinoLogger(finalConfig);
    const BeStaffLogger = createBeStaffLogger(pinoLogger, finalConfig);

    this.loggers.set(cacheKey, BeStaffLogger);
    return BeStaffLogger;
  }

  /**
   * Create a pino logger with the given configuration
   */
  private createPinoLogger(config: LoggerConfig): PinoLogger {
    const options: PinoLoggerOptions = {
      ...config.pinoOptions,
      level: config.level || 'info',
      name: `orbit-${config.service}`,
      base: {
        ...this.globalContext,
        ...config.context,
        ...config.pinoOptions?.base,
      },
    };

    // Handle browser vs Node.js environments
    if (isBrowser()) {
      return this.createBrowserLogger(options);
    }

    // Handle transports for Node.js
    if (config.transports && config.transports.length > 0) {
      const transports = this.createTransports(config.transports, config);
      if (transports.length > 0) {
        options.transport =
          transports.length === 1 ? transports[0] : { targets: transports };
      }
    }

    return pino(options);
  }

  /**
   * Create browser-compatible logger
   */
  private createBrowserLogger(options: PinoLoggerOptions): PinoLogger {
    // For browser environments, use console transport
    const browserOptions: PinoLoggerOptions = {
      ...options,
      browser: {
        asObject: true,
        serialize: true,
        transmit: {
          level: options.level as any,

          send: (level: any, logEvent: any) => {
            const method = this.getConsoleMethod(level);
            console[method](logEvent);
          },
        },
      },
    };

    return pino(browserOptions);
  }

  /**
   * Get appropriate console method for log level
   */
  private getConsoleMethod(
    level: number,
  ): 'trace' | 'debug' | 'info' | 'warn' | 'error' {
    switch (level) {
      case 10:
        return 'trace';
      case 20:
        return 'debug';
      case 30:
        return 'info';
      case 40:
        return 'warn';
      case 50:
      case 60:
      default:
        return 'error';
    }
  }

  /**
   * Create transports from configuration
   */

  private createTransports(
    transports: TransportConfig[],
    config: LoggerConfig,
  ): any[] {
    return transports
      .map((transport) => this.createTransport(transport, config))
      .filter(Boolean);
  }

  /**
   * Create individual transport
   */

  private createTransport(
    transport: TransportConfig,
    config: LoggerConfig,
  ): any {
    switch (transport.type) {
      case 'console':
        return this.createConsoleTransport(transport, config);
      case 'file':
        return this.createFileTransport(transport, config);
      case 'custom':
        return this.createCustomTransport(transport, config);
      default:
        return null;
    }
  }

  /**
   * Create console transport
   */

  private createConsoleTransport(
    transport: TransportConfig,
    config: LoggerConfig,
  ): any {
    if (config.enablePretty && config.environment === 'development') {
      return {
        target: 'pino-pretty',
        level: transport.level || config.level,
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          singleLine: false,
          hideObject: false,
          ...transport.options,
        },
      };
    }

    return {
      target: 'pino/file',
      level: transport.level || config.level,
      options: {
        destination: 1, // stdout
        ...transport.options,
      },
    };
  }

  /**
   * Create file transport
   */

  private createFileTransport(
    transport: TransportConfig,
    config: LoggerConfig,
  ): any {
    if (!isNode()) {
      console.warn('File transport is not supported in browser environments');
      return null;
    }

    const defaultPath = `logs/${config.service}-${config.environment}.log`;

    return {
      target: 'pino/file',
      level: transport.level || config.level,
      options: {
        destination: transport.options?.destination || defaultPath,
        mkdir: true,
        ...transport.options,
      },
    };
  }

  /**
   * Create custom transport
   */

  private createCustomTransport(
    transport: TransportConfig,
    config: LoggerConfig,
  ): any {
    if (!transport.options?.target) {
      console.warn('Custom transport requires target option');
      return null;
    }

    return {
      target: transport.options.target,
      level: transport.level || config.level,
      options: transport.options,
    };
  }

  /**
   * Update global context for all new loggers
   */
  setGlobalContext(context: Record<string, unknown>): void {
    this.globalContext = { ...this.globalContext, ...context };
  }

  /**
   * Get global context
   */
  getGlobalContext(): Record<string, unknown> {
    return { ...this.globalContext };
  }

  /**
   * Clear logger cache
   */
  clearCache(): void {
    this.loggers.clear();
  }

  /**
   * Get cached logger
   */
  getCachedLogger(
    service: ServiceType,
    environment?: Environment,
  ): BeStaffLogger | undefined {
    const cacheKey = `${service}-${environment || 'default'}`;
    return this.loggers.get(cacheKey);
  }

  /**
   * Create a child logger with additional context
   */
  createChildLogger(
    parent: BeStaffLogger,
    context: Record<string, unknown>,
  ): BeStaffLogger {
    return parent.child(context);
  }
}

/**
 * Create a configured logger instance
 */
export function createLogger(
  service: ServiceType,
  environment?: Environment,
  config?: Partial<LoggerConfig>,
): BeStaffLogger {
  const factory = LoggerFactory.getInstance();
  return factory.createLogger(service, environment, config);
}

/**
 * Get the global logger factory instance
 */
export function getLoggerFactory(): LoggerFactory {
  return LoggerFactory.getInstance();
}

/**
 * Configure the global logger factory
 */
export function configureLogger(options: LoggerFactoryOptions): void {
  (LoggerFactory as any).instance = new LoggerFactory(options);
}
