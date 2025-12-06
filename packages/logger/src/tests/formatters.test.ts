import {
  ContextFormatter,
  ErrorSerializer,
  MessageFormatter,
  PerformanceFormatter,
} from '../formatters';
import type { LogContext } from '../types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('formatters', () => {
  describe('ErrorSerializer', () => {
    describe('serialize', () => {
      it('should serialize standard Error objects', () => {
        const error = new Error('Test error');
        error.stack = 'Error: Test error\n    at test';

        const result = ErrorSerializer.serialize(error);

        expect(result.name).toBe('Error');
        expect(result.message).toBe('Test error');
        expect(result.stack).toBe('Error: Test error\n    at test');
      });

      it('should serialize custom error objects', () => {
        const customError = {
          name: 'CustomError',
          message: 'Custom message',
          code: 'E001',
          statusCode: 400,
        };

        const result = ErrorSerializer.serialize(customError);

        expect(result.name).toBe('CustomError');
        expect(result.message).toBe('Custom message');
        expect(result.code).toBe('E001');
        expect(result.statusCode).toBe(400);
      });

      it('should handle string errors', () => {
        const result = ErrorSerializer.serialize('String error');

        expect(result.name).toBe('StringError');
        expect(result.message).toBe('String error');
      });

      it('should handle null/undefined errors', () => {
        const nullResult = ErrorSerializer.serialize(null);
        expect(nullResult.name).toBe('Unknown');
        expect(nullResult.message).toBe('No error information available');

        const undefinedResult = ErrorSerializer.serialize(undefined);
        expect(undefinedResult.name).toBe('Unknown');
        expect(undefinedResult.message).toBe('No error information available');
      });

      it('should handle other types', () => {
        const result = ErrorSerializer.serialize(42);

        expect(result.name).toBe('UnknownError');
        expect(result.message).toBe('42');
      });

      it('should extract additional error properties', () => {
        class CustomError extends Error {
          code = 'E001';
          statusCode = 500;
          details = { field: 'value' };
        }

        const error = new CustomError('Custom error');
        const result = ErrorSerializer.serialize(error);

        expect(result.code).toBe('E001');
        expect(result.statusCode).toBe(500);
        expect(result.details).toEqual({ field: 'value' });
      });
    });

    describe('sanitize', () => {
      const originalEnv = process.env;

      beforeEach(() => {
        process.env = { ...originalEnv };
      });

      afterEach(() => {
        process.env = originalEnv;
      });

      it('should remove stack trace in production', () => {
        process.env.NODE_ENV = 'production';
        const error = new Error('Test error');
        error.stack = 'Error: Test error\n    at test';

        const result = ErrorSerializer.sanitize(error);

        expect(result.stack).toBeUndefined();
        expect(result.name).toBe('Error');
        expect(result.message).toBe('Test error');
      });

      it('should keep stack trace in development', () => {
        process.env.NODE_ENV = 'development';
        const error = new Error('Test error');
        error.stack = 'Error: Test error\n    at test';

        const result = ErrorSerializer.sanitize(error);

        expect(result.stack).toBe('Error: Test error\n    at test');
      });

      it('should redact sensitive fields', () => {
        const error = {
          name: 'AuthError',
          message: 'Auth failed',
          password: 'secret123',
          token: 'jwt-token',
          authorization: 'Bearer token',
          cookie: 'session=abc',
          normalField: 'value',
        };

        const result = ErrorSerializer.sanitize(error);

        expect(result.password).toBe('[REDACTED]');
        expect(result.token).toBe('[REDACTED]');
        expect(result.authorization).toBe('[REDACTED]');
        expect(result.cookie).toBe('[REDACTED]');
        expect(result.normalField).toBe('value');
      });
    });
  });

  describe('PerformanceFormatter', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('timer operations', () => {
      it('should start and end timers correctly', () => {
        PerformanceFormatter.startTimer('test-timer');

        vi.advanceTimersByTime(1000);

        const metrics = PerformanceFormatter.endTimer('test-timer');

        expect(metrics.duration).toBe(1000);
      });

      it('should return 0 duration for non-existent timer', () => {
        const metrics = PerformanceFormatter.endTimer('non-existent');

        expect(metrics.duration).toBe(0);
      });

      it('should clean up timer after ending', () => {
        PerformanceFormatter.startTimer('test-timer');
        PerformanceFormatter.endTimer('test-timer');

        const secondMetrics = PerformanceFormatter.endTimer('test-timer');
        expect(secondMetrics.duration).toBe(0);
      });
    });

    describe('formatDuration', () => {
      it('should format milliseconds', () => {
        expect(PerformanceFormatter.formatDuration(500)).toBe('500ms');
        expect(PerformanceFormatter.formatDuration(999)).toBe('999ms');
      });

      it('should format seconds', () => {
        expect(PerformanceFormatter.formatDuration(1000)).toBe('1.00s');
        expect(PerformanceFormatter.formatDuration(1500)).toBe('1.50s');
        expect(PerformanceFormatter.formatDuration(2350)).toBe('2.35s');
      });
    });

    describe('formatMemory', () => {
      it('should format bytes', () => {
        expect(PerformanceFormatter.formatMemory(512)).toBe('512.00B');
        expect(PerformanceFormatter.formatMemory(1023)).toBe('1023.00B');
      });

      it('should format kilobytes', () => {
        expect(PerformanceFormatter.formatMemory(1024)).toBe('1.00KB');
        expect(PerformanceFormatter.formatMemory(1536)).toBe('1.50KB');
      });

      it('should format megabytes', () => {
        expect(PerformanceFormatter.formatMemory(1024 * 1024)).toBe('1.00MB');
        expect(PerformanceFormatter.formatMemory(1024 * 1024 * 2.5)).toBe(
          '2.50MB',
        );
      });

      it('should format gigabytes', () => {
        expect(PerformanceFormatter.formatMemory(1024 * 1024 * 1024)).toBe(
          '1.00GB',
        );
      });
    });

    describe('getSystemMetrics', () => {
      it('should return metrics object', () => {
        const metrics = PerformanceFormatter.getSystemMetrics();

        expect(typeof metrics).toBe('object');
        // Memory metrics are available in Node.js
        expect(metrics.memory).toBeDefined();
        expect(typeof metrics.memory?.used).toBe('number');
        expect(typeof metrics.memory?.total).toBe('number');
      });
    });
  });

  describe('ContextFormatter', () => {
    describe('mergeContexts', () => {
      it('should merge multiple contexts', () => {
        const context1 = { requestId: 'req1', userId: 'user1' };
        const context2 = { sessionId: 'session1', traceId: 'trace1' };
        const context3 = { userId: 'user2', spanId: 'span1' }; // Override userId

        const result = ContextFormatter.mergeContexts(
          context1,
          context2,
          context3,
        );

        expect(result).toEqual({
          requestId: 'req1',
          userId: 'user2', // Should be overridden
          sessionId: 'session1',
          traceId: 'trace1',
          spanId: 'span1',
        });
      });

      it('should handle undefined contexts', () => {
        const context1 = { requestId: 'req1' };

        const result = ContextFormatter.mergeContexts(
          context1,
          undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          null as any,
        );

        expect(result).toEqual({ requestId: 'req1' });
      });

      it('should return empty object for all undefined', () => {
        const result = ContextFormatter.mergeContexts(undefined, undefined);

        expect(result).toEqual({});
      });
    });

    describe('extractRequestContext', () => {
      it('should extract request ID from headers', () => {
        const req = {
          headers: {
            'x-request-id': 'req-123',
            'x-trace-id': 'trace-456',
          },
        };

        const context = ContextFormatter.extractRequestContext(req);

        expect(context.requestId).toBe('req-123');
        expect(context.traceId).toBe('trace-456');
      });

      it('should try multiple request ID headers', () => {
        const req = {
          headers: {
            'correlation-id': 'corr-123',
          },
        };

        const context = ContextFormatter.extractRequestContext(req);

        expect(context.requestId).toBe('corr-123');
      });

      it('should extract user information', () => {
        const req = {
          headers: {},
          user: { id: 'user-123' },
        };

        const context = ContextFormatter.extractRequestContext(req);

        expect(context.userId).toBe('user-123');
      });

      it('should extract session information', () => {
        const req = {
          headers: {},
          session: { id: 'session-123' },
        };

        const context = ContextFormatter.extractRequestContext(req);

        expect(context.sessionId).toBe('session-123');
      });

      it('should handle missing headers gracefully', () => {
        const req = {};

        const context = ContextFormatter.extractRequestContext(req);

        expect(context).toEqual({});
      });
    });

    describe('sanitizeContext', () => {
      it('should redact sensitive fields', () => {
        const context: LogContext = {
          requestId: 'req-123',
          password: 'secret123',
          token: 'jwt-token',
          apiKey: 'api-key-123',
          normalField: 'normal-value',
        };

        const sanitized = ContextFormatter.sanitizeContext(context);

        expect(sanitized.requestId).toBe('req-123');
        expect(sanitized.password).toBe('[REDACTED]');
        expect(sanitized.token).toBe('[REDACTED]');
        expect(sanitized.apiKey).toBe('[REDACTED]');
        expect(sanitized.normalField).toBe('normal-value');
      });

      it('should not modify original context', () => {
        const context: LogContext = {
          requestId: 'req-123',
          password: 'secret123',
        };

        const sanitized = ContextFormatter.sanitizeContext(context);

        expect(context.password).toBe('secret123'); // Original unchanged
        expect(sanitized.password).toBe('[REDACTED]');
      });
    });

    describe('toLogFields', () => {
      it('should convert context to log fields', () => {
        const context: LogContext = {
          requestId: 'req-123',
          userId: 'user-456',
          metadata: { key: 'value' },
        };

        const fields = ContextFormatter.toLogFields(context);

        expect(fields.requestId).toBe('req-123');
        expect(fields.userId).toBe('user-456');
        expect(fields.metadata).toBe('{"key":"value"}');
      });

      it('should handle circular references', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const circular: any = { id: 'test' };
        circular.self = circular;

        const context: LogContext = {
          requestId: 'req-123',
          circular,
        };

        const fields = ContextFormatter.toLogFields(context);

        expect(fields.requestId).toBe('req-123');
        expect(fields.circular).toBe('[Object]');
      });
    });
  });

  describe('MessageFormatter', () => {
    describe('format', () => {
      it('should format messages with context', () => {
        const message = 'User {userId} performed {action}';
        const context = { userId: '123', action: 'login' };

        const result = MessageFormatter.format(message, context);

        expect(result).toBe('User 123 performed login');
      });

      it('should handle missing context values', () => {
        const message = 'User {userId} performed {action}';
        const context = { userId: '123' };

        const result = MessageFormatter.format(message, context);

        expect(result).toBe('User 123 performed {action}');
      });

      it('should return original message when no context', () => {
        const message = 'Simple message';

        const result = MessageFormatter.format(message);

        expect(result).toBe('Simple message');
      });

      it('should handle empty context', () => {
        const message = 'User {userId} performed {action}';
        const context = {};

        const result = MessageFormatter.format(message, context);

        expect(result).toBe('User {userId} performed {action}');
      });
    });

    describe('createStructured', () => {
      it('should create structured log entry', () => {
        const message = 'Test message';
        const context = { requestId: 'req-123' };
        const error = { name: 'Error', message: 'Test error' };
        const metrics = { duration: 100 };

        const result = MessageFormatter.createStructured(
          message,
          context,
          error,
          metrics,
        );

        expect(result.msg).toBe('Test message');
        expect(result.requestId).toBe('req-123');
        expect(result.error).toEqual({ name: 'Error', message: 'Test error' });
        expect(result.metrics).toEqual({ duration: 100 });
      });

      it('should handle minimal parameters', () => {
        const result = MessageFormatter.createStructured('Simple message');

        expect(result).toEqual({ msg: 'Simple message' });
      });
    });

    describe('truncate', () => {
      it('should not truncate short messages', () => {
        const message = 'Short message';

        const result = MessageFormatter.truncate(message);

        expect(result).toBe(message);
      });

      it('should truncate long messages', () => {
        const message = 'a'.repeat(1200);

        const result = MessageFormatter.truncate(message);

        expect(result.length).toBe(1000); // 997 + '...'
        expect(result.endsWith('...')).toBe(true);
      });

      it('should use custom max length', () => {
        const message = 'a'.repeat(100);

        const result = MessageFormatter.truncate(message, 50);

        expect(result.length).toBe(50);
        expect(result.endsWith('...')).toBe(true);
      });
    });

    describe('maskSensitive', () => {
      it('should mask email addresses', () => {
        const message = 'User email is john.doe@example.com and admin@test.org';

        const result = MessageFormatter.maskSensitive(message);

        expect(result).toBe(
          'User email is jo***@example.com and ad***@test.org',
        );
      });

      it('should mask phone numbers', () => {
        const message = 'Phone: 123-456-7890 or 555.123.4567';

        const result = MessageFormatter.maskSensitive(message);

        expect(result).toBe('Phone: *** or ***');
      });

      it('should mask credit card numbers', () => {
        const message = 'Card: 1234 5678 9012 3456 or 1234-5678-9012-3456';

        const result = MessageFormatter.maskSensitive(message);

        expect(result).toBe('Card: *** or ***');
      });

      it('should mask potential API keys', () => {
        const message = 'API key: abcdefghijklmnopqrstuvwxyz1234567890';

        const result = MessageFormatter.maskSensitive(message);

        expect(result).toBe('API key: ***');
      });

      it('should not mask short strings', () => {
        const message = 'Short string with no sensitive data';

        const result = MessageFormatter.maskSensitive(message);

        expect(result).toBe(message);
      });
    });
  });
});
