/**
 * run_cross_platform.js — Chạy lại toàn bộ checklist tự động trên từng platform
 * trong cross-platform/platforms.json + chụp 4 màn hình chính có overlay.
 *
 * Chạy: node scripts/run_cross_platform.js [platformId ...]
 * Không truyền tham số → chạy tất cả.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PLATFORMS = JSON.parse(fs.readFileSync(path.join(ROOT, 'cross-platform', 'platforms.json'), 'utf8'));
const only = process.argv.slice(2);
const list = only.length ? PLATFORMS.filter((p) => only.includes(p.id)) : PLATFORMS;

fs.mkdirSync(path.join(ROOT, 'evidence', 'xplat'), { recursive: true });
const logFile = path.join(ROOT, 'cross-platform', 'run.log');
let log = '';

for (const p of list) {
  console.log(`\n=== ${p.id} — ${p.label}`);
  const outJson = `evidence/xplat/results-${p.id}.json`;
  const shotDir = `screenshots/cross-platform/${p.id}`;
  const env = {
    ...process.env,
    BROWSER_KIND: p.kind,
    PLATFORM_LABEL: p.label,
    XPLAT: '1',
    OUT_JSON: outJson,
    SHOT_DIR: shotDir,
    ...(p.device ? { PLATFORM_DEVICE: p.device } : {}),
    ...(p.viewport ? { VIEWPORT_WIDTH: String(p.viewport[0]), VIEWPORT_HEIGHT: String(p.viewport[1]) } : {}),
  };

  const r1 = spawnSync(process.execPath, ['scripts/checklist_runner.js'], { cwd: ROOT, env, encoding: 'utf8' });
  log += `\n=== ${p.id} checklist\n${r1.stdout || ''}\n${r1.stderr || ''}`;
  if (r1.status !== 0) console.error(`checklist failed for ${p.id}`);

  // reset DB trước khi chụp để tránh phụ thuộc dữ liệu các lần chạy trước
  const env2 = { ...env, OUT_DIR: `screenshots/cross-platform/${p.id}` };
  const r2 = spawnSync(process.execPath, ['scripts/capture_platform_shots.js'], { cwd: ROOT, env: env2, encoding: 'utf8' });
  log += `\n=== ${p.id} shots\n${r2.stdout || ''}\n${r2.stderr || ''}`;
  if (r2.status !== 0) console.error(`shots failed for ${p.id}`);

  console.log(r1.stdout?.split('\n').slice(-3).join('\n'));
  console.log(r2.stdout?.split('\n').slice(-5).join('\n'));
}

fs.writeFileSync(logFile, log, 'utf8');
console.log('\nLog:', logFile);
