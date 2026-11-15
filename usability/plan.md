# Usability Evaluation Plan — EShop: đăng ký → mua hàng → xem đơn

**Sinh viên:** Phan Trung Tin — 23120372
**SUT:** EShop web `http://localhost:5173` (API `http://localhost:3001`)
**Flow:** Đăng ký tài khoản → tìm sản phẩm → thêm vào giỏ → áp mã giảm giá → thanh toán → xem lịch sử đơn hàng
**Phương pháp:** Moderated usability test, think-aloud, 1 phiên/người, 25–30 phút
**Số người:** 7 người chính + 1 pilot (pilot không tính vào 7)

---

## 1. Mục tiêu (đo được)

| ID | Mục tiêu | Cách đo |
| :--- | :--- | :--- |
| O1 | Xác định bước gây lạc/do dự nhiều nhất trong flow | Đếm số lần back/đi sai route + thời gian từng bước; ghi quote |
| O2 | Đánh giá khả năng phục hồi khi coupon báo lỗi hoặc giá bất thường | Quan sát hành động sau lỗi; phân loại: tự sửa / hỏi moderator / bỏ qua |
| O3 | Đo hiệu quả tổng thể: task success, thời gian, số lần cần trợ giúp | Bấm giờ từ lúc đọc scenario đến khi thấy đơn trong lịch sử |
| O4 | Đo mức tin cậy vào đơn hàng và con số thanh toán | Câu probe trust + kiểm tra người dùng có đọc lại tổng tiền không |

## 2. Người tham gia

**Tiêu chí chọn:**

- Từ 18 tuổi, **ngoài lớp HW03** (không phải sinh viên cùng môn), không học CNTT càng tốt.
- Đã từng mua hàng online ít nhất 1 lần trong 6 tháng.
- Dùng được tiếng Việt; không cần biết về kiểm thử phần mềm.
- Tự nguyện, ký consent, đồng ý quay màn hình (không bắt buộc quay mặt).

**Số lượng:** 7 người chính + 1 pilot + 2 người dự phòng (nếu phiên lỗi kỹ thuật).
**Thù lao:** không (ghi rõ trong consent); cảm ơn bằng lời + gửi tóm tắt kết quả nếu người tham gia muốn.

**Lưu liên hệ:** cột `contact` trong `usability/participants.csv`, **che 4 số giữa** khi báo cáo (ví dụ `0901***678`). Bản gốc có thể gửi TA khi được yêu cầu xác minh.

## 3. Lịch dự kiến

| Phiên | Người | Ngày | Giờ | Hình thức | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Pilot | P0 | __/11/2026 | __:__ | Trực tiếp | TODO |
| P1 | __ | __/11/2026 | __:__ | Trực tiếp | TODO |
| P2 | __ | __/11/2026 | __:__ | Trực tiếp | TODO |
| P3 | __ | __/11/2026 | __:__ | Trực tiếp | TODO |
| P4 | __ | __/11/2026 | __:__ | Online (share màn hình) | TODO |
| P5 | __ | __/11/2026 | __:__ | Online | TODO |
| P6 | __ | __/11/2026 | __:__ | Trực tiếp | TODO |
| P7 | __ | __/11/2026 | __:__ | Trực tiếp | TODO |

## 4. Vai trò & thiết bị

- **Moderator:** Phan Trung Tin — đọc scenario nguyên văn, không hướng dẫn.
- **Note-taker:** ___ (nếu có) — ghi timeline, không nói trong lúc làm task.
- **Thiết bị:** laptop Windows + Chrome (profile sạch), quay màn hình bằng OBS; điện thoại dự phòng để chụp bối cảnh.
- **Chuẩn bị mỗi phiên:** reset DB (`node database.js`) hoặc dùng email đăng ký mới; xoá localStorage; mở sẵn `http://localhost:5173`.

## 5. Dữ liệu thu thập

| Dữ liệu | Công cụ | Lưu ở |
| :--- | :--- | :--- |
| Video màn hình + audio | OBS | `usability/sessions/Pn/recording.mp4` (không commit) / link |
| Timeline hành động + quote | Observation sheet | `usability/sessions/Pn/notes.md` |
| Task success, thời gian, số lần trợ giúp | Observation sheet | `usability/sessions/Pn/notes.md` |
| SUS 10 câu | Giấy hoặc Google Form | `usability/sessions/Pn/sus.md` |
| Probe answers | Ghi âm + tóm tắt | `usability/sessions/Pn/notes.md` |
| Consent đã ký | Ảnh/scan | `usability/sessions/Pn/consent.png` |

## 6. Tiêu chí phiên hợp lệ

- Người tham gia ngoài lớp, tự nguyện, consent được ký **trước** khi bắt đầu.
- Moderator không nhắc tên nút/đường dẫn; mọi lần trợ giúp phải được ghi lại.
- Phiên bị loại nếu: lỗi kỹ thuật khiến không hoàn thành được flow mà không phải do SUT, hoặc thời lượng < 10 phút do dừng sớm.
- Người tham gia có quyền dừng bất cứ lúc nào; dữ liệu của họ bị xoá nếu họ yêu cầu.

## 7. Rủi ro & cách xử lý

| Rủi ro | Cách xử lý |
| :--- | :--- |
| Người tham gia biết SUT trước (sinh viên CNTT) | Sàng lọc qua câu hỏi; ghi rõ trong notes nếu đã từng dùng |
| Moderator vô tình dẫn dắt | Đọc script cố định; chỉ hỏi mở; tự ghi lại các lần lỡ lời |
| Quay màn hình lỗi | Kiểm tra 30 giây trước khi bắt đầu; có phương án ghi timeline giấy |
| Mất dữ liệu do reload/F5 (lỗi SUT) | Không can thiệp; ghi nhận là friction; chỉ hỗ trợ sau 60 giây bí |
| Người tham gia rút giữa chừng | Không tính vào 7; chạy người dự phòng |
| Thiên lệch do chỉ 7 người | Không suy rộng thống kê; báo cáo là qualitative + SUS descriptive |

## 8. Đạo đức & quyền riêng tư

- Consent bằng văn bản, nêu rõ mục đích học tập, dữ liệu sẽ đưa vào bài nộp.
- Ẩn danh khi báo cáo: dùng P1…P7; che 4 số giữa của số điện thoại; không nêu nơi làm việc cụ thể.
- Video chỉ lưu cục bộ, không public; nếu cần nộp thì để link unlisted và ghi rõ.
- Người tham gia được xem lại quote của mình nếu yêu cầu.
