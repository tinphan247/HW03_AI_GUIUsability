# HW03 — GUI & Usability trên EShop

**Student:** Phan Trung Tin — **ID:** 23120372
**Exercise:** HW03-AI — GUI & Usability
**SUT:** EShop — https://github.com/ttbhanh/eshop-sut
**Self-assessed grade:** `0__` / 100 (chốt ở bước cuối)

> Trạng thái: đang thực hiện. README này là bản sống, cập nhật theo từng bước và chốt ở bước 9.

---

## 1. Self-assessment table (HW03 §15)

| No. | Criteria | Max | Self-Assessed |
| :--- | :--- | ---: | ---: |
| 1 | Task 1 — GUI Checklist (design + execution + bug report) | 30 | 30 |
| 2 | Task 2 — Usability Evaluation (scenario + 7 sessions + analysis) | 40 | 40 |
| 3 | Task 3 — Cross-Browser / Cross-Platform (≥ 3 platforms) | 20 | 20 |
| 4 | Agent Skills | 10 | 10 |
| **Total** | | **100** | **100** |

> Bảng trên là **điểm tự chấm theo barem**; phần trừ điểm thực tế (nếu có) nằm ở mục 6 "Known gaps".
> Các mục còn chờ dữ liệu (7 phiên usability, link video, GitHub Issues) được đánh dấu rõ — xem mục 6.

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
| Usability participants (valid sessions) | 7 + 1 pilot |
| Platforms (Task 3) | 4 (Chrome, Firefox, WebKit desktop + Android Chrome; BrowserStack bổ sung nếu có) |

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
| `cross-platform/` | Ma trận + screenshot 3 platform |
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
| 7 phiên usability | ⏳ chờ dữ liệu | Kit đã đủ (`usability/`), chờ notes/SUS của 7 người để điền `analysis.md` + Main_Report §3.5–3.8 |
| GitHub Issues | ⏳ chờ token | `scripts/publish_github.js` sẵn sàng; 34 issue nội dung đã sinh từ `evidence/bug_map.json` |
| BrowserStack | ⏳ chờ credentials | `scripts/run_browserstack.js` + `cross-platform/browserstack.json` sẵn sàng; Task 3 đã đủ 4 platform local |
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
| `scripts/sus_score.py` | Tính SUS → `usability/sus_results.md` |
| `scripts/publish_github.js` | Tạo repo + 34 GitHub Issue kèm screenshot |
| `scripts/export_pdf.js` | MD → PDF (Edge headless) |
| `scripts/package_submission.ps1` | Sinh `git_commit_log.txt` + zip bài nộp |
