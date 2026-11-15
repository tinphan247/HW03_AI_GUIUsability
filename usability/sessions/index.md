# Usability sessions — index

**Flow:** Đăng ký → tìm sản phẩm → thêm giỏ → áp coupon SAVE10 → thanh toán → xem lịch sử đơn.
**Người thực hiện:** Phan Trung Tin — 23120372.

| Phiên | Người | Ngày | Thời lượng | Task success | Trợ giúp | SUS | Ghi chú |
| :--- | :--- | :--- | ---: | :--- | :-: | ---: | :--- |
| Pilot | P0 | | | | | | Chưa chạy — không tính vào 7 |
| 1 | P1 | | | | | | Chưa chạy |
| 2 | P2 | | | | | | Chưa chạy |
| 3 | P3 | | | | | | Chưa chạy |
| 4 | P4 | | | | | | Chưa chạy |
| 5 | P5 | | | | | | Chưa chạy |
| 6 | P6 | | | | | | Chưa chạy |
| 7 | P7 | | | | | | Chưa chạy |

> **Trạng thái: 0/7 phiên đã chạy.** Khi có dữ liệu, điền 1 dòng/người vào `usability/raw_sessions.txt`
> (định dạng `usability/FILL_7_SESSIONS.md`) rồi chạy `python scripts/sus_from_lines.py` — bảng trên
> và `participants.csv`/`sus_scores.csv` được điền từ dữ liệu thật, không suy diễn.

Mỗi thư mục `P1…P7` chứa:

- `notes.md` — timeline, friction, quote, probe summary (copy từ `_template/notes.md`).
- `sus.md` — phiếu SUS đã điền (hoặc ảnh scan).
- `consent.png` — ảnh consent đã che thông tin nhạy cảm.
- `recording.mp4` — không commit (xem `.gitignore`), để link trong `notes.md`.

Dữ liệu tổng hợp: `usability/participants.csv` (nhân khẩu + kết quả) và `usability/sus_scores.csv` (10 câu trả lời/người).
