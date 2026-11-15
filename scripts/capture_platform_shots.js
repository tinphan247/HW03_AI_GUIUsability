/**
 * capture_platform_shots.js — Chụp 4 màn hình chính trên một platform với overlay
 * email + browser/OS/device + URL localhost + timestamp.
 *
 * Env: BROWSER_KIND (chromium|firefox|webkit), PLATFORM_LABEL, PLATFORM_DEVICE (tuỳ chọn),
 *      OUT_DIR (mặc định screenshots/cross-platform/<platform-id>)
 */
const fs = require('fs');
const path = require('path');
const { chromium, firefox, webkit, devices } = require('playwright');
const { addOverlay } = require('./lib/overlay');

const WEB = process.env.SUT_WEB || 'http://localhost:5173';
const API = process.env.SUT_API || 'http://localhost:3001/api';
const ROOT = path.join(__dirname, '..');
const KIND = (process.env.BROWSER_KIND || 'chromium').toLowerCase();
const LABEL = process.env.PLATFORM_LABEL || KIND;
const DEVICE = process.env.PLATFORM_DEVICE || '';
const OUT_DIR = process.env.OUT_DIR || path.join('screenshots', 'cross-platform', KIND);
const CREDS = { email: 'test@eshop.com', password: 'Test1234!' };

async function snap(page, name) {
  await addOverlay(page, LABEL);
  fs.mkdirSync(path.join(ROOT, OUT_DIR), { recursive: true });
  const rel = path.join(OUT_DIR, `${name}.png`).replace(/\\/g, '/');
  await page.screenshot({ path: path.join(ROOT, rel), fullPage: true });
  console.log('  shot', rel);
}

(async () => {
  const engines = { chromium, firefox, webkit };
  const browser = await engines[KIND].launch();
  const ctxOpts = DEVICE && devices[DEVICE] ? { ...devices[DEVICE] } : { viewport: { width: 1280, height: 800 } };
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();

  // 1. Home
  await page.goto(WEB + '/', { waitUntil: 'networkidle' });
  await snap(page, '01-home');

  // 2. Login
  await page.goto(WEB + '/login', { waitUntil: 'networkidle' });
  await snap(page, '02-login');

  // 3. Cart có sản phẩm
  await page.goto(WEB + '/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Thêm vào giỏ' }).first().click();
  await page.waitForTimeout(500);
  await page.locator('nav a', { hasText: 'Giỏ hàng' }).first().click();
  await page.waitForTimeout(700);
  await snap(page, '03-cart');

  // 4. Checkout + coupon (đăng nhập qua API để không phụ thuộc UI)
  const loginRes = await fetch(API + '/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(CREDS),
  });
  const auth = await loginRes.json();
  await page.evaluate((t) => localStorage.setItem('token', t), auth.token);
  await page.goto(WEB + '/checkout', { waitUntil: 'networkidle' });
  const coupon = page.getByPlaceholder(/Nhập mã giảm giá/i);
  if (await coupon.count()) {
    await coupon.fill('SAVE10');
    await page.getByRole('button', { name: 'Áp dụng' }).click();
    await page.waitForTimeout(1200);
  }
  await snap(page, '04-checkout-coupon');

  await ctx.close();
  await browser.close();
  console.log(`Done ${LABEL}`);
})().catch((e) => { console.error(e); process.exit(1); });
