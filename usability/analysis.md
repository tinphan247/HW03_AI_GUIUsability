# Phân tích usability — EShop (7 phiên)

**Flow:** Đăng ký → tìm sản phẩm → thêm giỏ → áp coupon SAVE10 → thanh toán → xem lịch sử đơn.
**Dữ liệu nguồn:** `usability/participants.csv`, `usability/sus_scores.csv`, `usability/sessions/P1…P7/notes.md`, `usability/pilot/pilot_notes.md`.

> **Trạng thái: CHƯA CÓ DỮ LIỆU.** Chưa chạy phiên nào với người thật. File này giữ (a) khung phân tích đã định nghĩa trước, (b) **danh sách theme dự kiến** suy ra từ 34 bug của Task 1 — chưa phải kết quả. Khi có notes + SUS của 7 phiên, các bảng được điền từ dữ liệu thật; không suy diễn số liệu.

## 1. Tổng quan mẫu

| Field | Value |
| :--- | :--- |
| Số phiên hợp lệ | 0 / 7 (chưa chạy) |
| Độ tuổi | TODO |
| Nghề nghiệp | TODO |
| Tần suất mua online | TODO |
| Thiết bị | TODO |
| Đã từng dùng EShop | TODO |

## 2. Task success & thời gian

| Participant | Success | Thời gian (giây) | Số lần trợ giúp | Back/đi sai route | Coupon | Tìm thấy đơn |
| :--- | :--- | ---: | :-: | :-: | :--- | :--- |
| P1 | | | | | | |
| … | | | | | | |

**Tổng hợp:** Success = __/7 · Success with help = __/7 · Failure = __/7 · Thời gian trung bình = __ giây · Trung vị = __ giây.

## 3. SUS

Xem `usability/sus_results.md` (sinh bằng `python scripts/sus_score.py`).

| Metric | Value |
| :--- | ---: |
| Mean SUS | TODO |
| Median | TODO |
| SD | TODO |
| Min – Max | TODO |
| Diễn giải | TODO |

## 4. Theme dự kiến (giả thuyết từ Task 1 — chờ xác nhận bằng dữ liệu)

| Theme | Mô tả | Số người gặp | Bước | Evidence |
| :--- | :--- | :-: | :--- | :--- |
| T1 | Không biết thao tác thêm giỏ đã thành công (không toast/badge) | | Thêm giỏ | IA-03-02, IA-04-01 |
| T2 | Coupon hiển thị số tiền vô lý, làm mất niềm tin vào tổng tiền | | Coupon | IA-04-08 |
| T3 | Bối rối vì nhãn tiếng Anh (Sign In/Username) và mật khẩu hiện ký tự | | Đăng ký/Đăng nhập | IA-01-04, IA-02-03 |
| T4 | Mất giỏ hàng khi reload; phải thêm lại | | Thêm giỏ | IA-03-09 |
| T5 | Không chắc đơn đã đặt vì trang success sơ sài, giỏ vẫn còn hàng | | Thanh toán | IA-04-11 |
| T6 | Sợ bấm nhầm Xóa/Hủy vì không có xác nhận | | Giỏ/Đơn | IA-04-03, IA-04-15 |
| T7 | Không tìm thấy đơn hoặc không hiểu trạng thái | | Lịch sử | IA-04-10 |

## 5. Severity ranking (impact × tần suất)

| # | Vấn đề | Impact | Tần suất | Severity | Nguồn |
| :-: | :--- | :-: | :-: | :--- | :--- |
| 1 | | | | | |
| 2 | | | | | |

## 6. Tam giác hoá với Task 1

| Theme | Checklist item cùng hiện tượng | Kết luận |
| :--- | :--- | :--- |
| T1 | IA-03-02, IA-04-01 | Bug thật, cả automated và người dùng đều gặp |
| T2 | IA-04-08 | Bug thật, mức Blocker |
| … | | |

## 7. Khuyến nghị (ưu tiên)

| # | Khuyến nghị | Giải quyết theme | Cách kiểm chứng sau khi sửa |
| :-: | :--- | :--- | :--- |
| 1 | Thêm toast + badge giỏ sau add-to-cart | T1 | Chạy lại IA-03-02, IA-04-01; hỏi 3 người mới |
| 2 | Sửa công thức coupon percent + hiển thị discount dương | T2 | Unit test backend + chạy lại IA-04-08 |
| 3 | Chuẩn hoá nhãn tiếng Việt, password type=password | T3 | Chạy lại IA-01-04, IA-02-03 |
| 4 | Persist giỏ hàng (localStorage/server) | T4 | F5 sau khi thêm, chạy IA-03-09 |
| 5 | Clear giỏ + trang success có mã đơn + link xem đơn | T5 | Chạy IA-04-11, hỏi lại trust |
| 6 | Confirm dialog cho xóa giỏ/hủy đơn | T6 | Chạy IA-04-03, IA-04-15 |
| 7 | Empty state + loading/error state cho Home/Cart | T7 | Chạy IA-04-04/05/06/07 |

## 8. Hạn chế

- n = 7, không đại diện thống kê; kết quả là định tính + mô tả.
- Moderator kiêm note-taker ở một số phiên → có thể bỏ sót quote.
- Một số phiên online có thể bị nhiễu mạng, ảnh hưởng cảm nhận tốc độ.
- Người tham gia biết đây là bài kiểm thử → có thể cố gắng nhiều hơn người dùng thật (Hawthorne effect).
