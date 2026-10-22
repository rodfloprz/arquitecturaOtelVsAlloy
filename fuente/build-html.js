// Compila fuente/src/*.md en docs/index.html (HTML paginado de un solo archivo, para GitHub Pages).
// Uso: npm install && npm run build:html
const fs = require('fs'), path = require('path');
const { marked } = require('marked');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let curBase = '', mi = 0;
marked.use({ gfm: true, renderer: {
  code({ text, lang }) {
    if (lang === 'mermaid') {
      // Usa el SVG pre-renderizado en informe/diagrams si existe; si no, deja el bloque Mermaid.
      const p = path.join(__dirname, 'diagrams', curBase + '-' + (mi++) + '.svg');
      if (fs.existsSync(p)) return '<figure class="diagram" role="img" aria-label="Diagrama de arquitectura">' + fs.readFileSync(p, 'utf8').replace(/^<\?xml[^>]*>\s*/, '') + '</figure>\n';
      return '<pre class="mermaid">' + esc(text) + '</pre>\n';
    }
    return '<pre><code class="language-' + (lang || 'text') + '">' + esc(text) + '</code></pre>\n';
  },
  table(tok) {
    const head = this.tablerow({ text: tok.header.map(c => this.tablecell(c)).join('') });
    const body = tok.rows.map(r => this.tablerow({ text: r.map(c => this.tablecell(c)).join('') })).join('');
    return '<div class="tw"><table><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>\n';
  } } });
const chips = { V:['ok','Verificado'], I:['inf','Inferido'], N:['nc','No confirmado'], PV:['pv','Preview'], EXP:['pv','Experimental'],
  EQ:['ok','Equivalente'], EQC:['inf','Equivalente con componentes adicionales'], PAR:['inf','Parcial'], NOEQ:['nc','No equivalente'],
  ALTA:['ok','Confianza alta'], MEDIA:['inf','Confianza media'], BAJA:['nc','Confianza baja'], GA:['ok','GA'], BETA:['inf','Beta'], ALPHA:['nc','Alpha'] };
const chip = h => h.replace(/\{\{([A-Z]+)\}\}/g, (m, k) => chips[k] ? '<span class="c ' + chips[k][0] + '">' + chips[k][1] + '</span>' : m);
const dir = path.join(__dirname, 'src');
let out = '';
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort()) {
  curBase = f.replace('.md', ''); mi = 0;
  const raw = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/); const meta = {};
  m[1].split('\n').forEach(l => { const i = l.indexOf(':'); meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
  const body = raw.slice(m[0].length);
  let html = marked.parse(body);
  if (/<!--wide-->/.test(body)) html = html.replace(/<div class="tw">/g, '<div class="tw wide">');
  out += '<section class="sheet" id="' + meta.id + '" data-group="' + meta.group + '" data-nav="' + meta.nav + '">\n<p class="page-meta">' + meta.section + '</p>\n<h1>' + meta.title + '</h1>\n' + chip(html) + '</section>\n';
}
const tpl = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const extra = fs.readFileSync(path.join(__dirname, 'extra.html'), 'utf8');
const dest = path.join(__dirname, '..', 'docs', 'index.html');
fs.writeFileSync(dest, tpl.replace('{{PAGES}}', () => out).replace('{{EXTRA}}', () => extra));
console.log('Generado', dest);
