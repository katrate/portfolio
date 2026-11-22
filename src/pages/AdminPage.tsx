import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';

import { type ProjectData } from '../components/ProjectsStickyStack';

const TOKEN_KEY = 'katrate_admin_token';
const CATEGORIES = ['LANGUAGES', 'CLI', 'WEBSITES', 'APPS', 'TOOLS'] as const;

const BLANK: ProjectData = {
  id: '',
  name: '',
  category: 'APPS',
  categoryLabel: '',
  tagline: '',
  description: '',
  language: 'TypeScript',
  tags: [],
  githubUrl: '',
  image: '/assets/synapse.jpg',
  codeSnippet: { lang: 'typescript', filename: 'main.ts', code: '// your code here' },
};

type Notice = { kind: 'ok' | 'err'; text: string } | null;

/* ------------------------------- primitives ------------------------------- */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between mb-1.5">
        <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-zinc-500 uppercase">{label}</span>
        {hint && <span className="text-[10px] text-zinc-600 font-mono">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF]/40 transition';

/* --------------------------------- login --------------------------------- */

function Login({ onAuth }: { onAuth: (token: string, expiresAt: number) => void }) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError('');

    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const j = await r.json().catch(() => ({}));

      if (!r.ok) throw new Error(j.error || 'Login failed');
      onAuth(j.token, j.expiresAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0E12] text-zinc-100 flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="mb-8">
          <div className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#0052FF] mb-3">CONTENT ADMIN</div>
          <h1 className="text-3xl font-black tracking-tight">katrate.is-a.dev</h1>
          <p className="text-sm text-zinc-500 mt-2 font-mono">/admin — projects console</p>
        </div>

        <Field label="Password">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputCls}
            autoComplete="current-password"
          />
        </Field>

        {error && (
          <p className="mt-3 text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0052FF] px-4 py-3 text-sm font-bold text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {busy ? 'CHECKING…' : 'UNLOCK'}
        </button>

        <Link
          to="/"
          className="mt-6 block text-center text-xs font-mono text-zinc-600 hover:text-zinc-400 transition"
        >
          ← back to site
        </Link>
      </form>
    </div>
  );
}

/* --------------------------------- editor -------------------------------- */

