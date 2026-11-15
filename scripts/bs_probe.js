/**
 * bs_probe.js — thử nhanh các biến thể capability cho BrowserStack Playwright
 * để tìm cấu hình đúng cho real mobile device (không chụp ảnh, chỉ connect).
 *
 * Chạy: node scripts/bs_probe.js
 */
const playwright = require('playwright');

const USER = process.env.BROWSERSTACK_USERNAME;
const KEY = process.env.BROWSERSTACK_ACCESS_KEY;
if (!USER || !KEY) {
  console.error('FATAL: set BROWSERSTACK_USERNAME / BROWSERSTACK_ACCESS_KEY');
  process.exit(1);
}

const base = {
  browserName: 'playwright-chromium',
  name: 'HW03 probe',
  project: '23120372_HW03_AI_GUIUsability',
  'browserstack.username': USER,
  'browserstack.accessKey': KEY,
};

const variants = [
  ['device+realMobile', { ...base, os: 'android', os_version: '13.0', device: 'Samsung Galaxy S23', realMobile: true }],
  ['deviceName', { ...base, os: 'android', os_version: '13.0', deviceName: 'Samsung Galaxy S23', realMobile: true }],
  ['emulator', { ...base, os: 'android', os_version: '13.0' }],
];

(async () => {
  for (const [name, caps] of variants) {
    const endpoint = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`;
    try {
      const browser = await playwright.chromium.connect(endpoint, { timeout: 60000 });
      const page = await browser.newPage();
      await page.goto('https://example.com', { timeout: 60000 }).catch(() => {});
      console.log(`[OK]   ${name} — title=${await page.title().catch(() => '?')}`);
      await browser.close().catch(() => {});
    } catch (e) {
      const msg = String(e && e.message ? e.message : e).replace(/\s+/g, ' ').slice(0, 220);
      console.log(`[FAIL] ${name} — ${msg}`);
    }
  }
})();
