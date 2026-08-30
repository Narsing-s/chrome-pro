import Link from 'next/link';

type Result = { title: string; url: string; content?: string };

async function searchWeb(q: string): Promise<Result[]> {
  const base = process.env.SEARCH_ENGINE_URL?.replace(/\/$/, '');
  if (!base) return [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(`${base}/search?q=${encodeURIComponent(q)}&format=json`, { signal: controller.signal, cache: 'no-store', headers: { accept: 'application/json' } });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).slice(0, 12).map((r: Result) => ({ title: r.title, url: r.url, content: r.content }));
  } catch { return []; }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const query = q.trim();
  const results = query ? await searchWeb(query) : [];
  return <main className="resultsPage">
    <header className="resultsHeader"><Link href="/" className="resultBrand"><span>◉</span><b>Chrome Pro</b></Link><form action="/search"><input name="q" defaultValue={query} autoFocus placeholder="Search the web"/><button>Search</button></form></header>
    <section className="resultsBody">
      <div className="resultMeta">{query ? `${results.length} results • Chrome Pro Search` : 'Enter a search to begin'}</div>
      {results.length > 0 ? results.map((r, i) => <article className="result" key={`${r.url}-${i}`}><a href={r.url} target="_blank" rel="noreferrer"><h2>{r.title}</h2><small>{r.url}</small><p>{r.content}</p></a></article>) : query ? <div className="empty"><b>No results from the configured search provider.</b><p>Chrome Pro remains usable. Configure <code>SEARCH_ENGINE_URL</code> with your Nova Search/SearXNG endpoint and retry.</p><a href={`https://www.google.com/search?q=${encodeURIComponent(query)}`} target="_blank" rel="noreferrer">Use web fallback</a></div> : null}
    </section>
  </main>;
}
