# Execution log — GUI Checklist

**Ngày:** 15/11/2026  
**SUT:** EShop — web `http://localhost:5173`, admin `http://localhost:5174`  
**Công cụ:** Playwright 1.64.1 (Chromium) + axe-core 4.10.2 + kiểm tra thủ công có screenshot.

| ID | Aspect | Screen | Result | Evidence | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| IA-01-01 | IA-01 | Home | **Failed** | [IA-01-01.png](screenshots/checklist/IA-01-01.png) | Trang chủ có 2 thẻ <h1>: Danh sách sản phẩm \| Hiển thị 5 sản phẩm |
| IA-01-02 | IA-01 | Tất cả trang | **Failed** | [IA-01-02.png](screenshots/checklist/IA-01-02.png) | Sai số lượng <h1>: /=2 h1 (heading đầu: H1); /login=0 h1 (heading đầu: H2); /register=0 h1 (heading đầu: H2); /forgot-password=0 h1 (heading đầu: H2); /cart=0 h1 (heading đầu: H2); /profile=0 h1 (heading đầu: none) |
| IA-01-03 | IA-01 | Global | **Failed** | [IA-01-03.png](screenshots/checklist/IA-01-03.png) | html lang="en" trong khi nội dung là tiếng Việt |
| IA-01-04 | IA-01 | Tất cả trang | **Failed** | [manual-IA-01-04-login-language.png](screenshots/checklist/manual-IA-01-04-login-language.png) | Nhãn chức năng trộn tiếng Anh: /login hiển thị "Username", "Sign In" cạnh "Đăng Ký"; admin hiển thị "Admin Login", "Login". |
| IA-01-05 | IA-01 | Home, Cart, Checkout | **Failed** | [IA-01-05.png](screenshots/checklist/IA-01-05.png) | Home dùng "VND" (30,000,000 VND), Cart dùng "₫" — không nhất quán đơn vị |
| IA-01-06 | IA-01 | Global | **Failed** | [manual-IA-01-06-register-primary.png](screenshots/checklist/manual-IA-01-06-register-primary.png) | Nút hành động chính không dùng một màu: "Đăng Ký" đỏ rgb(239,68,68), "Tiến hành thanh toán" xanh lá rgb(34,197,94), "Cập nhật" xanh dương — không theo FR-21 (primary = blue-600). |
| IA-01-07 | IA-01 | Global | **Failed** | [manual-IA-01-07-cart-buttons.png](screenshots/checklist/manual-IA-01-07-cart-buttons.png) | Nút phá hủy "Xóa" trong giỏ là text button không nền (rgba(0,0,0,0)), không dùng màu đỏ như "Hủy đơn" — người dùng dễ bấm nhầm. |
| IA-01-08 | IA-01 | Profile | **Failed** | [IA-01-08.png](screenshots/checklist/IA-01-08.png) | Ngày hiển thị "11/15/2026" theo M/D/YYYY (tháng=11, ngày=15), không phải dd/mm/yyyy |
| IA-01-09 | IA-01 | Home | **Failed** | [IA-01-09.png](screenshots/checklist/IA-01-09.png) | 5/5 ảnh có alt rỗng (ví dụ: png?text=iPhone+15) |
| IA-01-10 | IA-01 | Global | **Failed** | [IA-01-10.png](screenshots/checklist/IA-01-10.png) | 6 node vi phạm color-contrast (ví dụ: <p class="text-red-500 font-bold mb-2">30,000,000 VND</p>) |
| IA-01-11 | IA-01 | Global | **Passed** | — | focus trên BUTTON có outline/box-shadow |
| IA-01-12 | IA-01 | Home, Cart, Checkout | **Passed** | — |  |
| IA-01-13 | IA-01 | Checkout, Cart | **Passed** | — |  |
| IA-01-14 | IA-01 | Global | **Passed** | — | Không có dark theme; nền vẫn sáng (rgba(0, 0, 0, 0)) và không phát sinh thêm lỗi contrast so với light (6 node). |
| IA-01-15 | IA-01 | Cart, Checkout | **Passed** | — |  |
| IA-01-16 | IA-01 | Home, Cart (mobile) | **Failed** | [IA-01-16.png](screenshots/checklist/IA-01-16.png) | 15 control < 44px (ví dụ "EShop": 70×32) |
| IA-02-01 | IA-02 | Login, Register, Checkout | **Failed** | [IA-02-01.png](screenshots/checklist/IA-02-01.png) | Thiếu dấu * ở 5 trường: /login: "(không nhãn)", /login: "(không nhãn)", /register: "(không nhãn)" |
| IA-02-02 | IA-02 | Login, Register | **Failed** | [IA-02-02.png](screenshots/checklist/IA-02-02.png) | Không có input type=email — /login: types=[text,text]; /register: types=[text,text,password] |
| IA-02-03 | IA-02 | Login | **Failed** | [IA-02-03.png](screenshots/checklist/IA-02-03.png) | Ô mật khẩu ở /login có type="text" — ký tự hiện rõ |
| IA-02-04 | IA-02 | Tất cả form | **Failed** | [IA-02-04.png](screenshots/checklist/IA-02-04.png) | 8 input không có label liên kết: /login: "", /login: "", /register: "", /register: "" |
| IA-02-05 | IA-02 | Login, Register | **Failed** | [IA-02-05.png](screenshots/checklist/IA-02-05.png) | Lỗi nằm dưới nút submit ("Đăng nhập thất bại. Vui lòng kiểm tra lại.") |
| IA-02-06 | IA-02 | Login, Register | **Failed** | [manual-IA-02-06-login-error.png](screenshots/checklist/manual-IA-02-06-login-error.png) | Lỗi đăng nhập chỉ nói "Đăng nhập thất bại. Vui lòng kiểm tra lại." — không chỉ ra trường nào sai (email không tồn tại hay mật khẩu sai) và không có cách sửa. |
| IA-02-07 | IA-02 | ForgotPassword | **Failed** | [IA-02-07.png](screenshots/checklist/IA-02-07.png) | Không có step indicator ("Bước 1/2") ở bước lấy OTP |
| IA-02-08 | IA-02 | Login | **Passed** | — |  |
| IA-02-09 | IA-02 | Login, Register, Checkout | **Failed** | [IA-02-09.png](screenshots/checklist/IA-02-09.png) | Nút vẫn enabled và giữ nhãn "Sign In" ngay sau khi bấm — có thể submit 2 lần |
| IA-02-10 | IA-02 | ProductDetail | **Failed** | [IA-02-10.png](screenshots/checklist/IA-02-10.png) | Ô số lượng thiếu ràng buộc (min=null, step=null) |
| IA-02-11 | IA-02 | Checkout | **Failed** | [IA-02-11.png](screenshots/checklist/IA-02-11.png) | Tổng tiền là input number editable (không readonly/disabled) |
| IA-02-12 | IA-02 | Checkout | **Failed** | [IA-02-12.png](screenshots/checklist/IA-02-12.png) | Người chưa đăng nhập vẫn thấy form thanh toán đầy đủ (không bị chặn) |
| IA-02-13 | IA-02 | Login, Register, Checkout | **Failed** | [IA-02-13.png](screenshots/checklist/IA-02-13.png) | Thiếu autocomplete: /login input#0 (text), /login input#1 (text), /register input#0 (text), /register input#1 (text), /register input#2 (password) |
| IA-02-14 | IA-02 | Home | **Failed** | [IA-02-14.png](screenshots/checklist/IA-02-14.png) | Ô tìm kiếm chỉ có placeholder "Tìm kiếm...", không có label/aria-label |
| IA-02-15 | IA-02 | Login, Register | **Failed** | [IA-02-15.png](screenshots/checklist/IA-02-15.png) | Email có khoảng trắng đầu/cuối bị từ chối (không trim trước khi gửi) |
| IA-02-16 | IA-02 | Register | **Failed** | [IA-02-16.png](screenshots/checklist/IA-02-16.png) | Chỉ có 1 trường mật khẩu — thiếu "Xác nhận mật khẩu" (FR-01) |
| IA-02-17 | IA-02 | Register | **Passed** | — | Register có hint ngay dưới field: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt." |
| IA-03-01 | IA-03 | Global header | **Passed** | — |  |
| IA-03-02 | IA-03 | Global header | **Failed** | [IA-03-02.png](screenshots/checklist/IA-03-02.png) | Link "Giỏ hàng" không có badge số lượng (nav text: "Giỏ hàng \| Đăng nhập \| Đăng ký") |
| IA-03-03 | IA-03 | Global header | **Failed** | [IA-03-03.png](screenshots/checklist/IA-03-03.png) | Nút đăng xuất có nhãn "Thoát" (FR-23 yêu cầu "Đăng xuất") |
| IA-03-04 | IA-03 | Cart, Checkout, ProductDetail | **Failed** | [IA-03-04.png](screenshots/checklist/IA-03-04.png) | Không có breadcrumb ở: /cart, /checkout, /product/1 |
| IA-03-05 | IA-03 | Global header | **Passed** | — |  |
| IA-03-06 | IA-03 | Global header | **Passed** | — |  |
| IA-03-07 | IA-03 | Cart | **Passed** | — |  |
| IA-03-08 | IA-03 | Profile | **Passed** | — |  |
| IA-03-09 | IA-03 | Cart, Profile | **Failed** | [IA-03-09.png](screenshots/checklist/IA-03-09.png) | Sau F5 giỏ hàng trống — giỏ chỉ lưu trong React state, không persist |
| IA-03-10 | IA-03 | Global | **Passed** | — |  |
| IA-03-11 | IA-03 | Checkout success | **Passed** | — |  |
| IA-03-12 | IA-03 | Admin sidebar | **Passed** | — | Tab "Sản phẩm" đang chọn có class text-blue-400, khác 6 tab còn lại (hover:text-blue-300). |
| IA-03-13 | IA-03 | Global mobile 375px | **Passed** | — | Ở 375×812 nav rộng 232/232 px, 3 link hiển thị đủ, không cần scroll ngang (h1 bị wrap hẹp — đã ghi ở IA-01-12). |
| IA-03-14 | IA-03 | Cart | **Passed** | — | Không có control icon-only ở /cart: mọi link/button đều có text hiển thị (danh sách control thiếu text = rỗng). |
| IA-03-15 | IA-03 | Global | **Passed** | — | Từ /product/1 bấm Back → về http://localhost:5173/ đúng trang trước, không vòng lặp. |
| IA-03-16 | IA-03 | ForgotPassword | **Passed** | — |  |
| IA-04-01 | IA-04 | Home | **Failed** | [IA-04-01.png](screenshots/checklist/IA-04-01.png) | Không có toast/badge sau khi thêm vào giỏ; người dùng không biết thao tác đã thành công |
| IA-04-02 | IA-04 | ProductDetail | **Failed** | [IA-04-02.png](screenshots/checklist/IA-04-02.png) | Click đầu tiên vào "Thêm vào giỏ hàng" không thêm gì (cart vẫn trống) — phải click 2 lần |
| IA-04-03 | IA-04 | Cart | **Failed** | [IA-04-03.png](screenshots/checklist/IA-04-03.png) | Click "Xóa" xóa ngay không hỏi xác nhận — item đã bị xóa khỏi giỏ |
| IA-04-04 | IA-04 | Cart | **Failed** | [IA-04-04.png](screenshots/checklist/IA-04-04.png) | Empty state chỉ có chữ "Giỏ hàng của bạn đang trống", không có icon/hình minh họa (SVG/IMG=0) |
| IA-04-05 | IA-04 | Home | **Failed** | [IA-04-05.png](screenshots/checklist/IA-04-05.png) | Không có empty state; trang chỉ còn tiêu đề + dòng "Kết quả tìm kiếm cho: …", không thông báo 0 kết quả |
| IA-04-06 | IA-04 | Home, Profile | **Failed** | [IA-04-06.png](screenshots/checklist/IA-04-06.png) | Trong 2.5s chờ API không có loading indicator; chỉ hiện tiêu đề và lưới trống |
| IA-04-07 | IA-04 | Home | **Failed** | [IA-04-07.png](screenshots/checklist/IA-04-07.png) | Khi API bị chặn, trang không có thông báo lỗi hay nút thử lại (im lặng thất bại) |
| IA-04-08 | IA-04 | Checkout | **Failed** | [IA-04-08.png](screenshots/checklist/IA-04-08.png) | Feedback hiển thị giảm "-270,000,000 ₫" và thành tiền "300,000,000 ₫" — số tiền giảm âm/lớn hơn tổng, gây hiểu sai |
| IA-04-09 | IA-04 | Checkout | **Passed** | — | {"KHONGCO":"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa","EXPIRED":"Mã giảm giá đã hết hạn"} |
| IA-04-10 | IA-04 | Profile | **Passed** | — | Trạng thái dịch tiếng Việt và phân biệt màu: "Chờ xác nhận" vàng, "Đã giao" xanh lá, "Đã hủy" đỏ. |
| IA-04-11 | IA-04 | Checkout success | **Failed** | [IA-04-11.png](screenshots/checklist/IA-04-11.png) | Sau khi thanh toán thành công, giỏ hàng vẫn còn sản phẩm (clearCart không được gọi) |
| IA-04-12 | IA-04 | Home | **Failed** | [IA-04-12.png](screenshots/checklist/IA-04-12.png) | Chuỗi "<b>abc</b>" được render thành HTML (<b> xuất hiện 1 lần) — dangerouslySetInnerHTML |
| IA-04-13 | IA-04 | Checkout, Profile | **Failed** | [IA-04-13.png](screenshots/checklist/IA-04-13.png) | Lộ chi tiết kỹ thuật trong thông báo: "Lỗi khi thanh toán: Network Error" |
| IA-04-14 | IA-04 | Login, Register | **Failed** | [manual-IA-04-14-submit-state.png](screenshots/checklist/manual-IA-04-14-submit-state.png) | Sau khi bấm "Sign In", nhãn nút giữ nguyên "Sign In", không có spinner/"Đang đăng nhập…" — không có phản hồi đang xử lý. |
| IA-04-15 | IA-04 | Profile | **Failed** | [IA-04-15.png](screenshots/checklist/IA-04-15.png) | Bấm "Hủy đơn" gọi API ngay (dialog xuất hiện sau request chỉ là alert kết quả), không có bước xác nhận |
| IA-04-16 | IA-04 | Global | **Failed** | [manual-IA-04-16-no-toast.png](screenshots/checklist/manual-IA-04-16-no-toast.png) | Không có toast/banner thành công nào trên UI (hasToast=false) và không có nút đóng (hasCloseButton=false); các thông báo inline như coupon thành công chỉ mất khi người dùng sửa input. |

## Tổng hợp

- Tổng item: **65**
- Passed: **21**
- Failed: **44**
- Not executed: **0**

> Ghi chú: item Failed luôn có screenshot trong `screenshots/checklist/`; item Passed không chụp (theo yêu cầu đề bài).