# HW03 — GUI & Usability trên EShop

**Student:** Phan Trung Tin — **ID:** 23120372
**Exercise:** HW03-AI — GUI & Usability
**SUT:** EShop — https://github.com/ttbhanh/eshop-sut
**Repo bài làm:** https://github.com/tinphan247/HW03_AI_GUIUsability
**Bug tracker:** 34 issue — https://github.com/tinphan247/HW03_AI_GUIUsability/issues
**Self-assessed grade:** `100` / 100 (bảng chi tiết ở mục 1, hạn chế ở mục 6)

> Trạng thái: đang thực hiện. README này là bản sống, cập nhật theo từng bước và chốt ở bước 9.

---

## 1. Self-assessment table (HW03 §15)

| No. | Criteria | Max | Self-Assessed |
| :--- | :--- | ---: | ---: |
| 1 | Task 1 — GUI Checklist (design + execution + bug report) | 30 | 30 |
| 2 | Task 2 — Usability Evaluation (scenario + 7 sessions + analysis) | 40 | 34 (7 người thật qua Google Form, SUS mean 80.0; trừ vì unmoderated: không có time-on-task, task outcome tự khai, không có quote) |
| 3 | Task 3 — Cross-Browser / Cross-Platform (≥ 3 platforms) | 20 | 20 |
| 4 | Agent Skills | 10 | 8 (thiếu video demo) |
| **Total** | | **100** | **92** |

> Bảng trên là **điểm tự chấm theo barem**; phần trừ điểm thực tế (nếu có) nằm ở mục 6 "Known gaps".
> Các mục **chưa hoàn tất** (video demo) được đánh dấu ⏳ và **không được cộng điểm** — xem mục 6.

---

## 2. Test summary (chốt ở bước cuối)

| Metric | Value |
| :--- | ---: |
| Screens / flows tested | 9 màn hình (Home, Product Detail, Cart, Checkout, Login, Register, Forgot password, Profile, Admin) |
| Checklist items designed | 65 |
| Checklist items executed | 65 (100%) |
| Passed | 21 (32,3%) |
| Failed | 44 (67,7%) |
| Bugs reported (GitHub Issues) | 34 (5 Blocker · 16 Major · 12 Minor · 1 Cosmetic) |
| Usability participants (valid sessions) | **7 / 7** (8 response thô → bỏ 1 trùng) · SUS mean **80.0** (median 87.5, SD 17.2) |
| Platforms (Task 3) | 6 (Windows Chrome/Firefox/WebKit + Android Chrome local; Windows 11 Chrome + macOS Sonoma Chrome trên BrowserStack) |

---

## 3. Contents of this folder

| Path | Nội dung |
| :--- | :--- |
| `Main_Report.md` / `.pdf` | Báo cáo chính: Task 1, 2, 3 |
| `Bug_Reports.md` | Chi tiết bug + link GitHub Issues |
| `AI_Audit_Report.md` / `.pdf` | AI Audit + AI Critique |
| `git_commit_log.txt` | Log commit theo từng bước |
| `checklist/GUI_Checklist.xlsx` | Checklist > 40 item + test summary |
| `checklist/checklist_design.md` | Bộ AI sinh, review log, item tự thêm + lý do |
| `checklist/execution_log.md` | Biên bản thực thi |
| `usability/` | Kế hoạch, scenario, instruments, pilot, 7 phiên, phân tích |
| `cross-platform/` | Ma trận + screenshot 4 platform local + 2 target BrowserStack |
| `skills/` | 2 Agent Skill tái sử dụng |
| `screenshots/` | Evidence cho item Failed và bug |

---

## 4. Cách chạy lại SUT

1. `cd HW2/eshop-sut/backend && node database.js && $env:PORT=3001; node server.js` (API port **3001** trên máy này; mặc định repo là 3000)
2. `cd ../frontend-web && npm run dev` (port 5173)
3. `cd ../frontend-admin && npm run dev` (port 5174)
4. Mobile: `cd ../frontend-mobile && npx expo start` + Expo Go cùng Wi-Fi (API URL trong `App.js` trỏ LAN IP:3001)
5. Tài khoản seed: `admin@eshop.com / Admin123!`, `test@eshop.com / Test1234!`

> Lý do đổi port: `localhost:3000` đã bị một app Next.js khác chiếm. Chi tiết + phạm vi thay đổi: `evidence/SUT_LOCAL_PATCH.md`.

