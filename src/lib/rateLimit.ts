type WindowLimit = {
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter: number;
};

const CHAT_LIMITS: WindowLimit[] = [
  { limit: 8, windowMs: 60_000 },
  { limit: 35, windowMs: 60 * 60_000 },
];

const buckets = new Map<string, number[]>();

function getClientKey(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  const cfIp = req.headers.get("cf-connecting-ip")?.trim();

  return forwardedFor || realIp || cfIp || "local-anonymous";
}

function pruneOldEntries(key: string, now: number, maxWindowMs: number) {
  const entries = buckets.get(key) ?? [];
  const freshEntries = entries.filter((timestamp) => now - timestamp < maxWindowMs);

  if (freshEntries.length === 0) {
    buckets.delete(key);
    return freshEntries;
  }

  buckets.set(key, freshEntries);
  return freshEntries;
}

export function checkChatRateLimit(req: Request): RateLimitResult {
  const now = Date.now();
  const key = `chat:${getClientKey(req)}`;
  const maxWindowMs = Math.max(...CHAT_LIMITS.map((limit) => limit.windowMs));
  const entries = pruneOldEntries(key, now, maxWindowMs);

  const tightestExceededLimit = CHAT_LIMITS.map((windowLimit) => {
    const hits = entries.filter((timestamp) => now - timestamp < windowLimit.windowMs);
    const resetAt =
      hits.length > 0 ? hits[0] + windowLimit.windowMs : now + windowLimit.windowMs;

    return {
      allowed: hits.length < windowLimit.limit,
      limit: windowLimit.limit,
      remaining: Math.max(windowLimit.limit - hits.length, 0),
      resetAt,
      retryAfter: Math.max(Math.ceil((resetAt - now) / 1000), 1),
    };
  }).find((result) => !result.allowed);

  if (tightestExceededLimit) return tightestExceededLimit;

  entries.push(now);
  buckets.set(key, entries);

  const shortestWindow = CHAT_LIMITS[0];
  const hitsInShortestWindow = entries.filter(
    (timestamp) => now - timestamp < shortestWindow.windowMs
  );

  return {
    allowed: true,
    limit: shortestWindow.limit,
    remaining: Math.max(shortestWindow.limit - hitsInShortestWindow.length, 0),
    resetAt: hitsInShortestWindow[0] + shortestWindow.windowMs,
    retryAfter: 0,
  };
}

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    ...(result.retryAfter > 0
      ? { "Retry-After": String(result.retryAfter) }
      : {}),
  };
}
