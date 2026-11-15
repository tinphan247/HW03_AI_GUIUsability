# AI Audit Report — HW03-AI: GUI & Usability

**Course:** Software Testing (FIT — VNUHCM University of Science)
**Exercise ID:** HW03-AI
**Student:** Phan Trung Tin — **23120372**
**SUT:** EShop — https://github.com/ttbhanh/eshop-sut
**AI tools used:** DeepSeek V4.1 Flash Free via OpenCode agent (Plan + Build mode), Playwright (automation, no AI), axe-core (contrast/accessibility audit)

> **Cách ghi log:** mỗi lần "một prompt → một artifact" là một entry 5 mục:
> (1) Prompt + Tool + Timestamp → (2) AI Output → (3) Verdict → (4) Reasoning → (5) Student Fix.
> Format kế thừa từ HW01 `TEMPLATES/AI-02_Audit_Report.md` và HW02 `AI_Audit_Report.md`.

---

## Artifact 0 — Đọc đề, phân tích SUT và lập kế hoạch (G9.3 Analyse)

### (1) Prompt + Tool

- **Tool:** DeepSeek V4.1 Flash Free (OpenCode agent, **Plan mode**)
- **Timestamp:** 15/11/2026, ~09:00 (UTC+7)
- **Full prompt (user):**
  ```text
  Tôi sẽ làm hw3 - GUI testing. Ở folder hw3. Đọc kỹ yêu cầu đề bài và phân tích.
  Sau đó đưa tôi kế hoạch thực hiện đề bài này.

  [Sau khi xem kế hoạch, người dùng chốt:]
  1. Trùng nhóm: không sao.
  2. Email sinh viên: 23120372@student.hcmus.edu.vn
  3. GitHub: tạo repo mới.
  Tiến hành thực hiện yêu cầu. Đảm bảo commit từng bước, nếu có bất kì câu hỏi nào khác thì cứ hỏi lại tôi.
  ```

### (2) AI Output

- Trích xuất 9 trang PDF đề bài (pypdf), tóm tắt trọng số 30/40/20/10 và các ràng buộc anti-AI-cheat.
- Đọc SUT đã clone tại `HW2/eshop-sut`: liệt kê 4 thành phần, phát hiện SRS có FR-21…FR-24 map trực tiếp IA-01…IA-04.
- Đọc 8 trang web frontend + admin App.jsx + mobile App.js để lập **danh sách giả thuyết lỗi** (chưa coi là kết quả).
- Đề xuất kế hoạch 9 giai đoạn, cấu trúc thư mục, phân bổ ~60 checklist item theo 4 IA, kịch bản usability, ma trận 3 platform, rủi ro và fallback.
- Hỏi 4 quyết định: phạm vi màn hình, flow, platform, ngôn ngữ báo cáo.

### (3) Verdict

**PARTIALLY VALID** — kế hoạch dùng được, nhưng có 3 điểm phải sửa/không được tin tuyệt đối:

1. AI gợi ý ban đầu "chạy checklist trên BrowserStack Automate cho cả 60 item × 3 platform" — không thực tế với trial minutes; phải tách **automated subset** và **manual visual subset**.
2. AI liệt kê một số "lỗi" từ đọc code (ví dụ login `type="text"`, Home 2 `<h1>`); đây là **giả thuyết**, bắt buộc phải xác minh bằng execution + screenshot, không được chép vào bug report.
3. AI chưa phân biệt rõ "item AI sinh" và "item sinh viên tự thêm" — trong khi đề yêu cầu giải thích **vì sao AI bỏ sót từng item thêm vào**. Đã bổ sung cột `Origin` + `Why AI missed` trong checklist.

### (4) Reasoning

Đề bài chấm theo "quality over completion" và yêu cầu AI-first **có kiểm soát** (guiding principles §2). Một kế hoạch tốt phải: (a) map checklist về spec FR-21…24 để có traceability, (b) tách rõ dữ kiện vs giả thuyết, (c) có fallback cho rủi ro con người (7 participant) và trial BrowserStack. Việc AI đọc code trước khi execute là hữu ích để chọn màn hình "nhiều lỗi", nhưng nếu dùng làm kết quả luôn thì vi phạm nguyên tắc human review và làm mất giá trị bằng chứng.

