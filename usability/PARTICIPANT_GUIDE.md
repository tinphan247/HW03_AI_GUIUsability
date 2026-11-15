# Hướng dẫn cho người tham gia (gửi kèm link form)

> File này là **tin nhắn bạn gửi cho từng người** trước phiên. Copy phần trong khung,
> điền tên bạn + link form + mã phiên vào chỗ `...`.

## Bản gửi qua Messenger/Zalo (trước phiên 1 ngày)

```text
Chào [tên], cảm ơn bạn đã nhận giúp mình 🙏

THỜI GIAN: [ngày/giờ], mất khoảng 25 phút (20 phút dùng thử + 5 phút trả lời).
BẠN CẦN: 1 máy tính hoặc điện thoại có trình duyệt + tai nghe/kênh audio.
MÃ PHIÊN CỦA BẠN: P_  (nhớ số này, điền vào form ở bước cuối)

Bạn sẽ làm 1 việc như người mua hàng thật trên một trang bán điện thoại:
tạo tài khoản → tìm 1 chiếc điện thoại phù hợp công việc (ngân sách dưới 50 triệu)
→ thêm vào giỏ → dùng mã giảm giá SAVE10 → thanh toán → kiểm tra đơn trong tài khoản.

KHÔNG có đáp án đúng/sai, không phải bài kiểm tra năng lực — mình đang kiểm tra
CHÍNH TRANG WEB, không phải kiểm tra bạn. Càng gặp khó, dữ liệu càng quý.
Trong lúc làm, bạn cứ nói to suy nghĩ ("đang tìm nút ở đâu", "cái này nghĩa là gì") —
mình cần nghe suy nghĩ của bạn hơn là kết quả.

Chi tiết cách tham gia xem ở: [link file/días này]
```

## 1. Ba cách tham gia phiên — chọn 1

| Cách | Phù hợp khi | Bạn (người chạy test) cần làm |
| :--- | :--- | :--- |
| **A. Trực tiếp** | Bạn bè cùng khu | Mời tới, ngồi cạnh nhưng **không ra chỉ dẫn**, mở sẵn `http://localhost:5173` |
| **B. Zoom + điều khiển từ xa** ⭐ khuyên dùng cho người ở xa | Người tham gia có máy tính | Tạo meeting Zoom → chia sẻ màn hình máy bạn (đang mở trang web) → người tham gia bấm **Request Remote Control** → họ tự thao tác như ngồi trước máy |
| **C. Meet/Facebook + bạn điều khiển theo lời** | Không cài được Zoom | Gọi video, người tham gia **chỉ dẫn từng bước**, bạn bấm theo họ. Ghi chú: cách này đo "độ dễ hiểu bằng lời", không đo thao tác thật — ghi vào notes để phân tích biết |

> ⛔ Đừng gửi link `localhost:5173` cho người ở xa — địa chỉ đó chỉ chạy trên máy của bạn.
> Nếu muốn người ở xa tự mở trang thật (không qua Zoom), cần tunnel (ngrok/cloudflared) —
> báo mình, mình hướng dẫn riêng vì phải sửa cả URL API trong frontend.

## 2. Kịch bản trong 20 phút (đọc cho người tham gia lúc bắt đầu)

```text
1. Mình sẽ quay màn hình + ghi âm buổi này, chỉ mình xem lại, không đăng ở đâu.
2. Bạn tạo một tài khoản MỚI trên trang (email gì cũng được, mật khẩu thật của bạn
   không cần — đặt mật khẩu giả cũng được).
3. Nhiệm vụ: mua 1 chiếc điện thoại cho công việc, ngân sách dưới 50 triệu,
   dùng mã giảm giá SAVE10, thanh toán, rồi kiểm tra rằng đơn đã được ghi nhận.
4. Nói to suy nghĩ suốt phiên. Bí thì im 10 giây mình sẽ hỏi "bạn đang nghĩ gì?".
5. Không sao nếu không xong — dừng cũng được.
6. Xong (hoặc dừng) → bạn mở link form này và điền ~1 phút: [LINK FORM]
   Điền mã phiên: P_
```

## 3. Những câu KHÔNG được nói trong phiên (làm lệch kết quả)

| Không nói | Thay bằng |
| :--- | :--- |
| "Bấm nút X ở dưới" | "Bạn thử cách bạn thấy hợp lý nhất" |
| "Trang này có lỗi coupon đó" | Im lặng — để họ tự gặp |
| "Sai rồi, quay lại đi" | "Bạn thấy có cách nào khác không?" |
| "Nhanh lên nhé" | Không nói gì — ghi thời gian |

## 4. Việc của BẠN (người chạy test) trong phiên

1. Bấm giờ từ lúc người tham gia đọc xong nhiệm vụ → ghi thời gian kết thúc.
2. Ghi vào `usability/raw_sessions.txt` 1 dòng/người: thiết bị, thời gian, số lần bạn phải
   gợi ý, họ nói gì khi thấy coupon/đơn hàng (quote nguyên văn 2–3 câu).
3. Không giúp đỡ trừ khi bí > 60 giây — mỗi lần giúp là 1 lần "gợi ý" đếm vào form/cột help.
4. Sau khi họ điền form xong, kiểm tra response đã vào (tab Responses).

## 5. Cảm ơn sau phiên

```text
Cảm ơn bạn nhiều! Nếu giảng viên có gọi hỏi xác minh (khoảng 1 phút), bạn xác nhận giúp mình
là đã tham gia buổi dùng thử ngày [ngày] nhé — số của mình để trong bài ở dạng che 4 số giữa.
```
