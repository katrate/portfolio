import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * GET  /api/projects  -> current content/projects.json from GitHub (always fresh)
 * PUT  /api/projects  -> validate + commit updated content back to GitHub
 *
 * GitHub is the database. Every save is a commit, so you get history and
 * rollback for free. Vercel redeploys automatically once the commit lands.
 */

const GITHUB_API = "https://api.github.com";
const REPO = process.env.CONTENT_REPO ?? "katrate/portfolio";
const BRANCH = process.env.CONTENT_BRANCH ?? "main";
const FILE_PATH = "content/projects.json";

const CATEGORIES = ["LANGUAGES", "CLI", "WEBSITES", "APPS", "TOOLS"] as const;
const STATUSES = ["active", "building"] as const;

type Json = Record<string, unknown>;
type Req = {
  method?: string;
  body?: unknown;
  headers: Record<string, unknown>;
  socket?: { remoteAddress?: string };
};
type Res = {
  status: (code: number) => unknown;
  json: (body: unknown) => void;
  setHeader: (key: string, value: string) => void;
  end: () => void;
};

/* ---------------------------------- auth --------------------------------- */

function verifyToken(token: string | undefined): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [expiresAt, signature] = parts;
  if (!/^\d+$/.test(expiresAt)) return false;
  if (Number(expiresAt) < Date.now()) return false;

  const expected = createHmac("sha256", secret).update(expiresAt).digest("hex");
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function bearer(req: Req): string | undefined {
  const raw = req.headers.authorization;
  if (typeof raw !== "string") return undefined;
  const m = /^Bearer\s+(.+)$/i.exec(raw.trim());
  return m ? m[1] : undefined;
}

/* ------------------------------- validation ------------------------------- */

const isStr = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const isHttp = (v: unknown): v is string => typeof v === "string" && /^https?:\/\/\S+$/.test(v.trim());

/** Keep only known fields so junk never accumulates in the repo. */
function sanitize(p: Json): Json {
  const out: Json = {
    id: String(p.id ?? "").trim(),
    name: String(p.name ?? "").trim(),
    category: String(p.category ?? ""),
    categoryLabel: String(p.categoryLabel ?? "").trim(),
    tagline: String(p.tagline ?? "").trim(),
    description: String(p.description ?? "").trim(),
    language: String(p.language ?? "").trim(),
    tags: Array.isArray(p.tags) ? p.tags.filter((t): t is string => typeof t === "string") : [],
    githubUrl: String(p.githubUrl ?? "").trim(),
    image: String(p.image ?? "").trim(),
    codeSnippet: {
      lang: String((p.codeSnippet as Json | undefined)?.lang ?? "").trim(),
      filename: String((p.codeSnippet as Json | undefined)?.filename ?? "").trim(),
      code: String((p.codeSnippet as Json | undefined)?.code ?? ""),
    },
  };

  if (isHttp(p.liveUrl)) out.liveUrl = p.liveUrl.trim();
  if (isHttp(p.releasesUrl)) out.releasesUrl = p.releasesUrl.trim();
  if (typeof p.status === "string" && (STATUSES as readonly string[]).includes(p.status)) out.status = p.status;
  if (typeof p.benchmark === "string" && p.benchmark.trim()) out.benchmark = p.benchmark.trim();

  return out;
}