### (5) Student Fix

- Chốt phạm vi: Cart + Checkout + Auth (màn phụ Home/Product Detail), flow đăng ký → checkout → lịch sử đơn.
- Tự quyết định dùng **Playwright + axe-core** để tự động hoá item khách quan, chụp screenshot evidence; phần visual/UX kiểm tra tay.
- Yêu cầu commit từng bước và giữ nguyên văn prompt trong audit.
- TODO khi thực thi: xác minh từng giả thuyết lỗi, ghi rõ item nào do AI sinh / item nào sinh viên thêm.

---

## Artifact 1 — Sinh bộ checklist 65 item và thực thi (G9.3 Analyse + G9.4 Collaborate)

### (1) Prompt + Tool

- **Tool:** DeepSeek V4.1 Flash Free (OpenCode agent, **Build mode**), sau đó Playwright 1.64.1 + axe-core 4.10.2 (không AI) để thực thi.
- **Timestamp:** 15/11/2026, ~10:10–13:40 (UTC+7)
- **Full prompt (user, nguyên văn):**
  ```text
  Tiếp tục Task 1. Với inventory đã có ở evidence/inventory.json:
  1) Sinh checklist item cho từng IA-01..IA-04, mỗi item có Expected, Spec ref,
     Method (automated/manual), Priority. Không sinh item chung chung.
  2) Tự chỉ ra 10 nhóm item còn thiếu cho người dùng biên.
  3) Viết runner Playwright thực thi các item automated, chỉ chụp screenshot
     cho item Failed.
  ```

### (2) AI Output

- 46 item thô trải 4 IA (IA-01 9, IA-02 12, IA-03 13, IA-04 12) kèm Expected/Spec/Method.
- Danh sách 6 nhóm gap: accessibility, mobile, dark mode, RTL, loading/empty, locale.
- `scripts/inventory.js`, `scripts/checklist_runner.js` (53 check), `scripts/capture_evidence.js` (12 check thủ công).
- Sau review + gap-fill: 65 item; kết quả 21 Passed / 44 Failed.

### (3) Verdict

**PARTIALLY VALID** — dùng được nhưng phải sửa 5 điểm:

1. AI sinh 12 item IA-04 nhưng 1 item bị gộp và chỉ còn 11 sau review, trong khi IA-04 là nơi SUT lỗi nhiều nhất → sinh viên tự bổ sung 5 item IA-04 (empty state, error API, XSS, lộ lỗi, dismiss).
2. AI sinh 5 item không thể Fail hoặc không có trong spec (hover state, font dễ đọc, nút Reset, social login, footer policy) → drop.
3. AI chỉ liệt kê 6 nhóm gap, thiếu 4 nhóm quan trọng: persistence, dead-end sau route guard, lộ lỗi kỹ thuật, vòng đời thông báo → sinh viên thêm.
4. Runner ban đầu dùng `page.goto('/cart')` sau khi thêm giỏ, làm mất React state và tạo **false positive** "giỏ trống" ở IA-03-07/IA-04-08/IA-04-11 → sửa thành click navbar (SPA navigation).
5. Check IA-04-15 ban đầu coi "có dialog" là Pass, nhưng dialog xuất hiện **sau** request hủy → sửa để kiểm tra thứ tự dialog-before-request.

### (4) Reasoning

Checklist chỉ có giá trị khi (a) mỗi item đo được và có thể Fail, (b) phương pháp thực thi không tự tạo ra lỗi giả. Hai lỗi runner ở mục 4–5 nguy hiểm hơn lỗi code: chúng làm báo cáo sai bản chất SUT. Vì vậy mỗi lần đổi runner, tôi chạy lại toàn bộ 53 check và đối chiếu screenshot trước khi ghi kết quả. Việc AI không nghĩ tới persistence/XSS/dead-end cho thấy AI giỏi "liệt kê chuẩn chung" nhưng yếu ở "trạng thái biên đặc thù sản phẩm" — đúng vai trò con người phải bù.

