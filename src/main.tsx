import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// ── Global: open all external links in a new tab ──────────────────────────────
document.addEventListener('click', (e) => {
  const anchor = (e.target as Element).closest('a');
  if (!anchor) return;

  const href = anchor.getAttribute('href') ?? '';

  // Leave React Router internal links alone (relative paths / hash)
  const isInternal =
    href.startsWith('/') ||
    href.startsWith('#') ||
    href.startsWith(window.location.origin);

  if (!isInternal && (href.startsWith('http://') || href.startsWith('https://'))) {
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
  }
}, true); // capture phase — runs before React handlers

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

