# @bestaff/logger

<div align="center">

A comprehensive, production-ready logging package for BestAff Mobile applications, built on [Pino](https://github.com/pinojs/pino) with enhanced functionality for structured logging, performance monitoring, and request tracing.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Pino](https://img.shields.io/badge/Pino-9.x-00D084)](https://github.com/pinojs/pino)

</div>

---

## ✨ Features

- 🚀 **High Performance**: Built on Pino, one of the fastest Node.js loggers
- 🏗️ **Structured Logging**: Consistent JSON log format across all services
- 🔍 **Context Tracking**: Built-in correlation ID and request context
- 📊 **Performance Monitoring**: Automatic timing and metrics collection
- 🌐 **Multi-Platform**: Works in Node.js, React Native, and browser
- 🎯 **Type-Safe**: Full TypeScript support with comprehensive types
- 🔒 **Security-First**: Automatic sanitization of sensitive data
- 📱 **Mobile-Optimized**: Lightweight and efficient for React Native apps
- 🎨 **Development-Friendly**: Beautiful console output with pino-pretty
- ⚙️ **Environment-Aware**: Smart defaults for dev/staging/production

## 📦 Installation

This package is part of the BestAff Mobile monorepo:

```bash
pnpm add @bestaff/logger
```

## 🚀 Quick Start

### Mobile App Usage

```typescript
import { logger } from '@bestaff/logger';

// Simple logging in React Native
export function HomeScreen() {
  useEffect(() => {
    logger.info('HomeScreen mounted');
  }, []);

  const handleLogin = async () => {
    try {
      logger.info({ userId: user.id }, 'User login attempt');
      await loginUser();
      logger.info({ userId: user.id }, 'User logged in successfully');
    } catch (error) {
      logger.error({ error, userId: user.id }, 'Login failed');
    }
  };

  return <View>{/* Your UI */}</View>;
}
```

### Basic Logging

```typescript
import { logger } from '@bestaff/logger';

// Simple logging
logger.info('Application started');
logger.error('Something went wrong');

// Structured logging with context
logger.info(
  {
    userId: '123',
    action: 'profile_update',
    platform: 'iOS',
  },
  'User updated profile',
);
```

### Service-Specific Loggers

```typescript
import { quick } from '@bestaff/logger';

// Get pre-configured logger for mobile app
const mobileLogger = quick.mobile();
mobileLogger.info('Mobile app initialized');

// For backend services (if needed)
const apiLogger = quick.apiGateway();
apiLogger.info('API request processed');
```

## Core Concepts

### Service Types

The logger package supports different service types with optimized configurations:

- **`mobile`**: React Native mobile applications (primary use case)
- **`web`**: Frontend web applications (Next.js, React)
- **`dashboard`**: Admin dashboard applications (if needed)
- **`api-gateway`**: Backend API Gateway (if you have backend services)
- **`auth-svc`**: Authentication service
- **`notifications-svc`**: Notifications service

### Environments

Automatic environment detection with optimized settings:

- **`development`**: Pretty output, debug level, colorized
- **`test`**: Minimal output, warn level only
- **`staging`**: JSON output, info level
- **`production`**: JSON output, info level, sanitized

### Log Levels

Standard Pino log levels:

- `trace` (10): Very detailed debugging
- `debug` (20): Debugging information
- `info` (30): General information
- `warn` (40): Warning messages
- `error` (50): Error conditions
- `fatal` (60): Critical errors

## Advanced Usage

### Context-Aware Logging

```typescript
import { utils } from '@bestaff/logger';

// Create request-scoped logger
const requestLogger = utils.request('req_123', 'user_456');
requestLogger.info('Processing request');

// Create user-scoped logger
const userLogger = utils.user('user_456');
userLogger.info('User action performed');

// Create feature-scoped logger
const featureLogger = utils.feature('payment');
featureLogger.info('Payment processed');
```

### Performance Monitoring

```typescript
import { performance, logger } from '@bestaff/logger';

// Method decorator for automatic performance logging
class UserService {
  @performance.decorator(logger, 'info', 'UserService.getUser')
  async getUser(id: string) {
    // Method implementation
    return { id, name: 'John' };
  }
}

// Manual performance measurement
const result = await performance.measureAsync(logger, 'database-query', () =>
  db.query('SELECT * FROM users'),
);

// Performance timer
const timer = performance.timer(logger);
timer.start('operation');
// ... do work
timer.end('operation');
```

### Error Logging

```typescript
import { logger } from '@bestaff/logger';

try {
  await riskyOperation();
} catch (error) {
  // Automatic error serialization and sanitization
  logger.error(
    {
      operation: 'riskyOperation',
      userId: '123',
    },
    'Operation failed',
  );

  // Or use error context
  logger.withError(error).error('Operation failed');
}
```

### HTTP Request Logging

```typescript
import { createHttpMiddleware } from '@bestaff/logger';

const httpLogger = createHttpMiddleware('api-gateway', 'production', {
  level: 'info',
  includeReqId: true,
  customLogLevel: (req, res, err) => {
    if (err || res.statusCode >= 400) return 'error';
    if (res.statusCode >= 300) return 'warn';
    return 'info';
  },
});

// Use with different frameworks
app.use(httpLogger.express());
// or
app.register(httpLogger.fastify());
// or
export default httpLogger.nextjs();
```

## Framework Integration

### Express.js

```typescript
import { expressMiddleware } from '@bestaff/logger';
import express from 'express';

const app = express();

app.use(
  expressMiddleware('web', 'production', {
    level: 'info',
    includeReqId: true,
    reqIdHeader: 'x-request-id',
  }),
);

app.get('/api/data', (req, res) => {
  req.logger.info('Handling data request');
  res.json({ data: 'example' });
});
```

### Fastify

```typescript
import { fastifyPlugin } from '@bestaff/logger';
import Fastify from 'fastify';

const fastify = Fastify();

await fastify.register(fastifyPlugin('api-gateway', 'production'));

fastify.get('/api/data', async (request, reply) => {
  request.logger.info('Handling data request');
  return { data: 'example' };
});
```

### Next.js

```typescript
// middleware.ts
import { nextjsMiddleware } from '@bestaff/logger';

export default nextjsMiddleware('web', 'production');

export const config = {
  matcher: '/api/:path*',
};
```

```typescript
// pages/api/data.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  req.logger.info('Handling API request');
  res.status(200).json({ data: 'example' });
}
```

### NestJS

```typescript
import { pinoHttpMiddleware } from '@bestaff/logger';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add Pino HTTP middleware
  app.use(pinoHttpMiddleware('api-gateway', 'production'));

  await app.listen(3000);
}
```

## Configuration

### Global Configuration

```typescript
import { initialize } from '@bestaff/logger';

initialize({
  service: 'web',
  environment: 'production',
  level: 'info',
  enablePretty: false,
  enableHttp: true,
  enableMetrics: true,
  context: {
    version: '1.0.0',
    region: 'us-east-1',
  },
});
```

### Custom Logger Configuration

```typescript
import { createLogger } from '@bestaff/logger';

const customLogger = createLogger('web', 'production', {
  level: 'debug',
  transports: [
    {
      type: 'console',
      level: 'info',
      options: { colorize: false },
    },
    {
      type: 'file',
      level: 'error',
      options: { destination: 'logs/error.log' },
    },
  ],
  pinoOptions: {
    redact: ['password', 'token', 'secret'],
  },
});
```

### Environment Variables

The logger respects these environment variables:

```bash
# Service identification
SERVICE_NAME=web                    # Service type
APP_NAME=BeStaff-web                 # Alternative service name
APP_VERSION=1.0.0                  # Application version

# Environment
NODE_ENV=production                # Environment
ENVIRONMENT=production             # Alternative environment

# Logging configuration
LOG_LEVEL=info                     # Log level override
LOG_PRETTY=false                   # Enable/disable pretty printing
```

## Best Practices

### 1. Use Structured Logging

```typescript
// ❌ Don't
logger.info(`User ${userId} performed action ${action}`);

// ✅ Do
logger.info(
  {
    userId,
    action,
    timestamp: new Date().toISOString(),
  },
  'User performed action',
);
```

### 2. Use Context-Aware Loggers

```typescript
// ❌ Don't
logger.info({ requestId: 'req_123' }, 'Starting operation');
logger.info({ requestId: 'req_123' }, 'Operation completed');

// ✅ Do
const requestLogger = logger.withContext({ requestId: 'req_123' });
requestLogger.info('Starting operation');
requestLogger.info('Operation completed');
```

### 3. Log at Appropriate Levels

```typescript
// ❌ Don't log everything at info level
logger.info('Database connection established');
logger.info('Query executed: SELECT * FROM users');
logger.info('Processing user data');

// ✅ Do use appropriate levels
logger.info('Database connection established');
logger.debug('Query executed: SELECT * FROM users');
logger.trace('Processing user data');
```

### 4. Use Performance Monitoring

```typescript
// ❌ Don't manually measure everything
const start = Date.now();
await processData();
logger.info(`Processing took ${Date.now() - start}ms`);

// ✅ Do use built-in performance utilities
await performance.measureAsync(logger, 'data-processing', () => processData());
```

### 5. Handle Errors Properly

```typescript
// ❌ Don't lose error context
try {
  await operation();
} catch (error) {
  logger.error('Operation failed');
}

// ✅ Do preserve error information
try {
  await operation();
} catch (error) {
  logger.withError(error).error(
    {
      operation: 'userDataProcessing',
      userId: user.id,
    },
    'Operation failed',
  );
}
```

## API Reference

### Core Functions

- `createLogger(service, environment?, config?)` - Create a new logger instance
- `initialize(config?)` - Initialize global logger configuration
- `logger` - Default logger for current service

### Quick Access

- `quick.web()` - Web application logger
- `quick.mobile()` - Mobile application logger
- `quick.dashboard()` - Dashboard logger
- `quick.apiGateway()` - API Gateway logger
- `quick.auth()` - Auth service logger
- `quick.notifications()` - Notifications service logger

### Utilities

- `utils.request(requestId, userId?, service?)` - Request-scoped logger
- `utils.user(userId, service?)` - User-scoped logger
- `utils.feature(feature, service?)` - Feature-scoped logger
- `utils.domain(domain, service?)` - Domain-scoped logger

### Performance

- `performance.decorator` - Method decorator for performance logging
- `performance.timer(logger)` - Create performance timer
- `performance.metrics(logger)` - Create metrics collector
- `performance.measureAsync(logger, label, fn)` - Measure async function
- `performance.measureSync(logger, label, fn)` - Measure sync function

### Middleware

- `expressMiddleware(service, environment?, options?)` - Express middleware
- `fastifyPlugin(service, environment?, options?)` - Fastify plugin
- `nextjsMiddleware(service, environment?, options?)` - Next.js middleware
- `pinoHttpMiddleware(service, environment?, options?)` - Pino HTTP middleware

## TypeScript Support

The package is written in TypeScript and provides comprehensive type definitions:

```typescript
import type {
  BeStaffLogger,
  Environment,
  LogLevel,
  LoggerConfig,
  ServiceType,
} from '@bestaff/logger';

function setupLogger(config: LoggerConfig): BeStaffLogger {
  return createLogger(config.service, config.environment, config);
}
```

## Performance

- **Fast**: Built on Pino, one of the fastest Node.js loggers
- **Async**: Non-blocking I/O operations
- **Memory Efficient**: Minimal memory footprint
- **JSON**: Machine-readable structured output
- **Transports**: Support for multiple output destinations

## Security

- **Automatic Sanitization**: Sensitive data is automatically redacted
- **Configurable Redaction**: Custom redaction rules
- **Safe Serialization**: Circular references and errors handled safely
- **Header Sanitization**: HTTP headers sanitized in middleware

## Troubleshooting

### Common Issues

1. **Logger not working in browser**
   - The package automatically detects browser environment and uses console transport
   - Ensure you're importing from the correct path

2. **Performance impact**
   - Use appropriate log levels for production
   - Consider disabling debug/trace logs in production
   - Use async transports for file logging

3. **Missing request context**
   - Ensure HTTP middleware is properly configured
   - Check async context propagation in complex async flows

4. **Pretty printing not working**
   - Ensure `pino-pretty` is installed
   - Check environment configuration (pretty printing is disabled in production by default)

## Contributing

This package is part of the BeStaff Platform monorepo. Please follow the contribution guidelines in the main repository.

## License

Private package for BeStaff Platform.