### (5) Student Fix

- Tự viết 24 item gap-fill, mỗi item gắn 1 trong 4 nhóm lý do AI bỏ sót (không dùng lý do chung chung).
- Sửa runner: thêm `clickCart()`/`clickCheckout()` điều hướng SPA; đổi check coupon sang đọc `p.text-red-600`; thêm kiểm tra `request` trước `dialog` cho hủy đơn; đổi IA-01-14 sang so sánh light vs dark thay vì kỳ vọng app có dark theme.
- Không chấp nhận kết quả nào không có screenshot/measurement; item thủ công đo `getComputedStyle` thay vì "nhìn thấy đẹp".
- Gom 44 item Failed thành 34 bug theo nguyên nhân gốc, giữ mapping item → bug trong `evidence/bug_map.json`.

---

## Artifact 2 — Viết bug report và kiểm tra chéo kết quả (G9.4)

### (1) Prompt + Tool

- **Tool:** DeepSeek V4.1 Flash Free (OpenCode agent), Playwright để tái hiện.
- **Timestamp:** 15/11/2026, ~14:00 (UTC+7)
- **Prompt (user):** `Từ 44 item Failed, gom thành bug theo nguyên nhân gốc. Mỗi bug phải có steps, expected/actual, impact, severity và screenshot. Đừng gộp bug khác nguyên nhân chỉ để giảm số lượng.`

### (2) AI Output

- Đề xuất gom thành 34 bug: 5 Blocker, 16 Major, 12 Minor, 1 Cosmetic; sinh `Bug_Reports.md` + copy screenshot.
- Với mỗi bug, AI viết lại actual dựa trên note của runner và đọc source để giải thích nguyên nhân (ví dụ coupon percent: `total*(1−value)`).

### (3) Verdict

**VALID with correction** — cách gom hợp lý, nhưng AI có 2 lần suy diễn quá mức:

1. AI xếp IA-04-08 (coupon) là "Major" — thực tế là **Blocker** vì số tiền gửi lên server sai 10 lần, ảnh hưởng trực tiếp giao dịch.
2. AI định gộp "không có badge giỏ" và "không có toast" thành 1 bug — đúng vì cùng root cause (không có cơ chế feedback giỏ hàng), nhưng phải giữ cả 2 item trong cột Checklist item để traceability.
3. AI mô tả "hủy đơn có dialog" là Pass ở lần chạy đầu — sai, đã sửa ở Artifact 1.

### (4) Reasoning

Severity phải theo **tác động nghiệp vụ**, không theo "mức khó chịu khi nhìn". Coupon sai số tiền và tổng tiền editable đều là lỗi toàn vẹn dữ liệu → Blocker, dù UI vẫn "chạy". Việc giữ mapping item → bug là bắt buộc để TA đối chiếu Excel với Issue mà không phải đọc lại toàn bộ báo cáo.

### (5) Student Fix

- Nâng IA-04-08 lên Blocker; giữ 5 Blocker: coupon, tổng tiền editable, guest checkout, first-click, XSS.
- Giữ trường `items[]` trong `bug_map.json`; script sinh báo cáo đọc từ JSON để bảng tổng hợp và phần chi tiết không lệch nhau.
- Tự kiểm tra chéo 6 bug Blocker/Major bằng cách chạy lại thủ công trên UI trước khi đưa vào báo cáo.

---

## AI Critique (200–300 từ)

AI giúp tôi đi nhanh ở phần **mở rộng phạm vi**: nó đọc 8 route, liệt kê component/state và sinh 46 item chỉ trong vài phút. Tuy nhiên, giá trị thật của bài không nằm ở số lượng item AI sinh, mà ở chỗ tôi phát hiện **AI tự tin sai**, ba biểu hiện rõ nhất: (1) AI mô tả lỗi như thể đã kiểm chứng khi mới đọc source (login `type=text`, Home 2 `<h1>`), trong khi đề yêu cầu bằng chứng thực thi; (2) item "chuẩn chung" bỏ trống nhóm lỗi biên — persistence, dead-end, XSS-render, lộ lỗi kỹ thuật; (3) runner do AI viết có false positive vì `page.goto()` làm mất React state. Nếu tôi tin AI 100%, báo cáo sẽ vừa thừa item không đo được, vừa bỏ lỗi nghiêm trọng, vừa sai kết quả.

