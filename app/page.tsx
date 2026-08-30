'use client';

import { useEffect, useRef, useState } from 'react';

type Tab = { id: number; title: string; url: string };
const shortcuts = [['G','Google','https://www.google.com'],['Y','YouTube','https://www.youtube.com'],['GH','GitHub','https://github.com'],['M','Gmail','https://mail.google.com']];
const STORAGE_KEY = 'chrome-pro-tabs-v2';

function navigate(value: string) {
  const v = value.trim();
  if (!v) return;
  if (/^https?:\/\//i.test(v)) window.location.href = v;
  else if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(v)) window.location.href = `https://${v}`;
  else window.location.href = `/search?q=${encodeURIComponent(v)}`;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [address, setAddress] = useState('');
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, title: 'New Tab', url: '' }]);
  const [active, setActive] = useState(1);
  const [ai, setAi] = useState(false);
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { tabs?: Tab[]; active?: number; dark?: boolean };
        const savedTabs = parsed.tabs;
        if (savedTabs && savedTabs.length > 0) {
          const savedActive = parsed.active ?? savedTabs[0].id;
          setTabs(savedTabs);
          setActive(savedActive);
          setAddress(savedTabs.find(t => t.id === savedActive)?.url ?? '');
        }
        if (parsed.dark) setDark(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ tabs, active, dark })); } catch {}
  }, [tabs, active, dark]);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); input.current?.focus(); input.current?.select(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.querySelector<HTMLInputElement>('.searchInput')?.focus(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') { e.preventDefault(); addTab(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') { e.preventDefault(); closeTab(active); }
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  });

  const addTab = () => {
    const id = Date.now();
    setTabs(t => [...t, { id, title: 'New Tab', url: '' }]); setActive(id); setAddress(''); setQuery('');
  };
  const closeTab = (id: number) => {
    if (tabs.length === 1) return;
    const next = tabs.filter(t => t.id !== id); const nextActive = active === id ? next[Math.max(0, next.findIndex(t => t.id !== id))]?.id ?? next[next.length - 1].id : active;
    setTabs(next); setActive(nextActive); setAddress(next.find(t => t.id === nextActive)?.url ?? '');
  };
  const selectTab = (id: number) => { setActive(id); setAddress(tabs.find(t => t.id === id)?.url ?? ''); setQuery(''); };
  const doSearch = () => { if (!query.trim()) return; navigate(query); };
  const go = () => {
    const value = address.trim(); if (!value) return;
    setTabs(ts => ts.map(t => t.id === active ? { ...t, title: value.replace(/^https?:\/\//, '').split('/')[0].slice(0, 24) || 'New Tab', url: value } : t));
    navigate(value);
  };

  return <main className="shell" onClick={() => menu && setMenu(false)}>
    <header className="topbar">
      <div className="brand"><span className="logo">◉</span><b>Chrome Pro</b><span className="beta">PRO</span></div>
      <div className="status"><span className="dot"/> Protected <span className="statusSep">•</span> Online</div>
      <a href="/download" className="downloadTop">Download Desktop</a>
      <button className="icon" aria-label="Settings" onClick={e => { e.stopPropagation(); setMenu(!menu); }}>⚙</button>
      {menu && <div className="menu" onClick={e => e.stopPropagation()}><b>Chrome Pro settings</b><span>Privacy protection: On</span><span>AI Search: Ready</span><span>Session restore: On</span><label className="toggle"><input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)}/> Dark appearance</label><button onClick={() => { localStorage.removeItem(STORAGE_KEY); location.reload(); }}>Reset local data</button></div>}
    </header>

    <section className="tabs">
      {tabs.map(t => <button key={t.id} className={`tab ${active === t.id ? 'active' : ''}`} onClick={() => selectTab(t.id)}>
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
      {ai && <div className="aiPanel"><b>✦ Chrome Pro AI</b><span>AI mode is ready. Connect your preferred AI provider for answers, summaries and research.</span><button onClick={() => setAi(false)}>×</button></div>}
      <div className="quick"><a className="downloadQuick" href="/download">⬇ Download Chrome Pro</a>{shortcuts.map(([icon, name, link]) => <button key={name} onClick={() => window.location.href = link}><span>{icon}</span>{name}</button>)}<button onClick={addTab}><span>＋</span>New tab</button></div>
      <div className="cards"><article><span>⚡</span><div><b>AI Search</b><p>Switch between classic web search and AI-powered research.</p></div></article><article><span>🛡</span><div><b>Privacy first</b><p>Secure defaults, local session restore and no secret keys in the browser.</p></div></article><article><span>🚀</span><div><b>Resilient by design</b><p>Search outages fall back without taking down the Chrome Pro interface.</p></div></article></div>
      <div className="features"><span>⌘K Quick Search</span><span>⌘L Address Bar</span><span>⌘T New Tab</span><span>⌘W Close Tab</span><span>HTTPS Ready</span></div>
    </section>
    <footer><span>Chrome Pro 1.2</span><span>Private by design</span><span>Session restore enabled</span></footer>
  </main>;
}
