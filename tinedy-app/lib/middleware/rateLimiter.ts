/**
 * Simple In-Memory Rate Limiter
 *
 * Implements rate limiting without external dependencies (Redis, Upstash)
 * Suitable for internal APIs with low-to-medium traffic
 *
 * Features:
 * - Sliding window algorithm
 * - Per-user rate limiting
 * - Role-based limits (admin: 20/min, operator: 10/min)
 * - Automatic cleanup of expired entries
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  admin: number;      // Requests per minute for admin
  operator: number;   // Requests per minute for operator
  windowMs: number;   // Time window in milliseconds
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// In-memory storage
const userLimits = new Map<string, RateLimitEntry>();

// Default configuration
const config: RateLimitConfig = {
  admin: 20,
  operator: 10,
  windowMs: 60 * 1000, // 1 minute
};

/**
 * Check if request is within rate limit
 *
 * @param userId - User ID from session
 * @param userRole - User role (admin or operator)
 * @returns Rate limit result with allowed status and headers
 */
export function checkRateLimit(
  userId: string,
  userRole: 'admin' | 'operator'
): RateLimitResult {
  const now = Date.now();
  const maxRequests = config[userRole];
  const windowMs = config.windowMs;

  // Get or create user limit entry
  const userLimit = userLimits.get(userId) || null;

  // Cleanup expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to cleanup
    cleanupExpiredEntries(now);
  }

  // First request or window expired
  if (!userLimit || now > userLimit.resetAt) {
    userLimits.set(userId, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: now + windowMs,
    };
  }

  // Within window - check if exceeded
  if (userLimit.count >= maxRequests) {
    const retryAfter = Math.ceil((userLimit.resetAt - now) / 1000);

    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      reset: userLimit.resetAt,
      retryAfter,
    };
  }

  // Within window - increment count
  userLimit.count++;
  userLimits.set(userId, userLimit);

  return {
    allowed: true,
    limit: maxRequests,
    remaining: maxRequests - userLimit.count,
    reset: userLimit.resetAt,
  };
}

/**
 * Cleanup expired rate limit entries
 * Prevents memory leaks from inactive users
 */
function cleanupExpiredEntries(now: number): void {
  for (const [userId, limit] of userLimits.entries()) {
    if (now > limit.resetAt) {
      userLimits.delete(userId);
    }
  }
}

/**
 * Reset rate limit for a user (testing/admin purposes)
 */
export function resetRateLimit(userId: string): void {
  userLimits.delete(userId);
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(
  userId: string,
  userRole: 'admin' | 'operator'
): RateLimitResult {
  const now = Date.now();
  const maxRequests = config[userRole];
  const userLimit = userLimits.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests,
      reset: now + config.windowMs,
    };
  }

  return {
    allowed: userLimit.count < maxRequests,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - userLimit.count),
    reset: userLimit.resetAt,
  };
}
