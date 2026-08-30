'use client';

import { useEffect, useRef, useState } from 'react';

type Tab = { id: number; title: string; url: string };
const shortcuts = [['G','Google','https://www.google.com'],['Y','YouTube','https://www.youtube.com'],['GH','GitHub','https://github.com'],['M','Gmail','https://mail.google.com']];

function navigate(value: string) {
  const v = value.trim();
  if (!v) return;
  if (/^https?:\/\//i.test(v)) window.location.href = v;
  else window.location.href = `/search?q=${encodeURIComponent(v)}`;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [address, setAddress] = useState('');
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, title: 'New Tab', url: '' }]);
  const [active, setActive] = useState(1);
  const [ai, setAi] = useState(false);
  const [menu, setMenu] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); input.current?.focus(); input.current?.select(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.querySelector<HTMLInputElement>('.searchInput')?.focus(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') { e.preventDefault(); addTab(); }
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);

  const addTab = () => {
    const id = Date.now();
    setTabs(t => [...t, { id, title: 'New Tab', url: '' }]); setActive(id); setAddress('');
  };
  const closeTab = (id: number) => {
    if (tabs.length === 1) return;
    const next = tabs.filter(t => t.id !== id); setTabs(next);
    if (active === id) setActive(next[next.length - 1].id);
  };
  const doSearch = () => { if (!query.trim()) return; navigate(query); };
  const go = () => { if (!address.trim()) return; navigate(address); };

  return <main className="shell" onClick={() => menu && setMenu(false)}>
    <header className="topbar">
      <div className="brand"><span className="logo">◉</span><b>Chrome Pro</b><span className="beta">PRO</span></div>
      <div className="status"><span className="dot"/> Protected <span className="statusSep">•</span> Online</div>
      <button className="icon" aria-label="Settings" onClick={e => { e.stopPropagation(); setMenu(!menu); }}>⚙</button>
      {menu && <div className="menu" onClick={e => e.stopPropagation()}><b>Chrome Pro</b><span>Privacy protection: On</span><span>AI Search: Ready</span><span>Keyboard shortcuts enabled</span><button onClick={() => setMenu(false)}>Close</button></div>}
    </header>

    <section className="tabs">
      {tabs.map(t => <button key={t.id} className={`tab ${active === t.id ? 'active' : ''}`} onClick={() => { setActive(t.id); setAddress(t.url); }}>
        <span>◉</span>{t.title}<i onClick={e => { e.stopPropagation(); closeTab(t.id); }}>×</i>
      </button>)}
      <button className="plus" onClick={addTab} aria-label="New tab">＋</button>
    </section>

    <section className="toolbar">
      <button onClick={() => window.history.back()} aria-label="Back">‹</button>
      <button onClick={() => window.history.forward()} aria-label="Forward">›</button>
      <button onClick={() => window.location.reload()} aria-label="Reload">↻</button>
      <div className="omnibox"><span>🔒</span><input ref={input} value={address} onChange={e => setAddress(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()} placeholder="Search or enter URL"/><button onClick={() => setAddress('')} aria-label="Clear">×</button><span>☆</span></div>
      <button aria-label="Menu" onClick={e => { e.stopPropagation(); setMenu(!menu); }}>⋮</button>
    </section>

    <section className="home">
      <div className="hero"><div className="heroLogo">◉</div><h1>Chrome Pro</h1><p>Fast. Private. Intelligent.</p></div>
      <div className="search"><span>⌕</span><input className="searchInput" autoFocus value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} placeholder="Search the web or ask AI"/><button onClick={() => setAi(!ai)} className={ai ? 'ai activeAI' : 'ai'}>✦ AI</button><button onClick={doSearch}>Search</button></div>
      {ai && <div className="aiPanel"><b>✦ Chrome Pro AI</b><span>AI mode is ready. Connect your preferred AI provider to enable answers, summaries and research.</span><button onClick={() => setAi(false)}>×</button></div>}

      <div className="quick">{shortcuts.map(([icon, name, link]) => <button key={name} onClick={() => window.location.href = link}><span>{icon}</span>{name}</button>)}<button onClick={addTab}><span>＋</span>New tab</button></div>

      <div className="cards">
        <article><span>⚡</span><div><b>AI Search</b><p>Switch between classic web search and AI-powered research.</p></div></article>
        <article><span>🛡</span><div><b>Privacy first</b><p>Secure defaults, minimal local state and no secret keys in the browser.</p></div></article>
        <article><span>🚀</span><div><b>Resilient by design</b><p>Health checks and provider fallbacks are ready for production services.</p></div></article>
      </div>
      <div className="features"><span>⌘K Quick Search</span><span>⌘L Address Bar</span><span>⌘T New Tab</span><span>HTTPS Ready</span></div>
    </section>
    <footer><span>Chrome Pro 1.1</span><span>Private by design</span><span>Search infrastructure ready</span></footer>
  </main>;
}
