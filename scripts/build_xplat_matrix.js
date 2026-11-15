/**
 * build_xplat_matrix.js — Tổng hợp kết quả checklist trên các platform thành ma trận.
 *
 * Đọc: cross-platform/platforms.json + evidence/xplat/results-<id>.json
 * Ghi: cross-platform/matrix.md, cross-platform/matrix.csv
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const platforms = JSON.parse(fs.readFileSync(path.join(ROOT, 'cross-platform', 'platforms.json'), 'utf8'));
const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'checklist', 'checklist_items.json'), 'utf8')).items;

const loaded = [];
for (const p of platforms) {
  const f = path.join(ROOT, 'evidence', 'xplat', `results-${p.id}.json`);
  if (!fs.existsSync(f)) continue;
  loaded.push({ ...p, results: JSON.parse(fs.readFileSync(f, 'utf8')).results });
}
if (!loaded.length) {
  console.error('No results found. Run scripts/run_cross_platform.js first.');
  process.exit(1);
}

const automated = items.filter((i) => i.method === 'automated');
const symbol = (s) => (s === 'Passed' ? '✅' : s === 'Failed' ? '❌' : '—');
const norm = (s) => (s === 'Passed' || s === 'Failed' ? s : 'Not executed');

// ---------- matrix.csv ----------
const csv = [['item', 'aspect', 'screen', ...loaded.map((p) => p.id)].join(',')];
for (const it of automated) {
  const row = [it.id, it.ia, `"${it.screen}"`, ...loaded.map((p) => norm((p.results[it.id] || {}).status))];
  csv.push(row.join(','));
}
fs.writeFileSync(path.join(ROOT, 'cross-platform', 'matrix.csv'), csv.join('\n'), 'utf8');

// ---------- matrix.md ----------
const lines = [
  '# Cross-platform matrix — Task 1 checklist (automated subset)',
  '',
  `Sinh tự động từ \`evidence/xplat/results-*.json\`. Số platform: **${loaded.length}**.`,
  `Số item tự động: **${automated.length}** (12 item thủ công được kiểm tra riêng trên desktop, xem \`checklist/execution_log.md\`).`,
  '',
  '## Platform',
  '',
  '| # | ID | Mô tả | Viewport / device |',
  '| :-: | :--- | :--- | :--- |',
  ...loaded.map((p, i) => `| ${i + 1} | \`${p.id}\` | ${p.label} | ${p.device || (p.viewport ? p.viewport.join('×') : '—')} |`),
  '',
  '## Tổng hợp',
  '',
  '| Platform | Passed | Failed | Pass rate | Ghi chú |',
  '| :--- | ---: | ---: | ---: | :--- |',
];

for (const p of loaded) {
  let pass = 0, fail = 0, ne = 0;
  for (const it of automated) {
    const s = norm((p.results[it.id] || {}).status);
    if (s === 'Passed') pass++;
    else if (s === 'Failed') fail++;
    else ne++;
  }
  lines.push(`| ${p.label} | ${pass} | ${fail} | ${(pass / (pass + fail) * 100).toFixed(1)}% | ${ne ? ne + ' item không chạy' : ''} |`);
}

const baseline = loaded[0];
const diffs = [];
for (const it of automated) {
  const base = norm((baseline.results[it.id] || {}).status);
  for (const p of loaded.slice(1)) {
    const s = norm((p.results[it.id] || {}).status);
    if (s !== base && s !== 'Not executed' && base !== 'Not executed') {
      diffs.push({ id: it.id, item: it.item, base, other: p.id, otherStatus: s, note: (p.results[it.id] || {}).note || '' });
    }
  }
}

lines.push(
  '',
  '## Khác biệt so với platform baseline (`' + baseline.id + '`)',
  ''
);
if (!diffs.length) {
  lines.push('Không có khác biệt Pass/Fail giữa các platform đã chạy — hành vi checklist nhất quán.');
} else {
  lines.push('| Item | Nội dung | Baseline | Platform | Kết quả | Note |');
  lines.push('| :--- | :--- | :--- | :--- | :--- | :--- |');
  for (const d of diffs) {
    lines.push(`| ${d.id} | ${d.item.replace(/\|/g, '\\|')} | ${d.base} | ${d.other} | ${d.otherStatus} | ${d.note.replace(/\|/g, '\\|').slice(0, 160)} |`);
  }
}

lines.push(
  '',
  '## Ma trận đầy đủ',
  '',
  '| Item | Aspect | ' + loaded.map((p) => p.id).join(' | ') + ' |',
  '| :--- | :--- | ' + loaded.map(() => ':---:').join(' | ') + ' |'
);
for (const it of automated) {
  lines.push(
    `| ${it.id} | ${it.ia} | ` +
      loaded.map((p) => symbol(norm((p.results[it.id] || {}).status))).join(' | ') +
      ' |'
  );
}

fs.writeFileSync(path.join(ROOT, 'cross-platform', 'matrix.md'), lines.join('\n') + '\n', 'utf8');
console.log(`Wrote cross-platform/matrix.md and matrix.csv (${loaded.length} platforms, ${automated.length} items, ${diffs.length} diffs)`);
if (diffs.length) {
  for (const d of diffs.slice(0, 20)) console.log(`DIFF ${d.id} ${baseline.id}=${d.base} ${d.other}=${d.otherStatus}`);
}
