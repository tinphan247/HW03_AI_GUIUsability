# HW03 — GUI & Usability trên EShop

**Course:** Software Testing (FIT — VNUHCM University of Science)
**Exercise ID:** HW03-AI
**Student:** Phan Trung Tin — **MSSV:** 23120372
**SUT:** EShop — https://github.com/ttbhanh/eshop-sut
**Bloom-AI:** G9.3 (Analyse) + G9.4 (Collaborate with AI for exploratory testing)
**Ngày thực hiện:** 15/11/2026 — …
**Self-assessed grade:** `0__/100`

---

## Mục lục

1. [Phạm vi, môi trường và phương pháp](#1-phạm-vi-môi-trường-và-phương-pháp)
2. [Task 1 — GUI Checklist](#2-task-1--gui-checklist)
3. [Task 2 — Usability Evaluation](#3-task-2--usability-evaluation)
4. [Task 3 — Cross-Browser / Cross-Platform](#4-task-3--cross-browser--cross-platform)
5. [Agent Skills](#5-agent-skills)
6. [AI Audit & AI Critique](#6-ai-audit--ai-critique)
7. [Git commit log](#7-git-commit-log)
8. [Tự đánh giá & bài học](#8-tự-đánh-giá--bài-học)
9. [References](#9-references)

> **Phụ lục:** `Bug_Reports.md` (bug chi tiết) · `AI_Audit_Report.md` (log AI + critique) · `checklist/GUI_Checklist.xlsx` (checklist gốc) · `usability/` (evidence 7 phiên) · `cross-platform/` (3 platform).

---

## 1. Phạm vi, môi trường và phương pháp

### 1.1 Hệ thống dưới kiểm thử (SUT)

| Thành phần | Công nghệ | URL |
| :--- | :--- | :--- |
| Backend API | Node.js + Express + SQLite | http://localhost:3000 |
| Web storefront | React + Vite + Tailwind | http://localhost:5173 |
| Web admin | React + Vite + Tailwind | http://localhost:5174 |
| Mobile app | React Native + Expo | Expo Go (LAN IP) |

Tài khoản seed: `test@eshop.com / Test1234!` (user), `admin@eshop.com / Admin123!` (admin).
DB được reset bằng `node database.js` trước mỗi batch execution để kết quả tái lập được.

### 1.2 Phạm vi lựa chọn

**Primary screens cho Task 1:** Giỏ hàng (Cart), Thanh toán (Checkout + coupon), Đăng nhập / Đăng ký (Auth).
**Màn hình phụ (hỗ trợ):** Trang chủ / danh sách sản phẩm, Chi tiết sản phẩm.

Lý do: cụm màn hình này là nơi giao thoa của cả 4 interface aspect (chuẩn chung, form, điều hướng, feedback/state); đồng thời là flow của Task 2 nên evidence dùng lại được, tránh làm hai lần.

**Flow Task 2:** Đăng ký → tìm sản phẩm → thêm vào giỏ → áp mã giảm giá → thanh toán → xem lịch sử đơn hàng.

> Không trùng thành viên nhóm: đã xác nhận với nhóm (không thành viên nào chọn cụm Cart/Checkout/Auth và flow đăng ký → checkout).

### 1.3 Ánh xạ interface aspect ↔ yêu cầu GUI của SUT

SUT không gán FR cho UI, nhưng SRS v2.0 §8 có FR-21…FR-24. Đây là **chuẩn tham chiếu** để checklist có căn cứ, thay vì đánh giá cảm tính.

| IA | Tên | Yêu cầu SUT tương ứng |
| :--- | :--- | :--- |
| IA-01 | General UI standards | FR-21: nhất quán ngôn ngữ/màu/đơn vị tiền, đúng 1 `<h1>`, tab order |
| IA-02 | Forms | FR-22: dấu `*`, `type=email/password`, lỗi trên nút submit, step indicator |
| IA-03 | Navigation | FR-23: navbar highlight, badge giỏ, nhãn "Đăng xuất", breadcrumb |
| IA-04 | Feedback / state | FR-24: toast/badge sau add-to-cart, dialog xác nhận xóa, empty state, alt ảnh |

### 1.4 Phương pháp và cách dùng AI

Quy trình AI-first 4 bước (đóng gói thành skill `skills/gui-checklist-tester`):

1. **Inventory** màn hình → component → state → map IA/FR (AI không được bỏ qua bước này).
2. **Generate** item theo từng IA, có ID + expected + cách kiểm chứng.
3. **Review** của sinh viên: loại item trùng/không test được/sai spec.
4. **Gap-fill**: sinh viên bổ sung item AI bỏ sót, ghi lý do bỏ sót.

Mọi prompt + output + nhận xét + phần sửa của sinh viên được ghi trong `AI_Audit_Report.md` (mỗi artifact 5 mục). Không có kết quả test nào do AI tạo mà không được thực thi thật.

---

## 2. Task 1 — GUI Checklist

### 2.1 Thiết kế checklist

Quy trình 4 bước (đóng gói thành skill `gui-checklist-tester`, chi tiết + prompt đầy đủ ở `checklist/checklist_design.md`):

| Bước | Việc làm | Output |
| :--- | :--- | :--- |
| 1. Inventory | AI đọc DOM 8 route web + admin, liệt kê component/state, map IA; sinh viên xác minh bằng `scripts/inventory.js` | `evidence/inventory.json` |
| 2. Generate | AI sinh item theo 4 IA, mỗi item có Expected + Spec ref + Method | 46 item thô |
| 3. Review | Sinh viên keep/merge/drop/rewrite | còn 41 item AI + 10 quyết định loại bỏ |
| 4. Gap-fill | Sinh viên thêm item AI bỏ sót, ghi lý do | +24 item → **65 item** |

Bộ cuối: **65 item** (ngưỡng đề ≥ 40), phủ **4/4 interface aspect** và **9 màn hình**:

| IA | Tên | Số item | Trọng tâm |
| :--- | :--- | ---: | :--- |
| IA-01 | General UI standards | 16 | heading, `lang`, locale tiền/ngày, alt, contrast, focus, responsive, zoom 200%, dark mode, RTL, touch target |
| IA-02 | Forms | 17 | dấu `*`, input type, label, vị trí + nội dung lỗi, step indicator, giữ dữ liệu, double-submit, quantity, tổng tiền, guest guard, autocomplete, trim, confirm password, hint |
| IA-03 | Navigation | 16 | nav active, badge giỏ, nhãn đăng xuất, breadcrumb, logo, link 404, quay lại mua sắm, route guard, persistence, scroll, exit, admin tab, mobile nav, nhãn icon, back |
| IA-04 | Feedback / state | 16 | toast/badge, first-click, confirm xóa/hủy, empty cart/search, loading, error API, coupon ok/lỗi, nhãn trạng thái đơn, clear cart, XSS, lộ lỗi, submit progress, dismiss |

Phương pháp thực thi: **53 item tự động** (Playwright 1.64.1 + axe-core 4.10.2) và **12 item thủ công** (visual/màu/mobile/browser back), item thủ công có screenshot + số đo computed style.

### 2.2 Item tự bổ sung và lý do AI bỏ sót

24/65 item do sinh viên bổ sung (37%). Lý do được phân thành 4 nhóm (bảng đầy đủ ở sheet `AI vs Human`):

| Nhóm lý do AI bỏ sót | Số item | Ví dụ |
| :--- | ---: | :--- |
| (a) Prompt/scope hẹp — AI chỉ làm đúng màn được nêu | 4 | IA-01-02 (mọi trang), IA-02-15 (trim), IA-03-10 (scroll), IA-04-16 (dismiss) |
| (b) AI thiên về "nhìn thấy", bỏ accessibility/đo lường | 8 | IA-01-03 (`lang`), IA-01-10 (contrast), IA-01-11 (focus), IA-01-13 (zoom), IA-01-16 (touch target), IA-02-04 (label), IA-02-13 (autocomplete), IA-02-14 (placeholder) |
| (c) Bỏ qua người dùng biên / thị trường khác | 3 | IA-01-14 (dark mode), IA-01-15 (RTL), IA-03-14 (nhãn icon) |
| (d) Đặc thù SUT và trạng thái biên | 9 | IA-01-08 (ngày VN), IA-02-09 (double submit), IA-02-17 (hint), IA-03-08 (dead-end), IA-03-09 (persistence), IA-04-02 (first-click), IA-04-07 (error API), IA-04-12 (XSS render), IA-04-13 (lộ lỗi kỹ thuật) |

Ngược lại, **10 item AI sinh bị loại/gộp** vì trùng ý, không đo được hoặc không có trong spec (ví dụ "nút có hover state", "font dễ đọc", "form có nút Reset", "đăng nhập Google/Facebook"). Chi tiết lý do: `checklist/checklist_design.md` §4.

### 2.3 Checklist và kết quả thực thi

| Metric | Value |
| :--- | ---: |
| Item thiết kế | 65 |
| Đã thực thi | 65 (100%) |
| Passed | 21 (32,3%) |
| Failed | 44 (67,7%) |
| Item tự động | 53 |
| Item thủ công | 12 |

| IA | Items | Passed | Failed | Pass rate |
| :--- | ---: | ---: | ---: | ---: |
| IA-01 General UI | 16 | 5 | 11 | 31,3% |
| IA-02 Forms | 17 | 2 | 15 | 11,8% |
| IA-03 Navigation | 16 | 12 | 4 | 75,0% |
| IA-04 Feedback / state | 16 | 2 | 14 | 12,5% |

Nguồn dữ liệu: `evidence/checklist_results.json` (tự động) + `evidence/manual_results.json` (thủ công); bảng đầy đủ + filter trong `checklist/GUI_Checklist.xlsx`; biên bản từng item ở `checklist/execution_log.md`. Screenshot **chỉ cho item Failed**: `screenshots/checklist/*.png` (38 ảnh tự động + 12 ảnh thủ công, trong đó 6 ảnh thủ công thuộc item Passed dùng làm minh chứng quan sát).

**Phát hiện nghiêm trọng nhất** (đối chiếu `Bug_Reports.md`):

1. **Coupon tính sai** — SAVE10 hiển thị "Tiết kiệm −270.000.000 ₫", thành tiền 300.000.000 ₫ cho đơn 30.000.000 ₫ (công thức percent sai ở backend).
2. **Tổng tiền editable** — người dùng sửa được số tiền phải trả trước khi gửi checkout.
3. **Guest vào thẳng /checkout** — tạo được đơn không gắn tài khoản.
4. **XSS qua ô tìm kiếm** — chuỗi `<b>abc</b>` được render thành HTML.
5. **First-click ở Product Detail không thêm vào giỏ** — phải bấm 2 lần.
6. **Mật khẩu Login là `type=text`** — lộ ký tự khi nhập.

### 2.4 Bug phát hiện

44 item Failed được gom thành **34 bug** theo nguyên nhân gốc (một bug có thể phủ nhiều item):

| Severity | Số bug |
| :--- | ---: |
| Blocker | 5 |
| Major | 16 |
| Minor | 12 |
| Cosmetic | 1 |
| **Tổng** | **34** |

Mỗi bug có: steps to reproduce, expected/actual theo spec, impact, screenshot (`screenshots/bugs/GUI-BUG-NN.png`) và **GitHub Issue** tương ứng. Chi tiết: `Bug_Reports.md`; mapping item → bug: `evidence/bug_map.json`.

---

## 3. Task 2 — Usability Evaluation

### 3.1 Mục tiêu

TODO

### 3.2 Task scenario

TODO

### 3.3 Instruments

TODO

### 3.4 Tuyển người tham gia & phiên pilot

TODO

### 3.5 Bảy phiên

TODO

### 3.6 Kết quả SUS

TODO

### 3.7 Phân tích theme & severity

TODO

### 3.8 Khuyến nghị

TODO

---

## 4. Task 3 — Cross-Browser / Cross-Platform

TODO

---

## 5. Agent Skills

TODO

---

## 6. AI Audit & AI Critique

TODO

---

## 7. Git commit log

TODO

---

## 8. Tự đánh giá & bài học

TODO

---

## 9. References

- ISTQB Foundation Level Syllabus (latest edition).
- SRS EShop v2.0 — https://github.com/ttbhanh/eshop-sut
- WCAG 2.2 Quick Reference — https://www.w3.org/WAI/WCAG22/quickref/
- Nielsen Norman Group — Usability Testing 101.
- Brooke, J. (1996). SUS: A "quick and dirty" usability scale.
- Hardman, P. (2025). A Post-AI Learning Taxonomy.
- Anthropic (2025). Building Reliable AI Test Agents.
