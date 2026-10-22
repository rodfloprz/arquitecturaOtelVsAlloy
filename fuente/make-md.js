// Convierte fuente/src/*.md en páginas Markdown navegables en informe/ (se leen directamente en GitHub)
// y regenera el índice del README. Uso: npm run build:md
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), src = path.join(__dirname, 'src'), out = path.join(root, 'informe');
fs.mkdirSync(out, { recursive: true });
fs.readdirSync(out).filter(f => f.endsWith('.md')).forEach(f => fs.unlinkSync(path.join(out, f)));
const em = { V:'✅', I:'🟡', N:'⚠️', PV:'🧪 preview', EXP:'🧪 experimental', GA:'GA', BETA:'beta', ALPHA:'alpha',
  EQ:'Equivalente', EQC:'Equivalente con componentes adicionales', PAR:'Parcial', NOEQ:'No equivalente',
  ALTA:'Confianza alta', MEDIA:'Confianza media', BAJA:'Confianza baja' };
const verbose = { V:'✅ Verificado', I:'🟡 Inferido', N:'⚠️ No confirmado' };
const files = fs.readdirSync(src).filter(f => f.endsWith('.md')).sort();
const pages = files.map((f, i) => {
  const raw = fs.readFileSync(path.join(src, f), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/); const meta = {};
  m[1].split('\n').forEach(l => { const k = l.indexOf(':'); meta[l.slice(0, k).trim()] = l.slice(k + 1).trim(); });
  return { meta, body: raw.slice(m[0].length), file: String(i).padStart(2, '0') + '-' + meta.id + '.md' };
});
function conv(p) {
  let b = p.body.replace(/<!--wide-->\n?/g, '');
  b = b.replace(/<div class="kpis">([\s\S]*?)<\/div>\s*(?=\n###|\n\n)/, (all) => {
    const rows = [...all.matchAll(/<b>([\s\S]*?)<\/b><span>([\s\S]*?)<\/span>/g)].map(r => '| **' + r[1] + '** | ' + r[2] + ' |');
    return '| Indicador | Detalle |\n| --- | --- |\n' + rows.join('\n') + '\n';
  });
  b = b.replace(/<div id="scoring-app"><\/div>/, '> **Calculadora interactiva de pesos:** disponible en la versión HTML (`docs/index.html`, con GitHub Pages).');
  b = b.replace(/<p class="lead">([\s\S]*?)<\/p>/g, (a, t) => '> ' + t.replace(/\n/g, ' ').trim());
  b = b.replace(/<div class="note"><p>([\s\S]*?)<\/p><\/div>/g, (a, t) => '> **Nota.** ' + t.replace(/\n/g, ' ').trim());
  b = b.replace(/<p class="src">([\s\S]*?)<\/p>/g, (a, t) => '*' + t.trim() + '*');
  b = b.replace(/<a href="([^"]+)">([\s\S]*?)<\/a>/g, '[$2]($1)').replace(/<strong>/g, '**').replace(/<\/strong>/g, '**');
  const map = p.meta.id === 'portada' ? Object.assign({}, em, verbose) : em;
  let usedChip = false;
  b = b.replace(/\{\{([A-Z]+)\}\}/g, (a, k) => { if (['V', 'I', 'N'].includes(k)) usedChip = true; return map[k] || a; });
  const left = b.match(/<(div|p|span|b)[ >]/g);
  if (left) console.warn('HTML residual en', p.file, left.slice(0, 3));
  return { b, usedChip };
}
pages.forEach((p, i) => {
  const { b, usedChip } = conv(p);
  const prev = pages[i - 1], next = pages[i + 1];
  const nav = '[← ' + (prev ? 'Anterior](' + prev.file + ')' : 'Índice](../README.md)') + ' · [Índice](../README.md) · ' + (next ? '[Siguiente →](' + next.file + ')' : '[Volver al índice →](../README.md)');
  const legend = usedChip ? '\n<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>\n' : '';
  const txt = nav + '\n\n# ' + p.meta.title + '\n\n*' + p.meta.section + ' · página ' + (i + 1) + ' de ' + pages.length + '*\n' + legend + '\n' + b.trim() + '\n\n---\n' + nav + '\n';
  fs.writeFileSync(path.join(out, p.file), txt);
});
let idx = '', g = '';
pages.forEach(p => { if (p.meta.group !== g) { g = p.meta.group; idx += '\n**' + g + '**\n\n'; } idx += '- [' + p.meta.nav + '](informe/' + p.file + ')\n'; });
const rp = path.join(root, 'README.md');
let r = fs.readFileSync(rp, 'utf8');
r = r.replace(/<!-- INDICE:INICIO -->[\s\S]*<!-- INDICE:FIN -->/, '<!-- INDICE:INICIO -->\n' + idx + '\n<!-- INDICE:FIN -->');
fs.writeFileSync(rp, r);
console.log('Páginas Markdown:', pages.length);
