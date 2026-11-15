/**
 * capture_evidence.js — Chụp ảnh evidence cho các item kiểm tra thủ công
 * (visual, color, mobile, trạng thái đơn hàng, submit progress…).
 *
 * Output: screenshots/checklist/manual-<item>.png
 * Kèm file evidence/manual_observations.json (dữ liệu đo được khi chụp).
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const WEB = process.env.SUT_WEB || 'http://localhost:5173';
const ADMIN = process.env.SUT_ADMIN || 'http://localhost:5174';
const API = process.env.SUT_API || 'http://localhost:3001/api';
const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'screenshots', 'checklist');
const OUT = path.join(ROOT, 'evidence', 'manual_observations.json');

const CREDS = { email: 'test@eshop.com', password: 'Test1234!' };
const ADMIN_CREDS = { email: 'admin@eshop.com', password: 'Admin123!' };
const obs = {};

async function snap(page, name) {
  fs.mkdirSync(DIR, { recursive: true });
  const rel = `screenshots/checklist/manual-${name}.png`;
  await page.screenshot({ path: path.join(ROOT, rel), fullPage: true });
  return rel;
}

async function login(page) {
  await page.goto(WEB + '/login', { waitUntil: 'networkidle' });
  await page.locator('input').nth(0).fill(CREDS.email);
  await page.locator('input').nth(1).fill(CREDS.password);
  await page.getByRole('button', { name: /Sign In/i }).click();
  await page.waitForTimeout(1300);
}

async function apiCall(pathname, opts = {}) {
  const r = await fetch(API + pathname, opts);
  return r.json();
}

(async () => {
  const browser = await chromium.launch();

  /* IA-01-04 — ngôn ngữ nhãn chính (Login/Admin) */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(WEB + '/login', { waitUntil: 'networkidle' });
    obs['IA-01-04'] = {
      webLabels: await page.evaluate(() => Array.from(document.querySelectorAll('h1,h2,label,button')).map((e) => (e.innerText || '').trim()).filter(Boolean)),
    };
    await snap(page, 'IA-01-04-login-language');

    await page.goto(ADMIN, { waitUntil: 'networkidle' });
    obs['IA-01-04'].adminLabels = await page.evaluate(() => Array.from(document.querySelectorAll('h1,h2,th,button')).map((e) => (e.innerText || '').trim()).filter(Boolean).slice(0, 15));
    await snap(page, 'IA-01-04-admin-language');
    await ctx.close();
  }

  /* IA-01-06 / IA-01-07 — màu nút primary/danger */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const colors = [];
    await page.goto(WEB + '/register', { waitUntil: 'networkidle' });
    colors.push({ screen: '/register', button: 'Đăng Ký', bg: await page.getByRole('button', { name: 'Đăng Ký' }).evaluate((e) => getComputedStyle(e).backgroundColor) });
    await snap(page, 'IA-01-06-register-primary');

    await page.goto(WEB + '/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Thêm vào giỏ' }).first().click();
    await page.locator('nav a', { hasText: 'Giỏ hàng' }).click();
    await page.waitForTimeout(600);
    colors.push({ screen: '/cart', button: 'Tiến hành thanh toán', bg: await page.getByRole('button', { name: /Tiến hành thanh toán/i }).evaluate((e) => getComputedStyle(e).backgroundColor) });
    colors.push({ screen: '/cart', button: 'Xóa', bg: await page.getByRole('button', { name: 'Xóa' }).first().evaluate((e) => getComputedStyle(e).backgroundColor) });
    await snap(page, 'IA-01-07-cart-buttons');
    obs['IA-01-06'] = colors;
    obs['IA-01-07'] = colors;
    await ctx.close();
  }

  /* IA-02-06 — thông báo lỗi cụ thể */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(WEB + '/login', { waitUntil: 'networkidle' });
    await page.locator('input').nth(0).fill('nouser999@eshop.com');
    await page.locator('input').nth(1).fill('Wrong123!');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await page.waitForTimeout(1300);
    obs['IA-02-06'] = { message: (await page.locator('div.bg-red-100').innerText().catch(() => '')).trim() };
    await snap(page, 'IA-02-06-login-error');
    await ctx.close();
  }

  /* IA-02-17 — hint mật khẩu mạnh */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(WEB + '/register', { waitUntil: 'networkidle' });
    obs['IA-02-17'] = { hint: (await page.locator('p.text-xs').innerText().catch(() => '')).trim() };
    await snap(page, 'IA-02-17-register-hint');
    await ctx.close();
  }

  /* IA-03-12 — admin tab active */
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(ADMIN, { waitUntil: 'networkidle' });
    await page.getByPlaceholder('Email').fill(ADMIN_CREDS.email);
    await page.getByPlaceholder('Password').fill(ADMIN_CREDS.password);
    await page.getByRole('button', { name: /Login/i }).click();
    await page.waitForTimeout(1500);
    await page.getByText('Sản phẩm', { exact: true }).click();
    await page.waitForTimeout(900);
    obs['IA-03-12'] = {
      tabs: await page.evaluate(() =>
        Array.from(document.querySelectorAll('li')).map((li) => ({ text: li.innerText.trim(), class: li.className }))
      ),
    };
    await snap(page, 'IA-03-12-admin-tab');
    await ctx.close();
  }

  /* IA-03-13 — mobile 375px */
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(WEB + '/', { waitUntil: 'networkidle' });
    obs['IA-03-13'] = {
      navOverflow: await page.evaluate(() => {
        const nav = document.querySelector('nav');
        return nav ? { scrollWidth: nav.scrollWidth, clientWidth: nav.clientWidth } : null;
      }),
    };
    await snap(page, 'IA-03-13-mobile-home');
    await ctx.close();
  }

  /* IA-03-14 — nhãn điều hướng (icon-only?) */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(WEB + '/cart', { waitUntil: 'networkidle' });
    obs['IA-03-14'] = {
      links: await page.evaluate(() =>
        Array.from(document.querySelectorAll('a,button')).map((e) => ({ text: (e.innerText || '').trim(), aria: e.getAttribute('aria-label') }))
          .filter((x) => !x.text)
      ),
    };
    await snap(page, 'IA-03-14-cart-links');
    await ctx.close();
  }

  /* IA-03-15 — browser back */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(WEB + '/', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'Xem chi tiết' }).first().click();
    await page.waitForTimeout(600);
    await page.goBack();
    await page.waitForTimeout(600);
    obs['IA-03-15'] = { urlAfterBack: page.url() };
    await snap(page, 'IA-03-15-after-back');
    await ctx.close();
  }

  /* IA-04-10 — trạng thái đơn hàng: tạo đơn rồi đổi trạng thái qua admin API */
  {
    const auth = await apiCall('/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(CREDS),
    });
    const adminAuth = await apiCall('/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ADMIN_CREDS),
    });
    const order = await apiCall('/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify({ items: [{ id: 1, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 1 }], total_amount: 30000000 }),
    });
    const orderId = order.orderId || order.id || (order.order && order.order.id);
    if (orderId) {
      for (const st of ['confirmed', 'shipping', 'delivered']) {
        await apiCall(`/admin/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminAuth.token}` },
          body: JSON.stringify({ status: st }),
        });
      }
    }
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(WEB + '/', { waitUntil: 'domcontentloaded' });
    await page.evaluate((t) => localStorage.setItem('token', t), auth.token);
    await page.goto(WEB + '/profile', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    obs['IA-04-10'] = {
      rows: await page.evaluate(() =>
        Array.from(document.querySelectorAll('tbody tr')).map((tr) => Array.from(tr.children).map((td) => td.innerText.trim()))
      ),
    };
    await snap(page, 'IA-04-10-order-status');
    await ctx.close();
  }

  /* IA-04-14 — trạng thái submit */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(WEB + '/login', { waitUntil: 'networkidle' });
    await page.locator('input').nth(0).fill(CREDS.email);
    await page.locator('input').nth(1).fill(CREDS.password);
    await page.getByRole('button', { name: /Sign In/i }).click();
    const txt = await page.getByRole('button', { name: /Sign In|Đang/i }).innerText().catch(() => '');
    obs['IA-04-14'] = { buttonTextImmediatelyAfterClick: txt };
    await snap(page, 'IA-04-14-submit-state');
    await ctx.close();
  }

  /* IA-04-16 — dismiss của thông báo */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(WEB + '/checkout', { waitUntil: 'networkidle' });
    obs['IA-04-16'] = {
      hasToast: await page.evaluate(() => !!document.querySelector('[role="status"],[role="alert"],[class*="toast"]')),
      hasCloseButton: await page.evaluate(() => !!document.querySelector('[aria-label*="close" i], [aria-label*="đóng" i]')),
    };
    await snap(page, 'IA-04-16-no-toast');
    await ctx.close();
  }

  await browser.close();
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ capturedAt: new Date().toISOString(), observations: obs }, null, 2), 'utf8');
  console.log('Wrote', OUT);
})().catch((e) => { console.error(e); process.exit(1); });
