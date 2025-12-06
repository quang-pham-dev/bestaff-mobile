import { createLogger } from './factory';
import { ContextFormatter, PerformanceFormatter } from './formatters';
import type {
  BeStaffLogger,
  Environment,
  HttpLoggerOptions,
  LogContext,
  ServiceType,
} from './types';
import { AsyncLocalStorage } from 'async_hooks';
import type { IncomingMessage, ServerResponse } from 'http';
import pinoHttp from 'pino-http';

// Define minimal Express-like types locally
export interface Request {
  method: string;
  url?: string;
  originalUrl?: string;
  headers?: Record<string, string | string[]>;
  ip?: string;
  connection?: { remoteAddress?: string };
  user?: { id: string };
  session?: { id: string };
  query?: any;
  params?: any;
  logger?: BeStaffLogger;
}

export interface Response {
  statusCode: number;
  statusMessage?: string;
  setHeader(name: string, value: string): void;
  getHeaders?(): Record<string, any>;
  on(event: string, listener: Function): void;
}

export interface NextFunction {
  (error?: any): void;
}

// Async local storage for request context
const asyncLocalStorage = new AsyncLocalStorage<LogContext>();

/**
 * HTTP logging middleware for Express.js and other frameworks
 */
export class HttpLoggerMiddleware {
  private logger: BeStaffLogger;
  private options: HttpLoggerOptions;

  constructor(
    service: ServiceType,
    environment?: Environment,
    options: HttpLoggerOptions = {},
  ) {
    this.logger = createLogger(service, environment);
    this.options = {
      enabled: true,
      level: 'info',
      includeReqId: true,
      reqIdHeader: 'x-request-id',
      genReqId: () => this.generateRequestId(),
      ...options,
    };
  }