function validate(data: unknown): string | null {
  if (!Array.isArray(data)) return "Root must be an array of projects.";
  if (data.length === 0) return "Add at least one project.";
  if (data.length > 200) return "Too many projects (max 200).";

  const seen = new Set<string>();

  for (let i = 0; i < data.length; i++) {
    const p = data[i];
    const at = `projects[${i}]`;

    if (!p || typeof p !== "object" || Array.isArray(p)) return `${at}: must be an object.`;
    const o = p as Json;

    for (const field of ["id", "name", "category", "categoryLabel", "tagline", "description", "language", "githubUrl", "image"]) {
      if (!isStr(o[field])) return `${at}.${field}: required non-empty text.`;
    }

    if (!/^[a-z0-9][a-z0-9-]*$/.test(String(o.id))) {
      return `${at}.id: lowercase letters, numbers and dashes only (used in URLs).`;
    }
    if (seen.has(String(o.id))) return `${at}.id: duplicate id "${String(o.id)}".`;
    seen.add(String(o.id));

    if (!(CATEGORIES as readonly string[]).includes(String(o.category))) {
      return `${at}.category: must be one of ${CATEGORIES.join(", ")}.`;
    }

    if (!isHttp(o.githubUrl)) return `${at}.githubUrl: must start with http:// or https://.`;
    if (o.liveUrl !== undefined && o.liveUrl !== "" && !isHttp(o.liveUrl)) return `${at}.liveUrl: must start with http:// or https://.`;
    if (o.releasesUrl !== undefined && o.releasesUrl !== "" && !isHttp(o.releasesUrl)) return `${at}.releasesUrl: must start with http:// or https://.`;

    if (o.status !== undefined && o.status !== "" && !(STATUSES as readonly string[]).includes(String(o.status))) {
      return `${at}.status: must be "active" or "building".`;
    }

    if (!Array.isArray(o.tags)) return `${at}.tags: must be a list.`;
    if (o.tags.some((t) => typeof t !== "string")) return `${at}.tags: every tag must be text.`;

    const snip = o.codeSnippet;
    if (!snip || typeof snip !== "object" || Array.isArray(snip)) return `${at}.codeSnippet: required.`;
    const s = snip as Json;
    if (!isStr(s.lang)) return `${at}.codeSnippet.lang: required (e.g. typescript).`;
    if (!isStr(s.filename)) return `${at}.codeSnippet.filename: required (e.g. main.ts).`;
    if (typeof s.code !== "string") return `${at}.codeSnippet.code: must be text.`;
  }

  return null;
}

/* ------------------------------ github access ----------------------------- */

function ghHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "katrate-portfolio-cms",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function readRemote(): Promise<{ sha: string; text: string }> {
  const url = `${GITHUB_API}/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
  const r = await fetch(url, { headers: ghHeaders(), cache: "no-store" });

  if (!r.ok) throw new Error(`GitHub read failed (${r.status}).`);
  const j = (await r.json()) as { sha?: string; content?: string };
  if (!j.sha || typeof j.content !== "string") throw new Error("Unexpected GitHub response.");

  return { sha: j.sha, text: Buffer.from(j.content, "base64").toString("utf8") };
}

async function writeRemote(text: string, message: string, sha: string): Promise<{ commitSha: string }> {
  const url = `${GITHUB_API}/repos/${REPO}/contents/${FILE_PATH}`;
  const r = await fetch(url, {
    method: "PUT",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(text, "utf8").toString("base64"),
      branch: BRANCH,
      sha,
    }),
  });

  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    throw new Error(`GitHub write failed (${r.status}). ${detail.slice(0, 200)}`);
  }

  const j = (await r.json()) as { commit?: { sha?: string } };
  return { commitSha: j.commit?.sha ?? "" };
}

/* -------------------------------- handler -------------------------------- */

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "GET, PUT, OPTIONS");
    res.status(204).end();
    return;
  }

  if (req.method === "GET") {
    try {
      const { text } = await readRemote();
      JSON.parse(text); // fail loudly rather than ship broken data
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json({ content: JSON.parse(text), path: FILE_PATH, branch: BRANCH, repo: REPO });
    } catch (err) {
      res.status(502).json({ error: err instanceof Error ? err.message : "Failed to load content." });
    }
    return;
  }

  if (req.method === "PUT" || req.method === "POST") {
    if (!verifyToken(bearer(req))) {
      res.status(401).json({ error: "Not authenticated." });
      return;
    }
    if (!process.env.GITHUB_TOKEN) {
      res.status(500).json({ error: "GITHUB_TOKEN is not set on this deployment." });
      return;
    }

    try {
      const raw = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const payload = (raw ?? {}) as Json;
      const data = payload.content;

      const problem = validate(data);
      if (problem) {
        res.status(400).json({ error: problem });
        return;
      }

      const projects = (data as Json[]).map(sanitize);
      const text = `${JSON.stringify(projects, null, 2)}\n`;

      const { sha, text: currentText } = await readRemote();

      // Skip the commit entirely if nothing actually changed.
      if (currentText === text) {
        res.status(200).json({ unchanged: true, message: "No changes to save." });
        return;
      }

      const message =
        typeof payload.message === "string" && payload.message.trim()
          ? payload.message.trim()
          : `chore(content): update projects (${projects.length} total)`;

      const { commitSha } = await writeRemote(text, message, sha);

      res.status(200).json({
        ok: true,
        commitSha,
        count: projects.length,
        message: "Saved. The site is redeploying now (~45s).",
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Save failed." });
    }
    return;
  }

  res.setHeader("Allow", "GET, PUT, OPTIONS");
  res.status(405).json({ error: "Method not allowed" });
}
