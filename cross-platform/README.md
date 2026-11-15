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

## 5. BrowserStack (OS thật — đã chạy)

```powershell
$env:BROWSERSTACK_USERNAME = '<username>'
$env:BROWSERSTACK_ACCESS_KEY = '<access key>'
node scripts/run_browserstack.js                    # cả target đang bật trong browserstack.json
node scripts/run_browserstack.js macos-chrome       # chọn 1 target
```

**Kết quả đã chạy (15/11/2026):**

| Target | Thiết bị/OS | Ảnh | Trạng thái |
| :--- | :--- | :-: | :--- |
| `bs-windows-chrome-bs` | Windows 11 · Chrome (real) | 4 | ✅ đủ 4 ảnh |
| `bs-macos-chrome` | macOS Sonoma · Chrome (real) | 4 | ✅ đủ 4 ảnh |
| `bs-android-samsung` | Galaxy S23 · Android 13 (real device) | 0 | ⛔ bị chặn — xem dưới |

Hai target chạy được đều tái hiện đúng bug coupon (`Tiết kiệm: -270,000,000 ₫`, `Thành tiền: 300,000,000 ₫`) → củng cố kết luận §4.5: lỗi thuộc về SUT, không phụ thuộc engine/OS.

**Ba lỗi harness đã gặp và cách xử lý (ghi lại để tái lập):**

1. `Local is not a constructor` → package `browserstack-local` export khác nhau giữa version; sửa `bs.Local || bs.default || bs`.
2. `spawn wmic.exe ENOENT` + crash parse output trong `Local.js` → Windows 11 24H2 đã bỏ `wmic.exe`. Script chuyển sang **chạy `BrowserStackLocal.exe` trực tiếp** (`%USERPROFILE%\.browserstack\BrowserStackLocal.exe`) và bắt riêng lỗi wmic bằng `uncaughtException`.
3. `playwright-webkit` (Safari) trên BrowserStack trả về trang "Unable to display the page" — endpoint Playwright của BrowserStack là **CDP**, không bridge được WebKit. Đã bỏ target Safari cloud, thay bằng **macOS + Chrome thật**; engine WebKit vẫn có bằng chứng local `windows-webkit`.
4. Real mobile device (`device` + `realMobile`) trả `Malformed endpoint`; Android emulator trả `OS and OS Version not supported`. Target này được đánh dấu `"skip": true` trong `browserstack.json` — Android đã có bằng chứng emulation local `android-chrome`.

- Overlay trong ảnh BrowserStack: `<email> | <label target> | http://localhost:5173/... | <thời điểm>`.
- Output: `screenshots/cross-platform/bs-<target>/*.png`, `evidence/xplat/browserstack-<target>.json`, log `cross-platform/browserstack.log`.
- **Truy vết session:** `node scripts/bs_sessions.js` → `evidence/xplat/browserstack-sessions.json` (build id, session id, trạng thái, link dashboard/public URL để TA mở lại đúng session).
- Trial giới hạn phút → chỉ chụp 4 màn hình chính, không chạy lại 53 item.

## 6. Hạn chế

- `android-chrome` là **emulation** của Playwright (UA + viewport + touch), không phải thiết bị thật; real-device Android qua BrowserStack bị chặn (mục 5).
- WebKit trên Windows là engine Safari nhưng không phải Safari trên macOS; macOS thật chỉ có bằng chứng ở Chrome (BrowserStack).
- Trial BrowserStack giới hạn phút → chỉ chạy subset + screenshot, không chạy toàn bộ 53 item trên cloud.