  /**
   * Express.js middleware
   */
  express() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!this.options.enabled) {
        return next();
      }

      const startTime = Date.now();
      const requestId = this.getOrGenerateRequestId(req);

      // Add request ID to headers
      if (this.options.includeReqId && requestId) {
        if (!req.headers) {
          req.headers = {};
        }
        req.headers[this.options.reqIdHeader!] = requestId;
        res.setHeader(this.options.reqIdHeader!, requestId);
      }

      // Extract request context
      const context = this.extractRequestContext(req, requestId);

      // Store context in async local storage
      asyncLocalStorage.run(context, () => {
        // Create request logger
        const requestLogger = this.logger.withContext(context);

        // Add logger to request object
        (req as any).logger = requestLogger;

        // Log incoming request
        this.logRequest(requestLogger, req);

        // Listen for response finish event
        res.on('finish', () => {
          const duration = Date.now() - startTime;
          this.logResponse(requestLogger, req, res, duration);
        });

        // Handle errors
        res.on('error', (error: Error) => {
          const duration = Date.now() - startTime;
          this.logError(requestLogger, req, res, error, duration);
        });

        next();
      });
    };
  }

  /**
   * Pino HTTP middleware (for direct use with pino-http)
   */
  pinoHttp() {
    return pinoHttp({
      logger: this.logger as any,
      genReqId: this.options.genReqId,
      customLogLevel: this.options.customLogLevel as any,
      customSuccessMessage: this.options.customSuccessMessage as any,
      customErrorMessage: this.options.customErrorMessage as any,
      serializers: {
        req: this.requestSerializer.bind(this),
        res: this.responseSerializer.bind(this),
        ...this.options.serializers,
      },
    });
  }

  /**
   * Fastify plugin
   */
  fastify() {
    return async (fastify: any) => {
      fastify.addHook('onRequest', async (request: any, reply: any) => {
        if (!this.options.enabled) return;

        const startTime = Date.now();
        const requestId = this.getOrGenerateRequestId(request);

        if (this.options.includeReqId && requestId) {
          request.headers[this.options.reqIdHeader!] = requestId;
          reply.header(this.options.reqIdHeader!, requestId);
        }

        const context = this.extractRequestContext(request, requestId);
        request.context = context;
        request.logger = this.logger.withContext(context);
        request.startTime = startTime;

        this.logRequest(request.logger, request);
      });

      fastify.addHook('onResponse', async (request: any, reply: any) => {
        if (!this.options.enabled || !request.logger) return;

        const duration = Date.now() - (request.startTime || 0);
        this.logResponse(request.logger, request, reply, duration);
      });

      fastify.addHook(
        'onError',
        async (request: any, reply: any, error: Error) => {
          if (!this.options.enabled || !request.logger) return;

          const duration = Date.now() - (request.startTime || 0);
          this.logError(request.logger, request, reply, error, duration);
        },
      );
    };
  }

  /**
   * Next.js middleware
   */
  nextjs() {
    return (req: IncomingMessage, res: ServerResponse, next?: () => void) => {
      if (!this.options.enabled) {
        return next?.();
      }

      const startTime = Date.now();
      const requestId = this.getOrGenerateRequestId(req);

      if (this.options.includeReqId && requestId) {
        (req.headers as any)[this.options.reqIdHeader!] = requestId;
        res.setHeader(this.options.reqIdHeader!, requestId);
      }

      const context = this.extractRequestContext(req, requestId);
      (req as any).logger = this.logger.withContext(context);

      this.logRequest((req as any).logger, req);

      res.on('finish', () => {
        const duration = Date.now() - startTime;
        this.logResponse((req as any).logger, req, res, duration);
      });

      next?.();
    };
  }

  /**
   * Generic HTTP middleware
   */
  generic() {
    return (req: any, res: any, next: any) => {
      return this.express()(req, res, next);
    };
  }

  /**
   * Extract request context
   */
  private extractRequestContext(req: any, requestId?: string): LogContext {
    const context = ContextFormatter.extractRequestContext(req);

    if (requestId) {
      context.requestId = requestId;
    }

    // Add additional request information
    context.method = req.method;
    context.url = req.url || req.originalUrl;
    context.userAgent = req.headers?.['user-agent'];
    context.ip = req.ip || req.connection?.remoteAddress;

    return context as LogContext;
  }

  /**
   * Log incoming request
   */
  private logRequest(logger: BeStaffLogger, req: any): void {
    const level = this.options.level || 'info';
    const message =
      this.options.customSuccessMessage?.(req, null) ||
      `${req.method} ${req.url || req.originalUrl}`;

    logger[level](
      {
        request: {
          method: req.method,
          url: req.url || req.originalUrl,
          headers: this.sanitizeHeaders(req.headers),
          query: req.query,
          params: req.params,
        },
      },
      message,
    );
  }

  /**
   * Log outgoing response
   */
  private logResponse(
    logger: BeStaffLogger,
    req: any,
    res: any,
    duration: number,
  ): void {
    const statusCode = res.statusCode || res.status;
    const isError = statusCode >= 400;
    const level = isError ? 'error' : this.options.level || 'info';

    const message = isError
      ? this.options.customErrorMessage?.(
          req,
          res,
          new Error(`HTTP ${statusCode}`),
        ) || `${req.method} ${req.url || req.originalUrl} ${statusCode}`
      : this.options.customSuccessMessage?.(req, res) ||
        `${req.method} ${req.url || req.originalUrl} ${statusCode}`;

    logger[level](
      {
        response: {
          statusCode,
          statusMessage: res.statusMessage,
          headers: this.sanitizeHeaders(res.getHeaders?.() || {}),
          duration: PerformanceFormatter.formatDuration(duration),
        },
        metrics: {
          duration,
          ...PerformanceFormatter.getSystemMetrics(),
        },
      },
      message,
    );
  }

  /**
   * Log request error
   */
  private logError(
    logger: BeStaffLogger,
    req: any,
    res: any,
    error: Error,
    duration: number,
  ): void {
    const statusCode = res.statusCode || 500;
    const message =
      this.options.customErrorMessage?.(req, res, error) ||
      `${req.method} ${req.url || req.originalUrl} ${statusCode} - ${error.message}`;

    logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        request: {
          method: req.method,
          url: req.url || req.originalUrl,
        },
        response: {
          statusCode,
          duration: PerformanceFormatter.formatDuration(duration),
        },
        metrics: {
          duration,
          ...PerformanceFormatter.getSystemMetrics(),
        },
      },
      message,
    );
  }

  /**
   * Get or generate request ID
   */
  private getOrGenerateRequestId(req: any): string {
    const existingId =
      req.headers?.[this.options.reqIdHeader!] ||
      req.headers?.['x-correlation-id'] ||
      req.headers?.['request-id'];

    return existingId || this.options.genReqId!();
  }

  /**
   * Generate a unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sanitize headers for logging
   */
  private sanitizeHeaders(headers: any): any {
    if (!headers) return {};

    const sanitized = { ...headers };
    const sensitiveHeaders = [
      'authorization',
      'cookie',
      'set-cookie',
      'x-api-key',
      'x-auth-token',
    ];

    sensitiveHeaders.forEach((header) => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Request serializer for pino-http
   */
  private requestSerializer(req: any): any {
    return {
      id: req.id,
      method: req.method,
      url: req.url,
      headers: this.sanitizeHeaders(req.headers),
      query: req.query,
      params: req.params,
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort,
    };
  }

  /**
   * Response serializer for pino-http
   */
  private responseSerializer(res: any): any {
    return {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: this.sanitizeHeaders(res.getHeaders?.() || {}),
    };
  }

  /**
   * Update logger options
   */
  updateOptions(options: Partial<HttpLoggerOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Get current context from async local storage
   */
  static getCurrentContext(): LogContext | undefined {
    return asyncLocalStorage.getStore();
  }

  /**
   * Run code with specific context
   */
  static runWithContext<T>(context: LogContext, fn: () => T): T {
    return asyncLocalStorage.run(context, fn);
  }
}

/**
 * Create HTTP middleware for different frameworks
 */
export function createHttpMiddleware(
  service: ServiceType,
  environment?: Environment,
  options?: HttpLoggerOptions,
) {
  return new HttpLoggerMiddleware(service, environment, options);
}

/**
 * Express.js middleware factory
 */
export function expressMiddleware(
  service: ServiceType,
  environment?: Environment,
  options?: HttpLoggerOptions,
) {
  return createHttpMiddleware(service, environment, options).express();
}

/**
 * Fastify plugin factory
 */
export function fastifyPlugin(
  service: ServiceType,
  environment?: Environment,
  options?: HttpLoggerOptions,
) {
  return createHttpMiddleware(service, environment, options).fastify();
}

/**
 * Next.js middleware factory
 */
export function nextjsMiddleware(
  service: ServiceType,
  environment?: Environment,
  options?: HttpLoggerOptions,
) {
  return createHttpMiddleware(service, environment, options).nextjs();
}

/**
 * Pino HTTP middleware factory
 */
export function pinoHttpMiddleware(
  service: ServiceType,
  environment?: Environment,
  options?: HttpLoggerOptions,
) {
  return createHttpMiddleware(service, environment, options).pinoHttp();
}
