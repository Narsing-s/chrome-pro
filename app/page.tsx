'use client';

import {useState} from 'react';

const quick=[['G','Google'],['Y','YouTube'],['G','GitHub'],['M','Gmail']];

export default function Home(){
 const [query,setQuery]=useState(''); const [url,setUrl]=useState(''); const [tab,setTab]=useState(1); const [ai,setAi]=useState(false);
 const search=()=>{if(!query.trim())return; setUrl('/search?q='+encodeURIComponent(query)); setQuery('');};
 return <main className="shell">
  <header className="topbar"><div className="brand"><span className="logo">◉</span><b>Chrome Pro</b></div><div className="status"><span className="dot"/> All systems protected</div><button className="icon">⚙</button></header>
  <section className="tabs"><button className="tab active">⌂ New Tab</button><button className="plus">＋</button></section>
  <section className="toolbar"><button>‹</button><button>›</button><button>↻</button><div className="omnibox"><span>🔒</span><input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&setUrl(url)} placeholder="Search or enter URL"/><span>☆</span></div><button>⋮</button></section>
  <section className="home">
   <div className="hero"><div className="heroLogo">◉</div><h1>Chrome Pro</h1><p>Fast. Private. Intelligent.</p></div>
   <div className="search"><span>⌕</span><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()} placeholder="Search the web or ask AI"/><button onClick={()=>setAi(!ai)} className={ai?'ai activeAI':'ai'}>✦ AI</button><button onClick={search}>Search</button></div>
   {ai&&<div className="aiPanel"><b>✦ Chrome Pro AI</b><span>Ask questions, summarize pages, research topics and more.</span><button onClick={()=>setAi(false)}>×</button></div>}
   <div className="quick">{quick.map(([i,n])=><button key={n} onClick={()=>setQuery(n)}><span>{i}</span>{n}</button>)}<button><span>＋</span>Add shortcut</button></div>
   <div className="cards"><article><span>⚡</span><div><b>AI Search</b><p>Get direct answers with useful sources.</p></div></article><article><span>🛡</span><div><b>Privacy first</b><p>Built with protection and safe defaults.</p></div></article><article><span>🚀</span><div><b>Always available</b><p>Fallbacks keep search working when a service fails.</p></div></article></div>
  </section>
  <footer><span>Chrome Pro 1.0</span><span>Private by design</span><span>⌘K Quick Search</span></footer>
 </main>
}