import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * POST /api/login
 * Body: { "password": "..." }
 * 200 -> { token, expiresAt }
 * 401 -> invalid password
 * 429 -> too many attempts
 *
 * The password never leaves this function: it is compared server-side against
 * ADMIN_PASSWORD and never shipped to the browser.
 */

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 8;

const attempts = new Map<string, { count: number; reset: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const rec = attempts.get(key);

  if (!rec || now > rec.reset) {
    attempts.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }

  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");

  // timingSafeEqual throws on length mismatch, so compare lengths first.
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readBody(raw: unknown): Record<string, unknown> {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (raw && typeof raw === "object") return raw as Record<string, unknown>;
  return {};
}

export default async function handler(
  req: { method?: string; body?: unknown; headers: Record<string, unknown>; socket?: { remoteAddress?: string } },
  res: {
    status: (code: number) => unknown;
    json: (body: unknown) => void;
    setHeader: (key: string, value: string) => void;
    end: () => void;
  }
): Promise<void> {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;

  if (!password || !secret) {
    res.status(500).json({ error: "Server is not configured. Set ADMIN_PASSWORD and ADMIN_SECRET." });
    return;
  }

  const ip =
    (typeof req.headers["x-forwarded-for"] === "string" ? req.headers["x-forwarded-for"].split(",")[0].trim() : "") ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(ip)) {
    res.setHeader("Retry-After", String(Math.ceil(WINDOW_MS / 1000)));
    res.status(429).json({ error: "Too many attempts. Try again in 15 minutes." });
    return;
  }

  const body = readBody(req.body);
  const provided = typeof body.password === "string" ? body.password : "";

  if (!provided || !constantTimeEquals(provided, password)) {
    await sleep(400); // slow down brute force
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const signature = createHmac("sha256", secret).update(String(expiresAt)).digest("hex");

  res.status(200).json({
    token: `${expiresAt}.${signature}`,
    expiresAt,
  });
}
