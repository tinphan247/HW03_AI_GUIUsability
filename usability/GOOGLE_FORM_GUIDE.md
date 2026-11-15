# Dựng Google Form cho 7 phiên usability

> Bản **1 trang** (đúng như form đã dựng): toàn bộ hướng dẫn nằm trong **Form description**,
> phía dưới là 16 câu hỏi. Người tham gia mở 1 link là biết làm gì.
> Quan sát hành vi (nếu có moderator) vẫn ghi vào `usability/raw_sessions.txt`.

## 0. Kiểm tra form đã publish có bị chặn đăng nhập không

Mở link `.../viewform` **trong tab ẩn danh (Ctrl+Shift+N)**. Nếu hiện hộp
`Đăng nhập để tiếp tục` → người tham gia ngoài HCMUS **không vào được**, phải sửa:

| Cần tắt | Ở đâu |
| :--- | :--- |
| `Thu thập địa chỉ email` → **Không thu thập** | Cài đặt → Câu trả lời |
| `Giới hạn 1 câu trả lời` → **TẮT** | Cài đặt → Câu trả lời |
| `Hạn chế đối với người dùng trong HCMUS…` → **TẮT** | Cài đặt → Câu trả lời (chỉ hiện với tài khoản trường) |

Nếu 3 mục trên bị **khoá** (biểu tượng ổ khoá) → chính sách trường bắt buộc thu thập email:
tạo lại form bằng **tài khoản Gmail cá nhân**, dán lại description + 16 câu.

## 1. Form description (dán nguyên khối)

```text
Cảm ơn bạn đã dùng thử trang bán hàng này. Form này KHÔNG chấm điểm đúng/sai —
câu trả lời của bạn giúp mình cải thiện giao diện. Dữ liệu chỉ dùng cho bài tập môn học;
số điện thoại/email sẽ được che bớt khi báo cáo. Bạn có thể dừng tham gia bất cứ lúc nào.

1) MỞ TRANG NÀY Ở TAB MỚI:
https://eshop-sut-snowy.vercel.app/
Lần đầu mở có thể chậm ~1 phút (server khởi động) — chờ nhé, đừng refresh liên tục.

2) NHIỆM VỤ (làm như người mua hàng bình thường):
   • Tạo một tài khoản MỚI (email bất kỳ, mật khẩu giả cũng được)
   • Tìm một chiếc điện thoại phù hợp cho công việc, ngân sách dưới 50 triệu
   • Thêm vào giỏ hàng
   • Áp mã giảm giá: SAVE10
   • Thanh toán
   • Kiểm tra lại rằng đơn hàng đã được ghi nhận trong tài khoản của bạn

3) CÁCH LÀM:
   • Nếu đang gọi video với người mời: nói to suy nghĩ khi thao tác
   • Nếu tự làm: để ý chỗ nào bạn thấy khó chịu, chậm, hoặc rối
   • Không xong cũng không sao — cứ trả lời thật

4) ĐỪNG ĐÓNG TAB FORM NÀY.
   Cứ để form ở tab này, mở trang web ở tab khác và làm nhiệm vụ.
   Làm xong (hoặc quyết định dừng) → quay lại tab này điền tiếp và bấm "Gửi".
```

## 2. 16 câu hỏi (theo đúng thứ tự form hiện tại)

> **Không có câu "mã phiên P1…P7".** Người tham gia không phải nhớ/gõ mã — định danh lấy từ
> **họ tên + SĐT** họ tự điền (thứ họ biết sẵn). Script tự đánh `P1…P7` theo thứ tự response
> và che thông tin khi ghi `participants.csv`.

