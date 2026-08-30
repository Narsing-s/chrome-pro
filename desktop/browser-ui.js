(() => {
  const $ = id => document.getElementById(id);
  const address = $('address'), tabsEl = $('tabs'), menu = $('menu');
  let state = { active: 0, count: 0, tabs: [] };
  async function refresh(){ state = await window.chromePro.tabs(); renderTabs(); }
  function renderTabs(){ tabsEl.innerHTML=''; (state.tabs||[]).forEach((t,i)=>{ const el=document.createElement('div'); el.className='tab'+(i===state.active?' active':''); el.innerHTML=`<span>${escapeHtml(t.title||'New Tab')}</span><button aria-label="Close tab">×</button>`; el.onclick=()=>window.chromePro.switchTab(i).then(refresh); el.querySelector('button').onclick=e=>{e.stopPropagation();window.chromePro.closeTab(i).then(refresh)}; tabsEl.appendChild(el); }); const add=document.createElement('button');add.className='add';add.textContent='+';add.onclick=()=>window.chromePro.newTab().then(refresh);tabsEl.appendChild(add); }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function go(){ window.chromePro.open(address.value).then(refresh); }
  function current(){ return state.tabs?.[state.active]?.url || ''; }
  $('go').onclick=go; address.onkeydown=e=>{if(e.key==='Enter')go()};
  $('back').onclick=()=>window.history.back(); $('forward').onclick=()=>window.history.forward(); $('reload').onclick=()=>location.reload();
  $('bookmark').onclick=async()=>{const u=current();if(u)await window.chromePro.addBookmark({url:u,title:state.tabs[state.active]?.title});};
  $('incognito').onclick=()=>window.chromePro.incognito(); $('profile').onclick=()=>window.chromePro.newProfile('profile-'+Date.now());
  $('history').onclick=async()=>{const h=await window.chromePro.history(); alert(h.slice(0,20).map(x=>x.url).join('\n')||'No history yet.')};
  $('bookmarks').onclick=async()=>{const b=await window.chromePro.bookmarks(); alert(b.slice(0,20).map(x=>x.title+' — '+x.url).join('\n')||'No bookmarks yet.')};
  $('downloads').onclick=async()=>alert('Downloads are stored in: '+await window.chromePro.downloads());
  $('clear').onclick=async()=>{await window.chromePro.clearSiteData();alert('Site data and cache cleared.')};
  $('menuBtn').onclick=()=>menu.classList.toggle('show'); document.addEventListener('click',e=>{if(!menu.contains(e.target)&&e.target.id!=='menuBtn')menu.classList.remove('show')});
  window.addEventListener('keydown',e=>{const mod=e.ctrlKey||e.metaKey;if(mod&&e.key.toLowerCase()==='l'){e.preventDefault();address.focus();address.select()}if(mod&&e.key.toLowerCase()==='t'){e.preventDefault();window.chromePro.newTab().then(refresh)}if(mod&&e.shiftKey&&e.key.toLowerCase()==='n'){e.preventDefault();window.chromePro.incognito()} });
  refresh();
})();