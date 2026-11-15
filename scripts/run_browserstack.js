/**
 * run_browserstack.js — Chạy 4 màn hình chính của Task 3 trên BrowserStack
 * (thiết bị/OS thật), kèm BrowserStack Local tunnel để truy cập SUT localhost.
 *
 * Yêu cầu:
 *   $env:BROWSERSTACK_USERNAME = '...'
 *   $env:BROWSERSTACK_ACCESS_KEY = '...'
 *
 * Chạy: node scripts/run_browserstack.js [target-id ...]
 * Không truyền tham số → chạy tất cả target trong cross-platform/browserstack.json.
 *
 * Output:
 *   screenshots/cross-platform/bs-<target>/*.png   — ảnh có overlay
 *   evidence/xplat/browserstack-<target>.json      — session id, public URL, lỗi (nếu có)
 *   cross-platform/browserstack.log                — log
 *
 * Lưu ý: trial BrowserStack giới hạn phút → script chỉ chụp 4 màn hình,
 * không chạy toàn bộ 53 item.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const playwright = require('playwright');
const { addOverlay } = require('./lib/overlay');

const ROOT = path.join(__dirname, '..');
const USER = process.env.BROWSERSTACK_USERNAME;
const KEY = process.env.BROWSERSTACK_ACCESS_KEY;
const WEB = process.env.SUT_WEB || 'http://localhost:5173';
const API = process.env.SUT_API || 'http://localhost:3001/api';
const CREDS = { email: 'test@eshop.com', password: 'Test1234!' };
const LOCAL_ID = process.env.BS_LOCAL_ID || `hw03-${crypto.randomBytes(4).toString('hex')}`;
const LOG = [];

if (!USER || !KEY) {
  console.error('FATAL: set $env:BROWSERSTACK_USERNAME and $env:BROWSERSTACK_ACCESS_KEY');
  process.exit(1);
}

const targets = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'cross-platform', 'browserstack.json'), 'utf8')
).filter((t) => (process.argv.length > 2 ? process.argv.slice(2).includes(t.id) : true));

function log(s) {
  console.log(s);
  LOG.push(s);
}

async function startTunnel() {
  const Local = require('browserstack-local');
  const tunnel = new Local();
  await new Promise((resolve, reject) => {
    tunnel.start({ key: KEY, localIdentifier: LOCAL_ID, forceLocal: true }, (err) =>
      err ? reject(err) : resolve()
    );
  });
  log(`Tunnel started (localIdentifier=${LOCAL_ID})`);
  return tunnel;
}

async function runTarget(target, tunnelOn) {
  const caps = {
    browserName: target.browserName,
    os: target.os,
    os_version: target.os_version,
    name: `HW03 Task 3 — ${target.label}`,
    build: 'HW03-AI GUI & Usability',
    project: '23120372_HW03_AI_GUIUsability',
    'browserstack.username': USER,
    'browserstack.accessKey': KEY,
    'browserstack.local': tunnelOn,
    'browserstack.localIdentifier': LOCAL_ID,
    'browserstack.debug': true,
    'browserstack.console': 'errors',
    ...(target.device ? { device: target.device, realMobile: !!target.realMobile } : {}),
    ...(target.browser_version ? { browser_version: target.browser_version } : {}),
  };

  const endpoint = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`;
  const engine = target.browserName.replace('playwright-', '');
  const browser = await playwright[engine].connect(endpoint);
  const sessionId = target.sessionId;
  const outDir = path.join('screenshots', 'cross-platform', `bs-${target.id}`);
  const ctx = await browser.newContext(
    target.viewport ? { viewport: { width: target.viewport[0], height: target.viewport[1] }, isMobile: !!target.realMobile, hasTouch: !!target.realMobile } : {}
  );
  const page = await ctx.newPage();
  const report = { target: target.id, label: target.label, sessionId, url: '', shots: [], errors: [] };

  const snap = async (name) => {
    await addOverlay(page, target.label);
    fs.mkdirSync(path.join(ROOT, outDir), { recursive: true });
    const rel = path.join(outDir, `${name}.png`).replace(/\\/g, '/');
    await page.screenshot({ path: path.join(ROOT, rel), fullPage: true });
    report.shots.push(rel);
    log(`  shot ${rel}`);
  };

  try {
    await page.goto(WEB + '/', { waitUntil: 'networkidle', timeout: 120000 });
    await snap('01-home');

    await page.goto(WEB + '/login', { waitUntil: 'networkidle', timeout: 120000 });
    await snap('02-login');

    const loginRes = await fetch(API + '/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(CREDS),
    });
    const auth = await loginRes.json();
    await page.evaluate((t) => localStorage.setItem('token', t), auth.token);
    await page.goto(WEB + '/', { waitUntil: 'networkidle' });

    const rows = () => page.locator('table tbody tr').count();
    const openCart = async () => {
      await page.locator('nav a', { hasText: 'Giỏ hàng' }).first().click();
      await page.waitForTimeout(1200);
    };
    await page.getByRole('button', { name: 'Thêm vào giỏ' }).first().click();
    await page.waitForTimeout(900);
    await openCart();
    if ((await rows()) === 0) {
      await page.getByRole('button', { name: /Mua tiếp/i }).click();
      await page.waitForTimeout(900);
      await page.getByRole('button', { name: 'Thêm vào giỏ' }).first().click();
      await page.waitForTimeout(900);
      await openCart();
    }
    while ((await rows()) > 1) {
      await page.getByRole('button', { name: 'Xóa' }).last().click();
      await page.waitForTimeout(800);
    }
    await snap('03-cart');

    await page.getByRole('button', { name: /Tiến hành thanh toán/i }).click();
    await page.waitForTimeout(1200);
    const coupon = page.getByPlaceholder(/Nhập mã giảm giá/i);
    if (await coupon.count()) {
      await coupon.fill('SAVE10');
      await page.getByRole('button', { name: 'Áp dụng' }).click();
      await page.waitForTimeout(2000);
    }
    await snap('04-checkout-coupon');

    await page.evaluate(() => {
      const bs = window.browserstack;
      if (bs && bs.executor) {
        bs.executor.execute('browserstack_executor: {"action":"setSessionStatus","arguments":{"status":"passed","reason":"HW03 screenshots captured"}}');
      }
    }).catch(() => {});
  } catch (e) {
    report.errors.push(String(e && e.message ? e.message : e).slice(0, 400));
    log(`  ERROR ${report.errors[report.errors.length - 1]}`);
  } finally {
    await ctx.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  fs.mkdirSync(path.join(ROOT, 'evidence', 'xplat'), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, 'evidence', 'xplat', `browserstack-${target.id}.json`),
    JSON.stringify(report, null, 2),
    'utf8'
  );
  return report;
}

(async () => {
  let tunnel = null;
  const tunnelOn = process.env.BS_LOCAL !== '0';
  try {
    if (tunnelOn) tunnel = await startTunnel();
    const reports = [];
    for (const t of targets) {
      log(`\n=== ${t.id} — ${t.label}`);
      reports.push(await runTarget(t, tunnelOn));
    }
    const ok = reports.filter((r) => r.shots.length === 4 && !r.errors.length).length;
    log(`\nDone: ${ok}/${reports.length} target đủ 4 ảnh.`);
  } finally {
    if (tunnel) {
      await new Promise((resolve) => tunnel.stop(() => resolve()));
      log('Tunnel stopped.');
    }
    fs.writeFileSync(path.join(ROOT, 'cross-platform', 'browserstack.log'), LOG.join('\n') + '\n', 'utf8');
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