| # | Câu | Kiểu | Required |
| :-: | :--- | :--- | :-: |
| 1 | `Tôi đồng ý tham gia (dữ liệu dùng cho bài tập - thông tin liên hệ được che)` | Checkboxes (`Đồng ý`) | ✅ |
| 2 | `Họ tên hoặc biệt danh của bạn (báo cáo chỉ dùng mã P1 - P7 - tên sẽ được che)` | Short answer | ✅ |
| 3 | `Số điện thoại hoặc Zalo liên hệ: (Dùng để Trợ giảng xác minh ngẫu nhiên bạn có tham gia test thật, sẽ được che 4 số giữa trong báo cáo nộp)` | Short answer | ✅ |
| 4 | `Tuổi của bạn` | Short answer | ✅ |
| 5 | `Bạn hoàn thành tác vụ (tạo tài khoản → mua điện thoại → áp mã SAVE10 → thanh toán → xem lại đơn) thế nào?` | Multiple choice (3 lựa chọn) | ✅ |
| 6 | `Điều bạn muốn thay đổi nhất trên trang này là gì? (không bắt buộc)` | Paragraph | ☐ |
| 7–16 | `SUS Q1` … `SUS Q10` | Linear scale 1→5 | ✅ |

Nội dung 10 câu SUS (**tên câu phải chứa `SUS Q1`…`SUS Q10`** — script đọc theo tên):

```text
SUS Q1  — Tôi nghĩ mình sẽ muốn dùng hệ thống này thường xuyên.
SUS Q2  — Tôi thấy hệ thống phức tạp một cách không cần thiết.
SUS Q3  — Tôi thấy hệ thống dễ sử dụng.
SUS Q4  — Tôi nghĩ mình cần người có chuyên môn hỗ trợ mới dùng được hệ thống.
SUS Q5  — Tôi thấy các chức năng của hệ thống được tích hợp tốt.
SUS Q6  — Tôi thấy hệ thống có quá nhiều điểm không nhất quán.
SUS Q7  — Tôi nghĩ hầu hết mọi người sẽ học dùng hệ thống này rất nhanh.
SUS Q8  — Tôi thấy hệ thống rất khó sử dụng.
SUS Q9  — Tôi cảm thấy tự tin khi dùng hệ thống.
SUS Q10 — Tôi cần học nhiều thứ trước khi có thể dùng hệ thống.
```

## 3. Nên thêm 2 câu (vẫn ~1 phút, script đọc sẵn)

Không có moderator thì **không ai đo thời gian** — thêm câu này để có số liệu time-on-task:

| Vị trí | Câu | Kiểu | Required |
| :--- | :--- | :--- | :-: |
| sau câu 6 | `Tổng thời gian bạn mất từ lúc bắt đầu đến khi xong (phút:giây - ví dụ 4:30)` | Short answer | ✅ |
| sau câu 6 | `Thiết bị bạn dùng (ví dụ: Laptop Windows + Chrome / iPhone + Safari)` | Short answer | ✅ |

Script map theo từ khoá `tổng thời gian` và `thiết bị` → tự vào cột `time_seconds`, `device`.
Không thêm cũng chạy được, chỉ là báo cáo thiếu time-on-task và thiếu dữ liệu thiết bị.

## 4. Confirmation message (Cài đặt → Trình bày)

```text
Cảm ơn bạn rất nhiều! 🙏
Nếu giảng viên/trợ giảng gọi hỏi xác minh (khoảng 1 phút), bạn xác nhận giúp mình
là đã tham gia buổi dùng thử này nhé. Chúc bạn một ngày tốt lành!
```

## 5. Gửi + lấy dữ liệu

- **Gửi** → lấy link `.../viewform` → gửi 1 link duy nhất (hướng dẫn đã nằm trong form).
- Responses → **Xem trong Trang tính** → File → Tải xuống → **CSV** → lưu `usability/gform_responses.csv`.
- Chạy:

```powershell
python scripts\gform_to_csv.py --dry-run
python scripts\gform_to_csv.py
python scripts\sus_score.py
```

## 6. Checklist trước khi gửi (1 phút)

- [ ] Mở link bằng tab ẩn danh → **không** hiện "Đăng nhập để tiếp tục".
- [ ] Mở link bằng điện thoại → link `eshop-sut-snowy.vercel.app` bấm được.
- [ ] Câu SUS Q9 chỉ có 1 câu, không dính chữ Q8.
- [ ] 10 câu SUS đều Linear scale 1–5 + required.
- [ ] Gửi thử 1 response của chính bạn → tải CSV → chạy `--dry-run` thấy map đúng cột → xoá response thử.