---

## 5. Demo videos

| Skill | Video |
| :--- | :--- |
| `gui-checklist-tester` + `usability-evaluation` | TODO — quay 1 video 3–5 phút theo kịch bản `skills/README.md` |

---

## 6. Known gaps (nộp kèm để TA đối chiếu)

| Hạng mục | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| 7 phiên usability | ⚠️ đã chạy, chất lượng bằng chứng thấp | **7 người thật**, 8 response Google Form (bỏ 1 trùng cùng SĐT bằng script). SUS mean 80.0, SD 17.2. Hạn chế: **unmoderated** — không có time-on-task, không có thiết bị, task outcome tự khai, không quote/observation, không chạy pilot, 6/7 straight-lining (courtesy bias). Ghi rõ ở `usability/analysis.md` §8 và `Main_Report.md` §3.5 |
| Dữ liệu thô Google Form | 🔒 chỉ giữ local | `usability/gform_responses.csv` (8 response) + `contacts_local.csv` chứa họ tên/SĐT thật → nằm trong `.gitignore`, **không** lên repo và **không** vào zip. Bản che 4 số giữa: `participants.csv`; bản đầy đủ gửi TA khi được yêu cầu xác minh |
| GitHub Issues | ✅ | 34 issue tại https://github.com/tinphan247/HW03_AI_GUIUsability/issues (mỗi issue có screenshot + steps + severity label) |
| BrowserStack | ✅ 2/3 target | Windows 11 Chrome + macOS Sonoma Chrome (real) trong `screenshots/cross-platform/bs-*`; Galaxy S23 bị BrowserStack chặn (`Malformed endpoint`) — ghi ở `cross-platform/README.md` §5 |
| Video demo skill | ⏳ chờ quay | Kịch bản + timeline ở `skills/README.md` |
| PDF | ✅ | Sinh bằng `node scripts/export_pdf.js` (Edge headless) |

---

## 7. Script index (tái lập toàn bộ evidence)

| Script | Việc làm |
| :--- | :--- |
| `scripts/inventory.js` | Quét DOM 8 route + admin → `evidence/inventory.json` |
| `scripts/checklist_runner.js` | 53 check tự động (Playwright + axe-core), hỗ trợ `BROWSER_KIND`, `PLATFORM_DEVICE`, `OUT_JSON`, `SHOT_DIR`, `CHECK_FILTER` |
| `scripts/capture_evidence.js` | 12 check thủ công + screenshot + số đo computed style |
| `scripts/build_checklist.py` | Sinh `checklist/GUI_Checklist.xlsx` (3 sheet) + `checklist/execution_log.md` |
| `scripts/build_bug_report.py` | Sinh `Bug_Reports.md` + copy screenshot theo bug |
| `scripts/run_cross_platform.js` | Chạy checklist + chụp ảnh trên 4 platform |
| `scripts/build_xplat_matrix.js` | Sinh `cross-platform/matrix.md` + `matrix.csv` |
| `scripts/run_browserstack.js` | Chụp 4 màn hình trên BrowserStack (tunnel local) |
| `scripts/sus_from_lines.py` | Nhập `usability/raw_sessions.txt` (1 dòng/người) → `participants.csv` + `sus_scores.csv` |
| `scripts/gform_to_csv.py` | Chuyển CSV Google Form (dựng theo `GOOGLE_FORM_GUIDE.md`) → `participants.csv` + `sus_scores.csv` |
| `scripts/dedupe_responses.py` | Bỏ response trùng theo SĐT (giữ bản gửi sau) → `gform_responses_dedup.csv` |
| `scripts/import_gform_sessions.py` | Sinh `usability/sessions/P1..P7/notes.md`; tách `contacts_local.csv` (không nộp); xoá SĐT đầy đủ khỏi `participants.csv` |
| `scripts/sus_score.py` | Tính SUS → `usability/sus_results.md` |
| `scripts/bs_sessions.js` | Lấy session id + link dashboard BrowserStack → `evidence/xplat/browserstack-sessions.json` |
| `scripts/publish_github.js` | Tạo repo + 34 GitHub Issue kèm screenshot |
| `scripts/export_pdf.js` | MD → PDF (Edge headless) |
| `scripts/package_submission.ps1` | Sinh `git_commit_log.txt` + zip bài nộp |
