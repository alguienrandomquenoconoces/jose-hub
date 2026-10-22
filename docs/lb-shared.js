/* Clasificación compartida · Escapa de JOSE
   Usa Firebase Realtime Database por REST (sin SDK).
   1) Pega aquí la URL de tu base de datos. 2) Incluye este archivo en el juego y en clasificacion.html. */
(function(){
  const DB_URL = 'https://algo-8ecd1-default-rtdb.europe-west1.firebasedatabase.app';
  const KEY = 'jh-lb2-escapa-de-jose';
  const FIELDS = ['score','combo','coins'];

  const hex = s => Array.from(new TextEncoder().encode(String(s).trim().toLowerCase())).map(b=>b.toString(16).padStart(2,'0')).join('');
  const idOf = e => hex(e.name) + '_' + e.diff + '_' + e.dev;
  const enabled = () => /^https:\/\//.test(DB_URL);
  const url = p => DB_URL.replace(/\/$/,'') + '/' + p + '.json';

  function local(){ try{ const a=JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(a)?a:[] }catch(e){ return [] } }

  function merge(list){
    const m = new Map();
    for(const e of list){
      if(!e || !e.name || !e.diff || !e.dev || e.dev==='Táctil') continue;
      const id = idOf(e), c = m.get(id);
      if(!c) m.set(id, {name:e.name, diff:e.diff, dev:e.dev, score:+e.score||0, combo:+e.combo||0, coins:+e.coins||0});
      else FIELDS.forEach(f => { c[f] = Math.max(c[f], +e[f]||0) });
    }
    return Array.from(m.values());
  }

  async function fetchRemote(){
    if(!enabled()) return [];
    const r = await fetch(url('scores'), {cache:'no-store'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const o = await r.json();
    return o ? Object.values(o) : [];
  }

  // Guarda la mejor marca de cada categoría (lee la existente y conserva el máximo).
  async function submit(entry){
    if(!enabled() || !entry || !entry.name) return false;
    const e = merge([entry])[0]; if(!e) return false;
    const id = idOf(e);
    try{
      const r = await fetch(url('scores/'+id), {cache:'no-store'});
      const cur = r.ok ? await r.json() : null;
      const best = merge(cur ? [cur, e] : [e])[0];
      const w = await fetch(url('scores/'+id), {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(best)});
      return w.ok;
    }catch(err){ return false }
  }

  // Todas las marcas: servidor + este dispositivo, ya fusionadas.
  async function all(){
    const l = local();
    let remote = [], ok = true;
    try{ remote = await fetchRemote() }catch(e){ ok = false }
    return {list: merge(remote.concat(l)), online: enabled() && ok, enabled: enabled()};
  }

  // Sube las marcas que ya había en este navegador (una vez por pestaña abierta).
  async function syncLocal(){
    if(!enabled()) return;
    for(const e of merge(local())) await submit(e);
  }

  window.JHLB = {submit, all, syncLocal, enabled};
})();
