'use client';

import { useEffect, useMemo, useState } from 'react';

type Asset = { name: string; browser_download_url: string; size: number };
type Release = { tag_name: string; name: string; published_at: string; html_url: string; assets: Asset[] };

function pick(assets: Asset[], pattern: RegExp) {
  return assets.find(a => pattern.test(a.name));
}

export default function DownloadPage() {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/repos/Narsing-s/chrome-pro/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setRelease)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const downloads = useMemo(() => {
    const assets = release?.assets ?? [];
    return {
      windows: pick(assets, /\.exe$/i),
      mac: pick(assets, /\.dmg$/i),
      linux: pick(assets, /\.AppImage$/i),
    };
  }, [release]);

  return (
    <main className="downloadPage">
      <nav className="downloadNav">
        <a href="/" className="downloadBrand"><span>◉</span><b>Chrome Pro</b></a>
        <a href="https://github.com/Narsing-s/chrome-pro/releases" target="_blank" rel="noreferrer">All releases ↗</a>
      </nav>

      <section className="downloadHero">
        <div className="downloadLogo">◉</div>
        <div className="releaseBadge">LATEST DESKTOP RELEASE</div>
        <h1>Chrome Pro for everyone.</h1>
        <p>Download the native Chrome Pro desktop browser with local Chromium rendering, profiles, incognito windows, bookmarks, history and a fast browser workspace.</p>

        {loading && <div className="releaseStatus">Checking the latest release…</div>}
        {error && <div className="releaseStatus error">The latest release could not be loaded. Use the GitHub releases page below.</div>}

        <div className="downloadGrid">
          <article className="downloadCard featured">
            <div><span className="platform">▣</span><h2>Windows</h2><p>Windows 10/11 • Installer</p></div>
            {downloads.windows ? <a className="downloadButton" href={downloads.windows.browser_download_url}>Download .exe</a> : <span className="disabledButton">Not published yet</span>}
          </article>
          <article className="downloadCard">
            <div><span className="platform">●</span><h2>macOS</h2><p>Intel & Apple Silicon • DMG</p></div>
            {downloads.mac ? <a className="downloadButton" href={downloads.mac.browser_download_url}>Download .dmg</a> : <span className="disabledButton">Not published yet</span>}
          </article>
          <article className="downloadCard">
            <div><span className="platform">◆</span><h2>Linux</h2><p>AppImage • Portable</p></div>
            {downloads.linux ? <a className="downloadButton" href={downloads.linux.browser_download_url}>Download AppImage</a> : <span className="disabledButton">Not published yet</span>}
          </article>
        </div>

        {release && <p className="releaseMeta">Version <b>{release.tag_name}</b> • Published {new Date(release.published_at).toLocaleDateString()}</p>}
        <a className="githubRelease" href={release?.html_url || 'https://github.com/Narsing-s/chrome-pro/releases'} target="_blank" rel="noreferrer">View release notes on GitHub ↗</a>
      </section>

      <section className="downloadInfo">
        <div><b>⚡ Native performance</b><span>Electron packages the Chromium runtime locally.</span></div>
        <div><b>🛡 Privacy by default</b><span>Profiles and browser data stay on your device.</span></div>
        <div><b>🔄 Reproducible releases</b><span>Every tagged release is built by GitHub Actions.</span></div>
      </section>

      <footer className="downloadFooter"><span>Chrome Pro</span><span>Open source</span><span>Built for desktop</span></footer>
    </main>
  );
}
