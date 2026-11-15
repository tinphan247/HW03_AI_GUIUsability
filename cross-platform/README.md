# Task 3 — Cross-Browser / Cross-Platform

**Mục tiêu:** chạy lại bộ checklist Task 1 trên ≥ 3 platform, so sánh hành vi, và lưu screenshot có đầy đủ dấu vết (email sinh viên + browser/OS/device + URL localhost + timestamp).

## 1. Platform

Khai báo trong `platforms.json`, chạy bằng `node scripts/run_cross_platform.js`:

| # | ID | Browser / OS / device | Loại |
| :-: | :--- | :--- | :--- |
| 1 | `windows-chrome` | Chrome 141 (Chromium) · Windows 11 · 1280×800 | Desktop, native engine |
| 2 | `windows-firefox` | Firefox (Gecko) · Windows 11 · 1280×800 | Desktop, native engine |
| 3 | `windows-webkit` | WebKit 27 (Safari engine) · Windows 11 · 1280×800 | Desktop, engine Safari |
| 4 | `android-chrome` | Chrome Mobile · Pixel 7 · Android 14 (Playwright emulation) | Mobile |
| 5 | `ios-safari` | Safari Mobile · iPhone 14 · iOS 17 (Playwright emulation) | Mobile (tuỳ chọn) |

> Nếu có BrowserStack trial, chạy thêm macOS Safari + Android thật; screenshot lưu cùng thư mục `screenshots/cross-platform/browserstack-*`.

## 2. Cách chạy

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "C:\HCMUS\hk7\Testing\gui-testing-playwright-exercise\.cache\ms-playwright"

# cả 4 platform (mỗi platform: 53 item tự động + 4 screenshot màn hình chính)
node scripts/run_cross_platform.js

# hoặc chọn platform
node scripts/run_cross_platform.js windows-firefox android-chrome

# tổng hợp ma trận
node scripts/build_xplat_matrix.js
```

Kết quả:

- `evidence/xplat/results-<platform>.json` — Pass/Fail từng item.
- `screenshots/cross-platform/<platform>/IA-xx-xx.png` — chỉ item Failed, đã có overlay.
- `screenshots/cross-platform/<platform>/01-home.png` … `04-checkout-coupon.png` — 4 màn hình chính, luôn có overlay.
- `cross-platform/matrix.md` + `matrix.csv` — ma trận Pass/Fail và khác biệt so với baseline.
- `cross-platform/run.log` — log đầy đủ.

## 3. Quy ước screenshot

Mỗi ảnh có thanh overlay ở đầu trang:

```text
23120372@student.hcmus.edu.vn | <Platform label> | <URL localhost> | <dd/mm/yyyy hh:mm:ss>
```

Ví dụ: `23120372@student.hcmus.edu.vn | Windows 11 · Firefox (Gecko) · Desktop 1280×800 | http://localhost:5173/login | 15/11/2026 14:22:10`.

Ảnh full-page, không cắt; tên file theo item ID để đối chiếu với `matrix.md`.

## 4. Kết quả

Xem `cross-platform/matrix.md`. Tóm tắt điền ở `Main_Report.md` §4.

## 5. Hạn chế

- Android/iOS trong bảng trên là **emulation** của Playwright (UA + viewport + touch), không phải thiết bị thật. Nếu có BrowserStack, bằng chứng thiết bị thật được bổ sung và ghi rõ.
- WebKit trên Windows là engine Safari nhưng không phải Safari trên macOS; khác biệt font/scrollbar có thể có.
- Trial BrowserStack giới hạn phút → chỉ chạy subset + screenshot, không chạy toàn bộ 53 item trên cloud.
