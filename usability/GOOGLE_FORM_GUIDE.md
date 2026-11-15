# Dựng Google Form cho 7 phiên usability

> Có 2 bản — chọn 1:
> **A. RÚT GỌN (~1 phút/người)** — 5 câu + 10 câu SUS. Khuyên dùng.
> **B. ĐẦY ĐỦ (~5 phút/người)** — thêm 5 câu probe (coupon, trust, rối nhất…) — nếu muốn người tham gia tự kể.
>
> Dù bản nào, **quan sát hành vi của bạn** (thời gian thật, số lần trợ giúp, quote trong lúc làm,
> thiết bị) vẫn ghi 1 dòng/người vào `usability/raw_sessions.txt` — form không thay được phần này.

## 1. Tạo form

1. Mở https://forms.google.com → **Blank form (Trống)**.
2. Tiêu đề: `Đánh giá trải nghiệm trang mua hàng EShop (dùng thử 20 phút)`.
3. Mô tả (dán vào):

```text
Cảm ơn bạn đã dùng thử trang bán hàng (20 phút). Form này KHÔNG chấm điểm đúng/sai —
câu trả lời giúp mình cải thiện giao diện, chỉ mất ~1 phút.
Dữ liệu chỉ dùng cho bài tập môn học; thông tin liên hệ sẽ được che bớt khi báo cáo.
Bạn có thể dừng tham gia bất cứ lúc nào.
```

4. ⚙️ Settings (bánh răng):
   - **Collect email addresses**: `Do not collect`.
   - **Limit to 1 response**: OFF (người không đăng nhập Google cũng làm được).
   - **Edit after submit**: OFF.
   - **See summary charts**: OFF.

## 2A. BẢN RÚT GỌN — 15 câu (~1 phút)

| # | Tên câu (dán nguyên văn) | Kiểu | Required | Options |
| :-: | :--- | :--- | :-: | :--- |
| 1 | `Tôi đồng ý tham gia (dữ liệu dùng cho bài tập - thông tin liên hệ được che)` | Checkboxes | ✅ | `Đồng ý` |
| 2 | `Mã phiên P? (người mời bạn cung cấp - ví dụ P1)` | Short answer | ✅ | — |
| 3 | `Tuổi của bạn` | Short answer | ✅ | — |
| 4 | `Bạn hoàn thành tác vụ (tạo tài khoản → mua điện thoại → áp mã SAVE10 → thanh toán → xem lại đơn) thế nào?` | Multiple choice | ✅ | `Tôi tự làm xong - không cần gợi ý` · `Làm xong nhưng cần được gợi ý ít nhất 1 lần` · `Không hoàn thành` |
| 5 | `Điều bạn muốn thay đổi nhất trên trang này là gì? (không bắt buộc)` | Paragraph | ☐ | — |
| 6–15 | `SUS Q1` … `SUS Q10` | Linear scale | ✅ | `1` → `5`; label trái `1 - Hoàn toàn không đồng ý`; label phải `5 - Hoàn toàn đồng ý` |

Nội dung 10 câu SUS (**tên câu dán đúng `SUS Q1` … `SUS Q10`** — script CSV map theo tên này):

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

> 💡 Tạo `SUS Q1` xong → ⋮ → **Duplicate** 9 lần, chỉ sửa tên + nội dung.
>
> ⚠️ Không rút gọn SUS xuống dưới 10 câu — cắt câu nào cũng mất giá trị điểm SUS (thang chuẩn).
> 10 câu này chỉ tốn ~30 giây vì mỗi câu là 1 click.

## 2B. BẢN ĐẦY ĐỦ (tuỳ chọn — thêm 5 câu sau câu 5)

| # | Tên câu | Kiểu | Required |
| :-: | :--- | :--- | :-: |
| A | `Khi áp mã SAVE10 - bạn thấy con số trên trang thế nào? Cảm giác của bạn lúc đó?` | Paragraph | ☐ |
| B | `Sau khi bấm xác nhận thanh toán - bạn có tin đơn đã được ghi nhận không? Vì sao?` | Paragraph | ☐ |
| C | `Bước nào khiến bạn rối nhất? Vì sao?` | Paragraph | ☐ |
| D | `Bước nào chậm nhất?` | Paragraph | ☐ |
| E | `Một câu bạn đã nói trong lúc dùng trang (nguyên văn - ví dụ: sao nó ra số âm?)` | Paragraph | ☐ |

`gform_to_csv.py` tự nhận diện câu nào có / không có — không cần chỉnh script.

## 3. Gửi form

- **Send** → link rút gọn → gửi kèm tin nhắn ở `usability/RECRUIT_MESSAGE.md`:
  `Bạn dùng thử 20 phút rồi điền form giúp mình nha: <link> (1 phút)`.
- Nhớ gửi **mã phiên P?** trước cho từng người — nếu không bạn phải tự map response với người nào.

## 4. Trích dữ liệu về cho tôi

1. Tab **Responses** → icon Sheets → **View in Sheets** → File → Download → **CSV**.
2. Lưu thành `usability/gform_responses.csv`.
3. Chạy:

```powershell
python scripts\gform_to_csv.py --dry-run   # xem trước, chưa ghi
python scripts\gform_to_csv.py            # ghi participants.csv + sus_scores.csv
python scripts\sus_score.py               # tính SUS + diễn giải
```

4. Gửi tôi file CSV (hoặc bảo tôi chạy) — tôi viết §3.5–3.8 + phân tích + zip mới trong ~20 phút.
