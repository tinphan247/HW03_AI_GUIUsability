# Dựng Google Form cho 7 phiên usability (15 phút)

> Form thay phiếu giấy: người tham gia tự điền **demographics + SUS + probe** ngay sau phiên.
> Phần **quan sát hành vi** (thời gian, số lần trợ giúp, quote trong lúc làm) vẫn do **bạn ghi**
> vào `usability/raw_sessions.txt` — form không thay được phần này.

## 1. Tạo form

1. Mở https://forms.google.com → **Blank form (Trống)**.
2. Tiêu đề: `Đánh giá trải nghiệm trang mua hàng EShop (20 phút dùng thử)`.
3. Mô tả (dán vào):

```text
Cảm ơn bạn đã dành ~20 phút dùng thử trang bán hàng này. Form này KHÔNG chấm điểm đúng/sai —
câu trả lời của bạn giúp mình cải thiện giao diện. Dữ liệu chỉ dùng cho bài tập môn học;
số điện thoại/email sẽ được che bớt khi báo cáo. Bạn có thể dừng tham gia bất cứ lúc nào.
```

4. ⚙️ Settings (bánh răng):
   - **Collect email addresses**: `Do not collect` (đỡ phiền, liên hệ hỏi riêng qua câu SĐT).
   - **Limit to 1 response**: OFF (người không đăng nhập Google cũng làm được).
   - **Edit after submit**: OFF.
   - **See summary charts**: OFF (tránh người sau đọc trước).

## 2. Câu hỏi — tạo đúng thứ tự và **đúng tên** (script CSV phụ thuộc tên)

### Section 1 — Đồng ý & thông tin

| # | Tên câu (dán nguyên văn) | Kiểu | Required | Ghi chú |
| :-: | :--- | :--- | :-: | :--- |
| 1 | `Tôi đã đọc và đồng ý tham gia (dữ liệu dùng cho bài tập - thông tin liên hệ được che)` | Checkboxes | ✅ | 1 lựa chọn: `Đồng ý` |
| 2 | `Mã phiên P? (người mời bạn cung cấp - ví dụ P1)` | Short answer | ✅ | Bạn gửi trước cho mỗi người 1 mã: P1…P7 |
| 3 | `Tuổi của bạn` | Short answer | ✅ | Chỉ số |
| 4 | `Nghề nghiệp hiện tại` | Short answer | ✅ | |
| 5 | `SĐT hoặc email liên hệ` | Short answer | ✅ | Giải thích: "để giảng viên có thể xác minh nếu cần" |
| 6 | `Thời điểm bạn làm phiên (ví dụ 15/11 19:00)` | Short answer | ✅ | |
| 7 | `Thiết bị bạn đã dùng` | Multiple choice | ✅ | `Laptop Windows + Chrome` · `Laptop Windows + Firefox` · `Laptop Mac + Safari` · `Điện thoại Android + Chrome` · `iPhone + Safari` · `Khác` |
| 8 | `Bạn đã từng mua hàng online trong 6 tháng qua?` | Multiple choice | ✅ | `Rồi (≥1 lần/tháng)` · `Rồi (hiếm)` · `Chưa` |

### Section 2 — Kết quả phiên

| # | Tên câu | Kiểu | Required | Options |
| :-: | :--- | :--- | :-: | :--- |
| 9 | `Tác vụ (tạo tài khoản → mua điện thoại → áp mã SAVE10 → thanh toán → xem lại đơn) bạn hoàn thành thế nào?` | Multiple choice | ✅ | `Tôi tự làm xong - không cần gợi ý` · `Làm xong nhưng cần được gợi ý ít nhất 1 lần` · `Không hoàn thành` |
| 10 | `Tổng thời gian bạn mất (phút:giây - ví dụ 4:30)` | Short answer | ✅ | |
| 11 | `Bạn được gợi ý mấy lần trong lúc làm?` | Multiple choice | ✅ | `0` · `1` · `2` · `3 trở lên` |
| 12 | `Khi áp mã SAVE10 - bạn thấy con số trên trang thế nào? Cảm giác của bạn lúc đó?` | Paragraph | ✅ | |
| 13 | `Sau khi bấm xác nhận thanh toán, bạn có tin đơn đã được ghi nhận không? Vì sao?` | Paragraph | ✅ | |
| 14 | `Bước nào khiến bạn rối nhất? Vì sao?` | Paragraph | ✅ | |
| 15 | `Bước nào chậm nhất?` | Paragraph | ✅ | |
| 16 | `Nếu chỉ được sửa 1 thứ trên trang này, bạn sửa gì?` | Paragraph | ✅ | |
| 17 | `Một câu bạn đã nói trong lúc dùng trang (nguyên văn - ví dụ: sao nó ra số âm?)` | Paragraph | ✅ | |

### Section 3 — SUS (10 câu, Linear scale)

Mỗi câu: **Linear scale**, `1` → `5`, label trái `1 – Hoàn toàn không đồng ý`, label phải `5 – Hoàn toàn đồng ý`, Required ✅.
**Tên câu dán đúng `SUS Q1` … `SUS Q10`** (script CSV map theo tên này), nội dung câu:

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

> 💡 Mẹo: tạo câu `SUS Q1` xong → bấm dấu ⋮ → **Duplicate** 9 lần, chỉ sửa tên + nội dung — nhanh hơn tạo tay.

### Confirmation message (Settings → Presentation)

```text
Cảm ơn bạn rất nhiều! Trả lời của bạn giúp mình cải thiện trang. 👋
```

## 3. Gửi form

- Bấm **Send** → link rút gọn (Shorten URL) → gửi kèm tin nhắn mời ở `usability/RECRUIT_MESSAGE.md`:
  `Bạn làm phiên 20 phút rồi điền form này giúp mình nha: <link> (5 phút)`.
- Mỗi người nhớ nhận **mã phiên P?** trước — nếu không, bạn phải tự map responses với người nào.

## 4. Trích dữ liệu về cho tôi

1. Tab **Responses** → icon Sheets (màu xanh) → **View in Sheets** → File → Download → **CSV**.
2. Lưu thành `usability/gform_responses.csv`.
3. Chạy:

```powershell
python scripts\gform_to_csv.py --dry-run   # xem trước, chưa ghi
python scripts\gform_to_csv.py            # ghi participants.csv + sus_scores.csv
python scripts\sus_score.py               # tính SUS + diễn giải
```

4. Gửi tôi 2 file CSV (hoặc cả thư mục `usability/`) — tôi viết §3.5–3.8 + phân tích + zip mới.

> **Quan sát của bạn (thời gian thật, số lần trợ giúp, quote theo timeline) vẫn ghi 1 dòng/người**
> vào `usability/raw_sessions.txt` — hai nguồn này đối chiếu với nhau khi phân tích (người tham gia
> hay tự đo thời gian sai; con số của bạn là chuẩn).
