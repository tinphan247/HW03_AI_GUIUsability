# Usability sessions — index

**Flow:** Đăng ký → tìm sản phẩm → thêm giỏ → áp coupon SAVE10 → thanh toán → xem lịch sử đơn.
**Người thực hiện:** Phan Trung Tin — 23120372.
**Hình thức:** online, unmoderated qua Google Form (người tham gia tự làm task trên bản host, tự điền SUS).

| Phiên | Người | Ngày | Thời lượng | Task success | Trợ giúp | SUS | Ghi chú |
| :--- | :--- | :--- | ---: | :--- | :-: | ---: | :--- |
| Pilot | P0 | — | — | — | — | — | **Không chạy** (hạn chế ghi ở `analysis.md` §8) |
| 1 | P1 | 16/11/2026 | không đo | Success | 0 | 87.5 | |
| 2 | P2 | 16/11/2026 | không đo | Success | 0 | 90.0 | Q4/Q10 tự mâu thuẫn |
| 3 | P3 | 16/11/2026 | không đo | Success | 0 | 75.0 | |
| 4 | P4 | 16/11/2026 | không đo | Success | 0 | 97.5 | |
| 5 | P5 | 16/11/2026 | không đo | Success | 0 | 87.5 | |
| 6 | P6 | 16/11/2026 | không đo | Help | ≥ 1 | 77.5 | Cần gợi ý ≥ 1 lần |
| 7 | P7 | 16/11/2026 | không đo | Success | 0 | 45.0 | Outlier — Q5 = 2, Q6/Q8 = 4 |

> **Trạng thái: 7/7 phiên đã có dữ liệu thật** — thu qua Google Form 16/11/2026, 07:18–10:52.
> 8 response thô → bỏ 1 response trùng cùng họ tên + SĐT (`scripts/dedupe_responses.py`) → 7 người.
> **Không có time-on-task** (form rút gọn không có câu thời gian), **task outcome là tự khai** — đọc kèm
> `usability/analysis.md` §8 trước khi trích dẫn bất kỳ số nào.

Mỗi thư mục `P1…P7` chứa `notes.md` — hồ sơ phiên sinh tự động từ response Google Form
(`scripts/import_gform_sessions.py`). Không có `sus.md` scan, `consent.png` hay `recording.mp4` vì
phiên không được điều phối trực tiếp; consent nằm ở câu đầu của form (`Đồng ý` 7/7).

Dữ liệu tổng hợp: `usability/participants.csv` (nhân khẩu + kết quả, SĐT che 4 số giữa) và
`usability/sus_scores.csv` (10 câu trả lời/người). Bản SĐT đầy đủ để TA xác minh nằm ở
`usability/contacts_local.csv` — **không** đưa vào zip nộp.
