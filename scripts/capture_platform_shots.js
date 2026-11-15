/**
 * capture_platform_shots.js — Chụp 4 màn hình chính trên một platform với overlay
 * email + browser/OS/device + URL localhost + timestamp.
 *
 * Env: BROWSER_KIND (chromium|firefox|webkit), PLATFORM_LABEL, PLATFORM_DEVICE (tuỳ chọn),
 *      OUT_DIR (mặc định screenshots/cross-platform/<platform-id>)
 *
 * Lưu ý: điều hướng trong SPA bằng click (không dùng page.goto) sau khi thêm giỏ,
 * nếu không React state (cart) sẽ bị reset và screenshot checkout sẽ trống.
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

async function cartCount(page) {
  return page.locator('table tbody tr').count();
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

  // 3. Đăng nhập bằng token (không phụ thuộc UI) rồi reload để app đọc localStorage
  const loginRes = await fetch(API + '/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(CREDS),
  });
  const auth = await loginRes.json();
  await page.evaluate((t) => localStorage.setItem('token', t), auth.token);
  await page.goto(WEB + '/', { waitUntil: 'networkidle' });

  // 4. Thêm 1 sản phẩm rồi mở giỏ qua navbar (SPA, giữ cart state)
  //    Product Detail/Home có bug "click đầu tiên không thêm" → kiểm tra lại trên trang giỏ.
  const openCart = async () => {
    await page.locator('nav a', { hasText: 'Giỏ hàng' }).first().click();
    await page.waitForTimeout(900);
  };
  const rows = () => page.locator('table tbody tr').count();

  await page.getByRole('button', { name: 'Thêm vào giỏ' }).first().click();
  await page.waitForTimeout(600);
  await openCart();
  if ((await rows()) === 0) {
    await page.getByRole('button', { name: /Mua tiếp/i }).click();
    await page.waitForTimeout(700);
    await page.getByRole('button', { name: 'Thêm vào giỏ' }).first().click();
    await page.waitForTimeout(700);
    await openCart();
  }
  // Chuẩn hoá còn đúng 1 dòng để con số coupon so sánh được giữa các platform
  while ((await rows()) > 1) {
    await page.getByRole('button', { name: 'Xóa' }).last().click();
    await page.waitForTimeout(500);
  }
  console.log('  cart rows:', await rows());
  await snap(page, '03-cart');

  // 5. Thanh toán: click trong SPA để giữ cart state
  await page.getByRole('button', { name: /Tiến hành thanh toán/i }).click();
  await page.waitForTimeout(900);

  // 6. Áp coupon SAVE10 và ghi lại feedback
  const coupon = page.getByPlaceholder(/Nhập mã giảm giá/i);
  if (await coupon.count()) {
    await coupon.fill('SAVE10');
    await page.getByRole('button', { name: 'Áp dụng' }).click();
    await page.waitForTimeout(1500);
  }
  console.log('  checkout url:', page.url());
  console.log('  coupon feedback:', (await page.locator('text=/Tiết kiệm|không tồn tại|hết hạn|tối thiểu/i').allInnerTexts()).join(' | '));
  await snap(page, '04-checkout-coupon');

  await ctx.close();
  await browser.close();
  console.log(`Done ${LABEL}`);
})().catch((e) => { console.error(e); process.exit(1); });
