# Task 1 — Thiết kế GUI Checklist (quy trình, review AI, gap-fill)

**Sinh viên:** Phan Trung Tin — 23120372
**SUT:** EShop — web `http://localhost:5173`, admin `http://localhost:5174`, API `http://localhost:3001`
**Phạm vi:** Cart · Checkout (coupon) · Login/Register (màn phụ: Home, Product Detail, ForgotPassword, Profile)
**Chuẩn tham chiếu:** SRS EShop v2.0 §8 — FR-21 (IA-01), FR-22 (IA-02), FR-23 (IA-03), FR-24 (IA-04)

---

## 1. Quy trình (4 bước, theo skill `gui-checklist-tester`)

| Bước | Việc làm | Ai làm | Output |
| :--- | :--- | :--- | :--- |
| 1 | Interface inventory: màn hình → component → state → map IA/FR | AI đọc DOM + sinh viên xác nhận | `evidence/inventory.json` + bảng §2 |
| 2 | Sinh item lần đầu theo 4 IA | AI | 46 item thô |
| 3 | Review: keep / merge / drop / rewrite | Sinh viên | §4 (10 quyết định) |
| 4 | Gap-fill: bổ sung item AI bỏ sót + lý do | Sinh viên | §5 (24 item) |

Kết quả cuối: **65 item** (41 do AI sinh, 24 do sinh viên bổ sung), phủ **4/4 IA**, chạy trên **9 màn hình**.

### Prompt đã dùng (rút gọn — full trong AI Audit)

**Prompt 1 — inventory, không sinh item vội:**
```text
Bạn là tester GUI. Với SUT EShop (React) ở các route /, /product/:id, /login,
/register, /forgot-password, /cart, /checkout, /profile:
1) Liệt kê component và state (default/loading/empty/error/success) từng màn.
2) Map mỗi thành phần về IA-01..IA-04 và FR-21..FR-24 của SRS.
3) KHÔNG sinh checklist item ở bước này. Chỉ xuất bảng inventory.
```
→ AI trả về bảng inventory (đã kiểm chứng lại bằng `scripts/inventory.js`).

**Prompt 2 — sinh item theo IA:**
```text
Từ inventory, sinh checklist item cho từng IA. Mỗi item phải: quan sát được,
có thể Fail, không trùng ý, có Expected + Spec ref + Method (automated/manual).
Không sinh item chung chung kiểu "giao diện đẹp/thân thiện".
```
→ AI trả 46 item. Sau review còn 41 (5 item bị drop/merge, xem §4).

**Prompt 3 — tự phản biện để tìm gap (sinh viên điều khiển):**
```text
Hãy tự chỉ ra 10 nhóm item mà bộ checklist trên còn thiếu, đặc biệt cho người
dùng biên (khiếm thị, mobile, RTL, dark mode, mạng chậm) và đặc thù SUT này.
```
→ AI chỉ ra được 6 nhóm; sinh viên bổ sung thêm 4 nhóm (persistence, dead-end,
lỗi kỹ thuật lộ ra UI, vòng đời thông báo) — xem §5.

---

## 2. Interface inventory (bước 1)

Đo bằng Playwright, không suy đoán từ code.

| Screen | Thành phần chính | State cần kiểm | IA liên quan |
| :--- | :--- | :--- | :--- |
| `/` Home | h1 ×2, search (placeholder-only), grid 5 card, ảnh alt rỗng, nút "Thêm vào giỏ" | loading / empty search / error API | IA-01, 02, 04 |
| `/product/:id` | h1 tên SP, ảnh có alt, input number (không min/step), nút thêm giỏ | first-click / added / not-found | IA-01, 02, 04 |
| `/login` | h2 "Đăng Ký", 2 input `type=text`, nút "Sign In" `tabindex=1`, lỗi dưới submit | default / error / locked / submitting | IA-01, 02, 04 |
| `/register` | h2, 3 input (email `text`), hint mật khẩu, nút đỏ | default / error / success | IA-01, 02, 04 |
| `/forgot-password` | h2, 1 input, nút "Lấy mã OTP" | bước 1 / bước 2 | IA-02, 03 |
| `/cart` | empty state (chữ), bảng 5 cột, "Tổng tạm tính", nút xóa, nút thanh toán xanh lá | empty / có hàng / xóa | IA-01, 03, 04 |
| `/checkout` | danh sách SP, input tổng tiền editable, coupon box, nút xác nhận | guest / coupon ok / coupon lỗi / success | IA-01, 02, 03, 04 |
| `/profile` | form hồ sơ, bảng đơn + badge trạng thái, nút hủy | guest / có đơn / hủy | IA-02, 03, 04 |
| `/admin` (5174) | sidebar 6 tab, dashboard, CRUD, import CSV | login / từng tab / empty | IA-01, 03 |