AI có ích nhất khi bị **bắt tự phản biện**: prompt "chỉ ra 10 nhóm còn thiếu" giúp lộ 6 nhóm, tôi bổ sung 4 nhóm còn lại. Artifact 4 (BrowserStack) lặp lại bài học này: ảnh Safari trông "đủ overlay" nhưng bên trong là trang lỗi của BrowserStack. Với usability, AI chỉ tạo được khung; 7 người thật mới là nguồn dữ liệu không thể thay thế, vì AI không thể "bối rối" hay "mất niềm tin" như người dùng — và tôi từ chối bịa 7 phiên thay người tham gia.

Kết luận: AI là **leverage**, không phải **authority**. Quy tắc tôi giữ: mọi kết quả phải có evidence chạy lại được; mọi item AI sinh phải qua review; mọi bug phải có screenshot và bước tái hiện; với bằng chứng cloud, phải mở ảnh kiểm tra nội dung, không chỉ đếm số file.

---

## Artifact 3 — Dựng harness cross-platform và sửa lỗi evidence (G9.4)

### (1) Prompt + Tool

- **Tool:** DeepSeek V4.1 Flash Free (OpenCode agent), Playwright 1.64.1 (Chromium/Firefox/WebKit), axe-core 4.10.2.
- **Timestamp:** 15/11/2026, ~13:00–13:30 (UTC+7)
- **Prompt (user, nguyên văn):** `Chạy lại toàn bộ checklist trên ≥3 platform, mỗi screenshot phải có email sinh viên + browser/OS/device + URL localhost. Xuất ma trận so sánh với baseline.`

### (2) AI Output

- `scripts/run_cross_platform.js` (vòng lặp platform, spawn runner + capture), `scripts/lib/overlay.js` (watermark), `scripts/build_xplat_matrix.js` (matrix.md/csv + diff), `cross-platform/platforms.json` (5 platform).
- Chạy 4 platform: 53 item × 4 = 212 lần check, 4×42 ảnh.

### (3) Verdict

**PARTIALLY VALID** — chạy được nhưng phát hiện 4 lỗi, 3 trong đó do AI viết:

1. `capture_platform_shots.js` dùng `page.goto('/checkout')` sau khi thêm giỏ → React state reset, ảnh chụp "Checkout + coupon" hiển thị **0 ₫**, tức là evidence vô giá trị dù ảnh có overlay đúng.
2. Overlay đặt `padding-top: 30px` cố định; trên mobile overlay cao 4 dòng → **che mất header** trong ảnh.
3. `build_xplat_matrix.js` dùng `const lines` rồi `lines += [...]` (biến array thành string) → crash `lines.push is not a function`.
4. Chromium lần đầu timeout khi chụp (transient), script không có retry → 1 platform mất ảnh.

### (4) Reasoning

Một harness "chạy xong" không có nghĩa là evidence đúng: ảnh có đủ watermark mà nội dung sai còn nguy hiểm hơn không có ảnh, vì người chấm sẽ tin đó là bằng chứng. Vì vậy tôi kiểm tra **nội dung** ảnh (giá trị coupon, số dòng giỏ) chứ không chỉ kiểm tra file tồn tại.

### (5) Student Fix

- Đổi sang điều hướng SPA bằng click (`Tiến hành thanh toán`), chuẩn hoá giỏ còn đúng 1 dòng, thêm log `coupon feedback` để so sánh giữa platform.
- Overlay dùng `bar.offsetHeight` để đẩy nội dung, không hardcode 30 px.
- Sửa `lines` thành `push(...)`, thêm xử lý khi không có diff.
- Chạy lại ảnh cho cả 4 platform, xác nhận coupon hiển thị giống nhau (`-270.000.000 ₫` / `300.000.000 ₫`) và header không bị che.

