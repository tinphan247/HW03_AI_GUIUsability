// Export HW03 Markdown reports to PDF via Edge headless print-to-pdf.
// Run: node scripts/export_pdf.js
// Produces Main_Report.pdf, AI_Audit_Report.pdf, Bug_Reports.pdf.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EDGE64 = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
const ROOT = path.join(__dirname, '..');

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(s) {
  let h = esc(s);
  h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    const abs = /^https?:/.test(src) ? src : 'file:///' + path.resolve(ROOT, src).replace(/\\/g, '/');
    return `<img alt="${alt}" src="${abs}">`;
  });
  h = h.replace(/\[([^\]]+)\]\(([^)#]+)(#[^)]*)?\)/g, '<a href="$2">$1</a>');
  h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
  return h;
}

function mdToHtml(md) {
  const lines = md.split('\n');
  let html = '', inCode = false, inTable = false, inList = false, para = [];
  const flushPara = () => { if (para.length) { html += '<p>' + para.map(inline).join('<br>') + '</p>\n'; para = []; } };
  const flushList = () => { if (inList) { html += '</ul>\n'; inList = false; } };
  const flushTable = () => { if (inTable) { html += '</tbody></table>\n'; inTable = false; } };
  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) { html += '</code></pre>\n'; inCode = false; }
      else { flushPara(); flushList(); flushTable(); html += '<pre><code>'; inCode = true; }
      continue;
    }
    if (inCode) { html += esc(line) + '\n'; continue; }
    if (/^\|.*\|$/.test(line.trim()) && line.includes('|')) {
      if (/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(line.trim())) continue;
      flushPara(); flushList();
      if (!inTable) { html += '<table><tbody>\n'; inTable = true; }
      const cells = line.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/);
      html += '<tr>' + cells.map((c) => '<td>' + inline(c.trim().replace(/\\\|/g, '|')) + '</td>').join('') + '</tr>\n';
      continue;
    }
    flushTable();
    const h = line.match(/^(#{1,4})\s+(.*)/);
    if (h) { flushPara(); flushList(); html += `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>\n`; continue; }
    if (/^---+$/.test(line.trim())) { flushPara(); flushList(); html += '<hr>\n'; continue; }
    if (/^>\s?/.test(line)) { flushPara(); flushList(); html += '<blockquote>' + inline(line.replace(/^>\s?/, '')) + '</blockquote>\n'; continue; }
    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      flushPara();
      if (!inList) { html += '<ul>\n'; inList = true; }
      html += '<li>' + inline(line.replace(/^([-*]|\d+\.)\s+/, '')) + '</li>\n';
      continue;
    }
    flushList();
    if (line.trim() === '') { flushPara(); continue; }
    para.push(line);
  }
  flushPara(); flushList(); flushTable();
  return html;
}

const CSS = `body{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;line-height:1.55;color:#24292e;margin:0}
@page{size:A4;margin:15mm 12mm}
h1{font-size:20px;color:#1f497d;border-bottom:2px solid #1f497d;padding-bottom:6px;page-break-after:avoid}
h2{font-size:15px;color:#2b579a;border-bottom:1px solid #eaecef;padding-bottom:4px;page-break-after:avoid}
h3{font-size:13px;color:#333;page-break-after:avoid}
table{border-collapse:collapse;width:100%;margin:10px 0;font-size:9.5px;page-break-inside:auto}
tr{page-break-inside:avoid}th,td{border:1px solid #d0d7de;padding:4px 5px;text-align:left;vertical-align:top}
blockquote{border-left:4px solid #1f497d;background:#f7fafc;padding:4px 10px;color:#4a5568;margin:10px 0}
code{font-family:Consolas,monospace;font-size:10px;background:#f3f4f6;padding:1px 3px;border-radius:3px}
pre{background:#f6f8fa;padding:8px;border:1px solid #e1e4e8;border-radius:5px;font-size:10px;overflow-x:auto;page-break-inside:avoid}
pre code{background:none;padding:0}img{max-width:100%;display:block;margin:12px auto;border:1px solid #d0d7de}
hr{border:0;height:1px;background:#e1e4e8;margin:16px 0}ul,ol{padding-left:18px}p{margin:6px 0}`;

const targets = ['Main_Report', 'AI_Audit_Report', 'Bug_Reports'];
for (const base of targets) {
  const mdPath = path.join(ROOT, base + '.md');
  if (!fs.existsSync(mdPath)) continue;
  const md = fs.readFileSync(mdPath, 'utf-8');
  const html = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>${base} - 23120372</title><style>${CSS}</style></head><body>${mdToHtml(md)}</body></html>`;
  const htmlPath = path.join(ROOT, base + '.html');
  const pdfPath = path.join(ROOT, base + '.pdf');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  const edge = fs.existsSync(EDGE) ? EDGE : EDGE64;
  execFileSync(edge, ['--headless', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, htmlPath], { timeout: 180000 });
  console.log(`${base}.pdf: ${fs.statSync(pdfPath).size} bytes`);
  fs.unlinkSync(htmlPath);
}
