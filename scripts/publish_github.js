/**
 * publish_github.js — Tạo repo mới, push toàn bộ bài làm, tạo 34 GitHub Issues
 * (mỗi issue có screenshot) từ evidence/bug_map.json.
 *
 * Usage (PowerShell):
 *   $env:GITHUB_TOKEN = '<fine-grained PAT: Contents=write, Issues=write>'
 *   node scripts/publish_github.js
 *
 * Env tuỳ chọn:
 *   GITHUB_USER  — mặc định lấy từ GET /user
 *   REPO_NAME    — mặc định 23120372_HW03_AI_GUIUsability
 *
 * KHÔNG hardcode token. Revoke sau khi dùng xong.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const TOKEN = process.env.GITHUB_TOKEN;
const ROOT = path.join(__dirname, '..');
if (!TOKEN) {
  console.error('FATAL: set $env:GITHUB_TOKEN first');
  process.exit(1);
}

const H = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'hw03-23120372',
};

async function gh(method, p, body) {
  const r = await fetch(`https://api.github.com${p}`, {
    method,
    headers: H,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!r.ok) {
    const msg = data && data.message ? data.message : text.slice(0, 300);
    const err = new Error(`${method} ${p} → ${r.status}: ${msg}`);
    err.status = r.status;
    err.data = data;
    throw err;
  }
  return data;
}

const SEV_LABEL = {
  Blocker: { name: 'severity: blocker', color: 'b60205', description: 'Không hoàn thành được tác vụ / sai toàn vẹn dữ liệu' },
  Major: { name: 'severity: major', color: 'd93f0b', description: 'Hoàn thành được nhưng sai kết quả / cần workaround' },
  Minor: { name: 'severity: minor', color: 'fbca04', description: 'Ảnh hưởng trải nghiệm, không chặn tác vụ' },
  Cosmetic: { name: 'severity: cosmetic', color: '0e8a16', description: 'Thuần thẩm mỹ / nhất quán' },
};

/** Lấy tên repo từ git remote origin (nếu có) để tránh tạo repo sai tên. */
function detectRepoName() {
  try {
    const url = execFileSync('git', ['remote', 'get-url', 'origin'], { cwd: ROOT, encoding: 'utf8' }).trim();
    const m = url.match(/[/:]([^/]+?)(?:\.git)?$/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

function issueBody(b, repo, login) {
  const img = `https://raw.githubusercontent.com/${login}/${repo}/main/${b.evidence}`;
  return [
    `**Checklist item:** ${b.items.join(', ')}`,
    `**Screen / URL:** ${b.screen} — \`${b.url}\``,
    `**Severity:** ${b.severity}`,
    `**Spec reference:** ${b.spec}`,
    `**Detected by:** Checklist execution (automated + manual review) — HW03 GUI & Usability`,
    '',
    '### Steps to reproduce',
    ...b.steps.map((s, i) => `${i + 1}. ${s}`),
    '',
    `### Expected\n${b.expected}`,
    '',
    `### Actual\n${b.actual}`,
    '',
    `### Impact\n${b.impact}`,
    '',
    '### Evidence',
    `![${b.id}](${img})`,
    '',
    `_Environment: Chromium 141 (Playwright 1.64.1), Windows 11, viewport 1280×800; SUT web http://localhost:5173, API http://localhost:3001._`,
  ].join('\n');
}

(async () => {
  const me = await gh('GET', '/user');
  const login = process.env.GITHUB_USER || me.login;
  const repo = process.env.REPO_NAME || detectRepoName() || 'HW03_AI_GUIUsability';
  console.log(`GitHub user: ${login} | repo: ${repo}`);

  // 1. Repo
  let repoInfo;
  try {
    repoInfo = await gh('GET', `/repos/${login}/${repo}`);
    console.log('Repo đã tồn tại:', repoInfo.html_url);
  } catch (e) {
    if (e.status !== 404) throw e;
    try {
      repoInfo = await gh('POST', '/user/repos', {
        name: repo,
        description: 'HW03-AI — GUI & Usability testing trên EShop (Phan Trung Tin, 23120372)',
        homepage: 'https://github.com/ttbhanh/eshop-sut',
        private: false,
        has_issues: true,
        has_wiki: false,
        has_projects: false,
        auto_init: false,
      });
      console.log('Đã tạo repo:', repoInfo.html_url);
    } catch (err) {
      console.error('\nKhông tạo được repo tự động:', err.message);
      console.error('→ Hãy tạo repo rỗng trên GitHub rồi chạy lại script (script sẽ push + tạo issue).');
      process.exit(2);
    }
  }

  // 2. Push code + screenshots (branch main) — token chỉ dùng trong header, không ghi vào .git/config
  const remoteUrl = `https://github.com/${login}/${repo}.git`;
  const basic = Buffer.from(`x-access-token:${TOKEN}`).toString('base64');
  const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    const remotes = git('remote').split('\n').map((s) => s.trim());
    if (remotes.includes('origin')) git('remote', 'set-url', 'origin', remoteUrl);
    else git('remote', 'add', 'origin', remoteUrl);
    execFileSync(
      'git',
      ['-c', `http.https://github.com/.extraheader=AUTHORIZATION: basic ${basic}`, 'push', remoteUrl, 'HEAD:main', '--force'],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    );
    console.log('Đã push branch main (force).');
  } catch (e) {
    console.error('Push thất bại:', (e.stderr || e.message || '').toString().slice(0, 500));
    throw e;
  }

  // 3. Labels
  for (const l of [...Object.values(SEV_LABEL), { name: 'GUI', color: '1f4e79', description: 'GUI & usability' }, { name: 'HW03', color: '5319e7', description: 'Homework 03' }]) {
    try {
      await gh('POST', `/repos/${login}/${repo}/labels`, l);
    } catch (e) {
      if (e.status !== 422) console.warn('label:', e.message);
    }
  }

  // 4. Issues (idempotent: bỏ qua issue đã có cùng tiêu đề)
  const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'evidence', 'bug_map.json'), 'utf8'));
  const existing = new Map();
  for (let pageNo = 1; pageNo <= 10; pageNo++) {
    const list = await gh('GET', `/repos/${login}/${repo}/issues?state=all&per_page=100&page=${pageNo}`);
    if (!Array.isArray(list) || !list.length) break;
    for (const it of list) if (!it.pull_request) existing.set(it.title, { number: it.number, url: it.html_url });
    if (list.length < 100) break;
  }
  const created = {};
  for (const b of map.bugs) {
    const title = `[GUI] ${b.id} — ${b.title}`;
    const found = existing.get(title);
    if (found) {
      created[b.id] = found;
      console.log(`= #${found.number} ${b.id} (đã tồn tại)`);
      continue;
    }
    const issue = await gh('POST', `/repos/${login}/${repo}/issues`, {
      title,
      body: issueBody(b, repo, login),
      labels: [SEV_LABEL[b.severity].name, 'GUI', 'HW03'],
    });
    created[b.id] = { number: issue.number, url: issue.html_url };
    console.log(`#${issue.number} ${b.id} ${b.title.slice(0, 60)}`);
  }

  fs.writeFileSync(path.join(ROOT, 'evidence', 'created_issues.json'), JSON.stringify(created, null, 2), 'utf8');
  console.log(`\nĐã tạo ${Object.keys(created).length} issue → evidence/created_issues.json`);
  console.log('Bước tiếp theo: python scripts/build_bug_report.py && git add -A && git commit -m "docs(bugs): link GitHub issues" && git push origin HEAD:main');
})().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