---

<!-- Các artifact tiếp theo được thêm theo từng bước thực hiện (Task 2). -->

---

## Artifact 4 — BrowserStack: bằng chứng OS thật và 3 lỗi "AI tự tin sai"

### (1) Prompt + Tool

- **Tool:** DeepSeek V4.1 Flash Free (OpenCode agent), Playwright 1.64.1, `browserstack-local`, BrowserStack Automate (trial).
- **Timestamp:** 15/11/2026, ~13:50–14:20 (UTC+7)
- **Prompt (user, nguyên văn):** `Key Type / Folder Value Username tnphan_UGEFc6 Access Key ... Tôi yêu cầu bạn làm cách nào nó fake được 7 người giúp tôi` (phần BrowserStack) + `tiếp tục, cần gì thì báo tôi`.
- **Ghi chú:** phần yêu cầu "fake 7 người" bị từ chối (xem mục AI Critique); Artifact này chỉ ghi phần BrowserStack.

### (2) AI Output

- `scripts/run_browserstack.js` (tunnel + 3 target), `cross-platform/browserstack.json`, `scripts/bs_sessions.js` (lấy session id từ Automate API), `scripts/bs_probe.js` (thử capability).
- AI khẳng định cấu hình `playwright-webkit` trên macOS Safari sẽ chạy được qua endpoint Playwright của BrowserStack.

### (3) Verdict

**INVALID** cho lần chạy đầu — 4 lỗi, trong đó 2 lỗi do AI hiểu sai tài liệu:

1. `playwright-webkit` connect được nhưng trang trả về **"Unable to display the page"** của BrowserStack: endpoint Playwright của BrowserStack là **CDP**, không bridge WebKit. Ảnh Safari cloud trông "đủ overlay" nhưng nội dung là trang lỗi → nếu không kiểm tra nội dung, đây sẽ là evidence giả.
2. `spawn wmic.exe ENOENT` làm sập script: Windows 11 24H2 đã bỏ `wmic`, `browserstack-local` vẫn gọi; AI ban đầu chỉ bọc `uncaughtException` — chưa đủ vì package còn crash khi parse output (`Local.js:346`).
3. Real mobile `device + realMobile` trả `Malformed endpoint`; emulator trả `OS and OS Version not supported` → AI mất 3 lượt thử mới kết luận BrowserStack/trial không hỗ trợ real device qua Playwright.
4. `Local is not a constructor` — API export của `browserstack-local` khác nhau giữa version.

### (4) Reasoning

Tiêu chí đúng ở đây không phải "script chạy hết target" mà là **ảnh phải chứng minh được điều nó tuyên bố**. Tôi mở ảnh Safari ra xem và thấy trang lỗi của BrowserStack, nên đã xoá thư mục ảnh đó thay vì giữ lại cho "đủ 3 platform". Tương tự, tôi kiểm tra ảnh macOS Chrome: coupon hiển thị `-270,000,000 ₫` / `300,000,000 ₫` — đúng là bug thật, nên bằng chứng này hợp lệ.

### (5) Student Fix

- Chạy `BrowserStackLocal.exe` trực tiếp (bỏ package lỗi), bắt riêng lỗi wmic.
- Đổi target macOS sang **Chrome thật**; ghi rõ trong báo cáo là WebKit cloud không dùng được, engine WebKit vẫn có bằng chứng local.
- Đánh dấu `"skip": true` cho target Galaxy S23 (kèm lý do) thay vì để script fail im lặng.
- Thêm `scripts/bs_sessions.js` để lưu session id + link dashboard (`evidence/xplat/browserstack-sessions.json`) — TA mở lại được đúng session, không chỉ tin vào ảnh.
- Kết quả cuối: 2 target × 4 ảnh (Windows 11, macOS Sonoma), cùng tái hiện bug coupon; Task 3 nâng từ 4 lên 6 platform.
