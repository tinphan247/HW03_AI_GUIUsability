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

<!-- Các artifact tiếp theo được thêm theo từng bước thực hiện (G1…G9). -->
