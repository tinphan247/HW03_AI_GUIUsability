# Runbook — chạy 7 phiên usability trong 1 buổi tối

> Mục tiêu: có **dữ liệu thật** cho 7 phiên, tối thiểu 15–20 phút/người, không cần thiết bị đặc biệt.
> Mọi thứ cần in/chuẩn bị nằm trong `usability/` — không phải viết thêm gì.

## 0. Chuẩn bị (20 phút, làm 1 lần)

| Việc | Cách làm |
| :--- | :--- |
| SUT chạy | API 3001 + web 5173 + admin 5174 (xem README §4) |
| Reset dữ liệu | `cd HW2/eshop-sut/backend && node database.js` → seed lại tài khoản |
| In phiếu | `usability/instruments/sus_vi.md` (7 bản) + `usability/consent.md` (7 bản) |
| Ghi âm | Điện thoại đặt cạnh laptop, ghi âm giọng + quay màn hình nếu được |
| Đồng hồ | Dùng điện thoại bấm giờ; không cần chính xác đến giây |
| Mẫu ghi | Mở `usability/DATA_REQUEST.md` trên laptop, điền ngay sau mỗi phiên |

## 1. Lịch 1 buổi tối (7 người)

| Giờ | Người | Ghi chú |
| :--- | :--- | :--- |
| 18:30 | P0 (pilot) | Chạy thử, sửa lời lẽ scenario nếu cần — **không tính vào 7** |
| 19:00 | P1 | |
| 19:25 | P2 | |
| 19:50 | P3 | |
| 20:15 | nghỉ 10 phút | |
| 20:25 | P4 | |
| 20:50 | P5 | |
| 21:15 | P6 | |
| 21:40 | P7 | |

Mỗi phiên: 3 phút chào + consent → 12 phút làm task → 5 phút SUS + probe. Người tiếp theo có thể ngồi chờ ngoài.

## 2. Trong mỗi phiên — chỉ cần 4 nhóm dữ liệu

1. **Kết quả task**: Success / Success with help / Failure + thời gian + số lần bạn phải gợi ý.
2. **SUS**: 10 câu, thang 1–5 (in sẵn, người tham gia tự khoanh).
3. **3 quote** đúng nguyên văn: bước rối nhất, phản ứng khi thấy coupon sai số, có tin đơn đã đặt không.
4. **1 quan sát**: họ có bấm "Thêm vào giỏ" 2 lần không? có F5 làm mất giỏ không? có sửa ô tổng tiền không?

> Nếu không kịp ghi: ghi **"không đo"** — đừng đoán số.

## 3. Sau mỗi phiên (3 phút)

Có 2 cách ghi — chọn 1 (hoặc dùng cả hai, dữ liệu sẽ đối chiếu):

- **Google Form** (khuyên dùng): người tham gia tự điền demographics + SUS + probe — dựng theo `usability/GOOGLE_FORM_GUIDE.md`; cuối buổi tải CSV về chạy `python scripts/gform_to_csv.py`.
- **1 dòng tay** vào `usability/raw_sessions.txt` (định dạng ở `usability/FILL_7_SESSIONS.md`), ví dụ:

```text
P1 | 22 | Sinh viên | 0912345678 | 15/11 19:00 | Chrome / Win 11 | Success | 4:30 | 0 | thấy -270.000.000 | 4,2,5,1,4,2,5,1,4,2 | "Tưởng nút lỗi nên bấm 2 lần"
```

Cả hai cách đều kết thúc bằng `python scripts/sus_from_lines.py` (tay) hoặc `python scripts/gform_to_csv.py` (form) → `participants.csv` + `sus_scores.csv`. Quan sát của bạn (thời gian thật, số lần trợ giúp) vẫn ghi vào `raw_sessions.txt` dù dùng form.

## 4. Sau khi xong 7 phiên

Gửi tôi file `DATA_REQUEST.md` đã điền (hoặc copy nội dung vào chat). Tôi sẽ:

1. Chuẩn hoá vào `usability/participants.csv` + `usability/sus_scores.csv` (che 4 số giữa).
2. Chạy `python scripts/sus_score.py` → mean/median/SD/SD + diễn giải.
3. Viết `usability/analysis.md`: theme (affinity), severity (impact × tần suất), tam giác hoá với 34 bug Task 1.
4. Điền Main_Report §3.5–3.8 + cập nhật §8, AI Audit Artifact 4.
5. Commit + push + xuất PDF + zip bài nộp.

## 5. Nếu ai đó không đến

- Chạy người dự phòng (đã chuẩn bị 2).
- Nếu vẫn thiếu: báo cáo **đúng số phiên thật** (ví dụ 6/7) và ghi hạn chế. Không điền người không tồn tại.

## 6. Câu hỏi nhanh khi người tham gia bí

| Tình huống | Nói gì |
| :--- | :--- |
| Im lặng > 15 giây | "Bạn đang nghĩ gì vậy?" |
| Hỏi "bấm cái này đúng không?" | "Bạn thử cách bạn nghĩ là hợp lý nhất." |
| Bí > 60 giây | Gợi ý 1 câu ngắn + ghi lại thời điểm và nội dung |
| Thấy coupon sai số | Không sửa giúp; hỏi "Bạn thấy con số này thế nào?" |
| Muốn bỏ cuộc | "Không sao, bạn dừng cũng được" → ghi Failure nếu chưa xong |