**Phát hiện inventory đáng chú ý (dùng để chọn item):**
`html lang="en"`; Home có 2 `<h1>`; 5/5 ảnh sản phẩm `alt=""`; Login/Register không có `<h1>`, input không liên kết label; `/checkout` truy cập được khi chưa đăng nhập; `/profile` khi chưa đăng nhập là trang gần trắng.

---

## 3. Bộ checklist cuối (65 item)

| IA | Số item | Nội dung bao phủ |
| :--- | ---: | :--- |
| IA-01 General UI | 16 | heading, `lang`, ngôn ngữ, tiền/ngày, màu nút, alt, contrast, focus, responsive, zoom, dark, RTL, touch target |
| IA-02 Forms | 17 | dấu `*`, type email/password, label, vị trí lỗi, nội dung lỗi, step indicator, giữ dữ liệu, double-submit, quantity, tổng tiền, guest guard, autocomplete, placeholder, trim, confirm password, hint |
| IA-03 Navigation | 16 | active nav, badge, nhãn đăng xuất, breadcrumb, logo, link 404, quay lại mua sắm, route guard, persistence, scroll, exit sau success, admin tab, mobile nav, nhãn icon, browser back, quay lại login |
| IA-04 Feedback/State | 16 | toast/badge, first-click, confirm xóa, empty cart/search, loading, error API, coupon ok/lỗi, nhãn trạng thái đơn, clear cart, XSS, lộ lỗi kỹ thuật, submit progress, confirm hủy đơn, dismiss thông báo |

Bảng đầy đủ + kết quả: `checklist/GUI_Checklist.xlsx` (sheet `Checklist`) và `checklist/execution_log.md`.

---

## 4. Review log — 10 item AI sinh bị drop/merge/rewrite

| # | Item AI sinh | Quyết định | Lý do |
| :--- | :--- | :--- | :--- |
| 1 | "Kiểm tra tất cả ảnh có alt" | **Rewrite** → IA-01-09 (Home) | Item gốc không nêu màn hình/cách đếm; SUT chỉ có ảnh ở Home + Product Detail. |
| 2 | "Kiểm tra responsive mobile/tablet/desktop" | **Merge** → IA-01-12 + IA-03-13 | Tách thành overflow 375px (đo được) và nav mobile (quan sát được); bỏ tablet vì app không có layout riêng. |
| 3 | "Kiểm tra tiêu đề trang có ý nghĩa" | **Merge** → IA-01-01/02 | Trùng với đếm `<h1>`; giữ tiêu chí đo được. |
| 4 | "Kiểm tra thông báo lỗi có màu đỏ" | **Merge** → IA-02-05/06 | Màu đỏ là chi tiết thẩm mỹ; nội dung + vị trí lỗi mới là yêu cầu FR-22. |
| 5 | "Kiểm tra breadcrumb ở tất cả các trang" | **Rewrite** → IA-03-04 | FR-23 chỉ yêu cầu breadcrumb ở trang con; kiểm tra cả trang chủ sẽ fail sai spec. |
| 6 | "Kiểm tra tất cả nút có hover state" | **Drop** | Không map vào IA-01..04 của đề, gần như luôn Pass, không tạo giá trị. |
| 7 | "Kiểm tra font chữ dễ đọc" | **Drop** | Tiêu chí chủ quan, không đo được, trùng mục đích với contrast/focus. |
| 8 | "Kiểm tra form có nút Reset" | **Drop** | SRS không yêu cầu; thêm vào sẽ là bịa yêu cầu. |
| 9 | "Kiểm tra đăng nhập bằng Google/Facebook" | **Drop** | Không có trong SRS và không tồn tại trên UI. |
| 10 | "Kiểm tra footer có link chính sách" | **Drop** | Footer SUT chỉ có dòng copyright; không có yêu cầu tương ứng. |