function Editor({
  draft,
  setDraft,
  onSave,
  onClose,
  busy,
  isNew,
}: {
  draft: ProjectData;
  setDraft: (p: ProjectData) => void;
  onSave: () => void;
  onClose: () => void;
  busy: boolean;
  isNew: boolean;
}) {
  const set = <K extends keyof ProjectData>(key: K, value: ProjectData[K]) =>
    setDraft({ ...draft, [key]: value });

  const setSnippet = (key: keyof ProjectData['codeSnippet'], value: string) =>
    setDraft({ ...draft, codeSnippet: { ...draft.codeSnippet, [key]: value } });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5">
        <div className="min-w-0">
          <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#0052FF]">
            {isNew ? 'NEW PROJECT' : 'EDIT PROJECT'}
          </div>
          <div className="text-sm font-bold truncate">{draft.name || draft.id || 'untitled'}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onSave}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0052FF] px-3 py-2 text-xs font-bold text-white hover:bg-blue-600 disabled:opacity-40 transition cursor-pointer"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            SAVE
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            aria-label="Close editor"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-5 grid gap-4 md:grid-cols-2 max-h-[70vh] overflow-y-auto">
        <Field label="ID" hint="lowercase, dashes">
          <input className={inputCls} value={draft.id} onChange={(e) => set('id', e.target.value)} placeholder="my-project" />
        </Field>

        <Field label="Name">
          <input className={inputCls} value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="my-project" />
        </Field>

        <Field label="Category">
          <select className={inputCls} value={draft.category} onChange={(e) => set('category', e.target.value as ProjectData['category'])}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-black">
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Category label" hint="shown under the card">
          <input className={inputCls} value={draft.categoryLabel} onChange={(e) => set('categoryLabel', e.target.value)} placeholder="Fintech & Analytics App" />
        </Field>

        <Field label="Tagline" hint="one line">
          <input className={inputCls} value={draft.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="Short punchy summary" />
        </Field>

        <Field label="Language">
          <input className={inputCls} value={draft.language} onChange={(e) => set('language', e.target.value)} placeholder="TypeScript" />
        </Field>

        <div className="md:col-span-2">
          <Field label="Description">
            <textarea rows={3} className={inputCls} value={draft.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Tags" hint="comma separated">
            <input
              className={inputCls}
              value={draft.tags.join(', ')}
              onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
              placeholder="React, TypeScript, Tailwind"
            />
          </Field>
        </div>

        <Field label="GitHub URL">
          <input className={inputCls} value={draft.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} placeholder="https://github.com/katrate/…" />
        </Field>

        <Field label="Live URL" hint="optional">
          <input className={inputCls} value={draft.liveUrl ?? ''} onChange={(e) => set('liveUrl', e.target.value)} placeholder="https://…" />
        </Field>

        <Field label="Releases URL" hint="optional">
          <input className={inputCls} value={draft.releasesUrl ?? ''} onChange={(e) => set('releasesUrl', e.target.value)} placeholder="https://github.com/…/releases/tag/v1.0.0" />
        </Field>

        <Field label="Image path" hint="optional">
          <input className={inputCls} value={draft.image} onChange={(e) => set('image', e.target.value)} placeholder="/assets/synapse.jpg" />
        </Field>

        <Field label="Status" hint="optional">
          <select className={inputCls} value={draft.status ?? ''} onChange={(e) => set('status', (e.target.value || undefined) as ProjectData['status'])}>
            <option value="" className="bg-black">
              — none —
            </option>
            <option value="active" className="bg-black">
              active
            </option>
            <option value="building" className="bg-black">
              building
            </option>
          </select>
        </Field>

        <Field label="Benchmark" hint="optional">
          <input className={inputCls} value={draft.benchmark ?? ''} onChange={(e) => set('benchmark', e.target.value)} placeholder=".kl → C TRANSPILED" />
        </Field>

        <Field label="Snippet language">
          <input className={inputCls} value={draft.codeSnippet.lang} onChange={(e) => setSnippet('lang', e.target.value)} placeholder="typescript" />
        </Field>

        <Field label="Snippet filename">
          <input className={inputCls} value={draft.codeSnippet.filename} onChange={(e) => setSnippet('filename', e.target.value)} placeholder="main.ts" />
        </Field>

        <div className="md:col-span-2">
          <Field label="Code snippet">
            <textarea
              rows={8}
              spellCheck={false}
              className={`${inputCls} font-mono text-xs leading-relaxed`}
              value={draft.codeSnippet.code}
              onChange={(e) => setSnippet('code', e.target.value)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- page --------------------------------- */

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [draft, setDraft] = useState<ProjectData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [dirty, setDirty] = useState(false);

  /* restore session */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(TOKEN_KEY);
      if (!raw) return;
      const { token: t, expiresAt } = JSON.parse(raw) as { token: string; expiresAt: number };
      if (expiresAt > Date.now()) setToken(t);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  const load = useCallback(async (t: string) => {
    setLoading(true);
    setNotice(null);
    try {
      const r = await fetch('/api/projects', { headers: { Authorization: `Bearer ${t}` }, cache: 'no-store' });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Failed to load content');
      setProjects(j.content as ProjectData[]);
      setDirty(false);
    } catch (err) {
      setNotice({ kind: 'err', text: err instanceof Error ? err.message : 'Failed to load content' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) void load(token);
  }, [token, load]);

  const auth = (t: string, expiresAt: number) => {
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify({ token: t, expiresAt }));
    setToken(t);
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setProjects([]);
    setDraft(null);
    setNotice(null);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.name, p.id, p.tagline, p.category, p.language, ...(p.tags ?? [])].join(' ').toLowerCase().includes(q)
    );
  }, [projects, query]);

  const startNew = () => {
    setDraft({ ...BLANK, id: `project-${projects.length + 1}` });
    setEditingId(null);
    setIsNew(true);
    setDirty(false);
  };

  const startEdit = (p: ProjectData) => {
    setDraft(JSON.parse(JSON.stringify(p)) as ProjectData);
    setEditingId(p.id);
    setIsNew(false);
    setDirty(false);
  };

  const closeEditor = () => {
    if (dirty && !window.confirm('Discard unsaved changes?')) return;
    setDraft(null);
    setDirty(false);
  };

  const save = async () => {
    if (!token || !draft) return;
    setBusy(true);
    setNotice(null);

    const next = isNew ? [...projects, draft] : projects.map((p) => (p.id === editingId ? draft : p));

    try {
      const r = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: next }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Save failed');

      setProjects(next);
      setDirty(false);
      setDraft(null);
      setNotice({
        kind: 'ok',
        text: j.unchanged ? 'No changes to save.' : `${j.message} (commit ${(j.commitSha || '').slice(0, 7)})`,
      });
    } catch (err) {
      setNotice({ kind: 'err', text: err instanceof Error ? err.message : 'Save failed' });
    } finally {
      setBusy(false);
    }
  };

  const remove = (id: string) => {
    if (!window.confirm(`Delete "${id}"? This is saved only when you press SAVE.`)) return;
    setProjects(projects.filter((p) => p.id !== id));
    setDirty(true);
    if (editingId === id) {
      setDraft(null);
      setEditingId(null);
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= projects.length) return;
    const copy = [...projects];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setProjects(copy);
    setDirty(true);
  };

  const duplicate = (p: ProjectData) => {
    const copy = JSON.parse(JSON.stringify(p)) as ProjectData;
    copy.id = `${p.id}-copy`;
    copy.name = `${p.name} copy`;
    setProjects([...projects, copy]);
    setDirty(true);
  };

  const revert = async () => {
    if (dirty && !window.confirm('Discard local changes and reload from GitHub?')) return;
    if (token) await load(token);
  };

  const saveAll = async () => {
    if (!token) return;
    setBusy(true);
    setNotice(null);
    try {
      const r = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: projects }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Save failed');
      setDirty(false);
      setNotice({ kind: 'ok', text: j.unchanged ? 'No changes to save.' : `${j.message} (commit ${(j.commitSha || '').slice(0, 7)})` });
    } catch (err) {
      setNotice({ kind: 'err', text: err instanceof Error ? err.message : 'Save failed' });
    } finally {
      setBusy(false);
    }
  };

  if (!token) return <Login onAuth={auth} />;

  return (
    <div className="min-h-screen bg-[#0D0E12] text-zinc-100">
      {/* top bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0D0E12]/95 backdrop-blur px-4 sm:px-6 py-3">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#0052FF]">/admin</span>
            <span className="text-sm font-bold truncate">Projects Console</span>
            <span className="hidden sm:inline text-[10px] font-mono text-zinc-600">content/projects.json</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="filter…"
                className="w-32 sm:w-44 rounded-lg bg-black/40 border border-white/10 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#0052FF] transition"
              />
            </div>

            <button
              onClick={revert}
              title="Reload from GitHub"
              className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={logout}
              title="Log out"
              className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {notice && (
          <div
            className={`mt-3 rounded-lg px-3 py-2 text-xs font-mono border ${
              notice.kind === 'ok'
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                : 'bg-red-500/10 border-red-500/25 text-red-300'
            }`}
          >
            {notice.text}
          </div>
        )}
      </header>

      <main className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500">
              {projects.length} PROJECT{projects.length === 1 ? '' : 'S'}
            </span>
            {dirty && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300">
                UNSAVED
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startNew}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0052FF] px-3 py-2 text-xs font-bold text-white hover:bg-blue-600 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> NEW PROJECT
            </button>
            <button
              onClick={saveAll}
              disabled={!dirty || busy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-zinc-200 hover:bg-white/5 disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              SAVE ALL
            </button>
          </div>
        </div>

        {draft && (
          <div className="mb-6">
            <Editor
              draft={draft}
              setDraft={(p) => {
                setDraft(p);
                setDirty(true);
              }}
              onSave={save}
              onClose={closeEditor}
              busy={busy}
              isNew={isNew}
            />
          </div>
        )}

        {loading && !projects.length ? (
          <div className="flex items-center gap-2 text-sm font-mono text-zinc-500 py-16 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> loading content…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-sm font-mono text-zinc-600">
            {projects.length === 0 ? 'No projects yet — hit NEW PROJECT.' : 'Nothing matches that filter.'}
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((p) => {
              const realIndex = projects.findIndex((x) => x.id === p.id);
              return (
                <li
                  key={p.id}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 hover:border-white/20 transition"
                >
                  <span className="text-[10px] font-mono text-zinc-700 w-6 shrink-0 text-right">{realIndex + 1}</span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold truncate">{p.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0052FF]/15 border border-[#0052FF]/30 text-[#4d8bff]">
                        {p.category}
                      </span>
                      {p.status && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                          {p.status}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 truncate mt-0.5">{p.tagline}</div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition">
                    <button onClick={() => move(realIndex, -1)} disabled={realIndex === 0} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-25 transition cursor-pointer" aria-label="Move up">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => move(realIndex, 1)} disabled={realIndex === projects.length - 1} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-25 transition cursor-pointer" aria-label="Move down">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => duplicate(p)} className="p-1.5 rounded hover:bg-white/10 transition cursor-pointer" aria-label="Duplicate">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => startEdit(p)} className="px-2.5 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold hover:bg-white/10 transition cursor-pointer">
                      EDIT
                    </button>
                    <button onClick={() => remove(p.id)} className="p-1.5 rounded hover:bg-red-500/15 text-zinc-500 hover:text-red-400 transition cursor-pointer" aria-label="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-8 text-[11px] font-mono text-zinc-700 leading-relaxed">
          Edits are committed to <span className="text-zinc-500">content/projects.json</span> on GitHub, which
          triggers a Vercel redeploy (~45s). Order and deletions only persist after SAVE / SAVE ALL.
        </p>
      </main>
    </div>
  );
}
