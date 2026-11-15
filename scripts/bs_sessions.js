/**
 * bs_sessions.js — Lấy session id + link dashboard của các lần chạy BrowserStack
 * để làm bằng chứng (TA có thể mở lại session trên BrowserStack).
 *
 * Chạy: node scripts/bs_sessions.js
 * Output: evidence/xplat/browserstack-sessions.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const USER = process.env.BROWSERSTACK_USERNAME;
const KEY = process.env.BROWSERSTACK_ACCESS_KEY;
const BUILD = 'HW03-AI GUI & Usability';

if (!USER || !KEY) {
  console.error('FATAL: set BROWSERSTACK_USERNAME / BROWSERSTACK_ACCESS_KEY');
  process.exit(1);
}

const auth = 'Basic ' + Buffer.from(`${USER}:${KEY}`).toString('base64');
const api = async (url) => {
  const r = await fetch(url, { headers: { Authorization: auth } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
};

(async () => {
  const builds = await api('https://api.browserstack.com/automate/builds.json?limit=10');
  const build = (builds || []).find((b) => b.automation_build && b.automation_build.name === BUILD);
  if (!build) {
    console.error(`Không tìm thấy build "${BUILD}"`);
    process.exit(1);
  }
  const hashedId = build.automation_build.hashed_id;
  const sessions = await api(
    `https://api.browserstack.com/automate/builds/${hashedId}/sessions.json?limit=20`
  );
  const out = {
    build: BUILD,
    buildId: hashedId,
    dashboard: `https://automate.browserstack.com/dashboard/v2/builds/${hashedId}`,
    sessions: (sessions || []).map((s) => ({
      name: s.automation_session.name,
      status: s.automation_session.status,
      browser: `${s.automation_session.browser} ${s.automation_session.browser_version}`,
      os: `${s.automation_session.os} ${s.automation_session.os_version}`,
      device: s.automation_session.device || null,
      duration: s.automation_session.duration,
      createdAt: s.automation_session.created_at,
      publicUrl: s.automation_session.public_url,
      dashboardUrl: s.automation_session.appium_session_id
        ? ''
        : `https://automate.browserstack.com/dashboard/v2/builds/${hashedId}/sessions/${s.automation_session.hashed_id}`,
    })),
  };
  fs.writeFileSync(
    path.join(ROOT, 'evidence', 'xplat', 'browserstack-sessions.json'),
    JSON.stringify(out, null, 2),
    'utf8'
  );
  console.log(`build=${hashedId} sessions=${out.sessions.length}`);
  for (const s of out.sessions) console.log(` - ${s.name} | ${s.status} | ${s.browser} | ${s.os}`);
})();
