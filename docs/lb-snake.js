/* Clasificación compartida · Snake de JOSE
   Firebase Realtime Database por REST, en la ruta aparte "scores_snake". */
(function(){
  const DB_URL = 'https://algo-8ecd1-default-rtdb.europe-west1.firebasedatabase.app';
  const PATH = 'scores_snake';
  const KEY = 'jh-snake-lb';
  const FIELDS = ['score','len','eat'];
  const idOf = e => hex(e.name) + '_' + e.mode + '_' + e.dev;

  const hex = s => Array.from(new TextEncoder().encode(String(s).trim().toLowerCase())).map(b=>b.toString(16).padStart(2,'0')).join('');
  const enabled = () => /^https:\/\//.test(DB_URL);
  const url = p => DB_URL.replace(/\/$/,'') + '/' + p + '.json';

  function local(){ try{ const a=JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(a)?a:[] }catch(e){ return [] } }

  function merge(list){
    const m = new Map();
    for(const e of list){
      if(!e || !e.name || !e.mode || !e.dev || e.mode==='custom') continue;
      const id = idOf(e), c = m.get(id);
      if(!c) m.set(id, {name:String(e.name).slice(0,14), mode:e.mode, dev:e.dev, score:+e.score||0, len:+e.len||0, eat:+e.eat||0});
      else FIELDS.forEach(f => { c[f] = Math.max(c[f], +e[f]||0) });
    }
    return Array.from(m.values());
  }

  async function fetchRemote(){
    if(!enabled()) return [];
    const r = await fetch(url(PATH), {cache:'no-store'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const o = await r.json();
    return o ? Object.values(o) : [];
  }

  async function submit(entry){
    if(!enabled() || !entry || !entry.name) return false;
    const e = merge([entry])[0]; if(!e) return false;
    const id = idOf(e);
    try{
      const r = await fetch(url(PATH+'/'+id), {cache:'no-store'});
      const cur = r.ok ? await r.json() : null;
      const best = merge(cur ? [cur, e] : [e])[0];
      const w = await fetch(url(PATH+'/'+id), {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(best)});
      return w.ok;
    }catch(err){ return false }
  }

  async function all(){
    let remote = [], ok = true;
    try{ remote = await fetchRemote() }catch(e){ ok = false }
    return {list: merge(remote.concat(local())), online: enabled() && ok, enabled: enabled()};
  }

  async function syncLocal(){
    if(!enabled()) return;
    for(const e of merge(local())) await submit(e);
  }

  window.JHLBS = {submit, all, syncLocal, merge, enabled};
})();