---

## 5. Gap-fill — 24 item sinh viên bổ sung và lý do AI bỏ sót

Phân nhóm lý do (dùng thống kê ở sheet `AI vs Human`):

| Nhóm lý do | Số item | Item tiêu biểu |
| :--- | ---: | :--- |
| (a) Prompt/scope của AI hẹp (chỉ làm đúng màn được nêu) | 4 | IA-01-02 (mọi trang), IA-02-15 (trim), IA-03-10 (scroll), IA-04-16 (dismiss) |
| (b) AI thiên về "nhìn thấy" — bỏ accessibility/đo lường | 8 | IA-01-03 (`lang`), IA-01-10 (contrast), IA-01-11 (focus), IA-01-13 (zoom), IA-01-16 (touch), IA-02-04 (label), IA-02-13 (autocomplete), IA-02-14 (placeholder) |
| (c) AI bỏ qua người dùng biên / thị trường khác | 3 | IA-01-14 (dark mode), IA-01-15 (RTL), IA-03-14 (nhãn icon) |
| (d) Đặc thù SUT & trạng thái biên | 9 | IA-01-08 (ngày VN), IA-02-09 (double submit), IA-02-17 (hint), IA-03-08 (dead-end), IA-03-09 (persistence), IA-04-02 (first-click), IA-04-07 (error API), IA-04-12 (XSS render), IA-04-13 (lộ lỗi) |

Chi tiết từng item + `whyMissed` đầy đủ: `checklist/checklist_items.json` (trường `whyMissed`) và sheet `AI vs Human` trong Excel.

### 5.1 Giải thích sâu 5 item quan trọng

1. **IA-01-11 Focus visible** — AI sinh "tab order đúng thứ tự" nhưng không kiểm tra *có nhìn thấy focus hay không*. Đây là khác biệt giữa "điều hướng được" và "điều hướng được khi không dùng chuột". Lý do: AI không mô phỏng được trạng thái `:focus-visible`.
2. **IA-01-13 Zoom 200%** — AI chỉ nghĩ theo breakpoint. Người dùng khiếm thị dùng zoom trình duyệt, không phải thu nhỏ cửa sổ; reflow là yêu cầu WCAG 1.4.10.
3. **IA-03-09 Persistence** — AI kiểm tra thao tác trong một session. Giỏ hàng của SUT chỉ nằm trong React state, F5 là mất — lỗi chỉ lộ ra khi kiểm tra xuyên phiên.
4. **IA-04-12 XSS render** — AI tách "GUI" khỏi "security", nên bỏ qua việc chuỗi người dùng nhập được render thành HTML (lỗi vừa bảo mật vừa hiển thị sai).
5. **IA-04-02 First-click** — AI giả định control hoạt động đúng và chỉ kiểm tra "có phản hồi". SUT cố tình bỏ qua click đầu tiên ở Product Detail; phải kiểm tra *hành động có thực sự xảy ra*, không chỉ UI phản hồi.

---

## 6. Kết luận thiết kế

- 65 item > mức tối thiểu 40; mọi item đều map về FR-21…24 hoặc FR chức năng liên quan.
- 53 item kiểm tra tự động (Playwright/axe) → chạy lại được trên 3 platform ở Task 3; 12 item thủ công có screenshot.
- 24 item do sinh viên bổ sung, mỗi item có lý do AI bỏ sót (4 nhóm nguyên nhân).
- Không có item nào trùng ý hoặc không thể Fail; 10 item AI sinh đã bị loại/gộp trong review.
