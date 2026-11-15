# Task scenario (đọc nguyên văn cho người tham gia)

> Không đọc phần "Ghi chú cho moderator". Không nhắc tên nút, không nhắc đường dẫn, không nói thứ tự bước.

---

## Scenario

**Bối cảnh:** Bạn vừa chuyển sang dùng một trang bán hàng công nghệ mới. Bạn cần mua một chiếc điện thoại cho công việc và muốn dùng một mã giảm giá bạn được tặng.

**Mục tiêu:** Hãy tạo một tài khoản mới trên trang, tìm một chiếc điện thoại phù hợp, thêm vào giỏ, áp mã giảm giá **SAVE10**, hoàn tất đặt hàng, rồi kiểm tra lại rằng đơn hàng đã được ghi nhận trong tài khoản của bạn.

**Ràng buộc:**

- Ngân sách dự kiến: dưới 50 triệu.
- Mã giảm giá: **SAVE10**.
- Bạn muốn nhận hàng tại nhà, dùng địa chỉ bất kỳ (không cần đúng thật).
- Hãy nói to những gì bạn đang nghĩ trong lúc làm.

**Bắt đầu từ:** trang chủ đang mở sẵn (http://localhost:5173).

**Thời gian tối đa:** 15 phút. Không có đáp án đúng/sai; nếu bí, bạn cứ nói ra.

---

## Ghi chú cho moderator (KHÔNG đọc cho người tham gia)

- [ ] Không nhắc tên nút/đường dẫn.
- [ ] Không hướng dẫn thứ tự bước.
- [ ] Chỉ can thiệp sau **60 giây** bí; ghi lại thời điểm + lý do.
- [ ] Nếu người tham gia hỏi "có phải bấm cái này không?", trả lời: "Bạn thử cách bạn nghĩ là hợp lý nhất."
- [ ] Nếu app lỗi (F5 mất giỏ, coupon sai số), **không sửa giúp**; ghi nhận và để người tham gia xử lý.
- [ ] Nhắc người tham gia nói to khi họ im lặng > 15 giây: "Bạn đang nghĩ gì vậy?"

## Điểm quan sát bắt buộc (không gợi ý)

| Bước | Điều cần quan sát |
| :--- | :--- |
| Đăng ký | Có tìm thấy form không? Có nhận ra mật khẩu đang hiện ký tự không? Có bối rối vì "Sign In"/"Username" không? |
| Tìm sản phẩm | Dùng tìm kiếm hay cuộn? Có nhận ra nút "Xem chi tiết" không? |
| Thêm giỏ | Có bấm lại lần 2 vì không thấy phản hồi? Có để ý badge giỏ không tồn tại? |
| Coupon | Có đọc số tiền giảm không? Phản ứng khi thấy số âm/giá tăng? Có thử mã khác? |
| Thanh toán | Có sửa ô tổng tiền không? Có nhận ra mình đang trả bao nhiêu? |
| Lịch sử đơn | Có tìm được đơn không? Có tin đơn đã ghi nhận không? |

## Success criteria

| Mức | Định nghĩa |
| :--- | :--- |
| **Success** | Hoàn thành cả 6 bước không cần trợ giúp; thấy đơn trong lịch sử |
| **Success with help** | Hoàn thành nhưng cần ≥ 1 lần trợ giúp, hoặc bỏ qua 1 bước phụ (ví dụ không áp coupon) |
| **Failure** | Không hoàn thành trong 15 phút, hoặc không xác nhận được đơn đã tạo |
