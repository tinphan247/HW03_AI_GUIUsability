# Dựng Google Form cho 7 phiên usability

> Form gồm **2 trang (section)**: Trang 1 = hướng dẫn + đồng ý + mã phiên; Trang 2 = kết quả + SUS.
> Người tham gia **chỉ cần mở 1 link form** — mọi hướng dẫn nằm trong form, không phải nhắn riêng.
> Quan sát hành vi (nếu có moderator) vẫn ghi vào `usability/raw_sessions.txt`.

## 1. Tạo form + Settings

1. https://forms.google.com → **Blank form**.
2. Tiêu đề: `Đánh giá trải nghiệm trang mua hàng EShop (20 phút)`
3. Mô tả form (dán vào ô "Form description"):

```text
Bạn sẽ dùng thử một trang bán hàng trong ~20 phút rồi trả lời 1 phút.
Không có đáp án đúng/sai — mình kiểm tra CHÍNH TRANG WEB, không kiểm tra bạn.
Dữ liệu chỉ dùng cho bài tập môn học; thông tin cá nhân sẽ được che khi báo cáo.
```

4. ⚙️ Settings:
   - **Collect email addresses** = `Do not collect`
   - **Limit to 1 response** = OFF
   - **Edit after submit** = OFF
   - **See summary charts** = OFF
   - **Confirmation message** (xem mục 5)

## 2. Trang 1 — "Bước 1: Làm nhiệm vụ"

Bấm **Add section** (biểu tượng `=` cạnh thanh công cụ) → đặt tên section:
`Bước 1 — Làm nhiệm vụ trên trang (20 phút)`

Dán vào **Description** của section này (Google Forms cho phép chèn link):

```text
⏱ 20 phút · Không có đáp án đúng/sai

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
   Làm xong nhiệm vụ (hoặc quyết định dừng) RỒI MỚI bấm "Tiếp theo" ở cuối trang.
   Trang sau là phần trả lời — chỉ điền khi bạn đã dùng thử xong.
```

Sau description, thêm **3 câu hỏi của trang 1**:

| # | Tên câu (dán nguyên văn) | Kiểu | Required | Ghi chú |
| :-: | :--- | :--- | :-: | :--- |
| 1 | `Tôi đồng ý tham gia (dữ liệu dùng cho bài tập - thông tin liên hệ được che)` | Checkboxes | ✅ | 1 lựa chọn: `Đồng ý` |
| 2 | `Mã phiên P? (người mời bạn cung cấp - ví dụ P1)` | Short answer | ✅ | Description: `Mã này người mời đã gửi cho bạn, dạng P1…P7` |
| 3 | `Tuổi của bạn` | Short answer | ✅ | |
| 4 | `SĐT hoặc email liên hệ (để giảng viên xác minh khi cần - sẽ che khi báo cáo)` | Short answer | ✅ | Bỏ câu này nếu bạn tự giữ liên hệ ở `raw_sessions.txt` |

> Cuối trang 1 Google Forms tự có nút **Tiếp theo** (Next). Đây chính là "cổng" để
> người tham gia đi làm nhiệm vụ rồi quay lại.

## 3. Trang 2 — "Bước 2: Trả lời"

**Add section** → tên: `Bước 2 — Trả lời (1 phút)`
Description:

```text
Cảm ơn bạn đã dùng thử! Trả lời theo cảm nhận thật của bạn — kể cả khi bạn không hoàn thành.
10 câu cuối: 1 = hoàn toàn không đồng ý … 5 = hoàn toàn đồng ý (không có đáp án đúng/sai).
```

| # | Tên câu | Kiểu | Required | Options / ghi chú |
| :-: | :--- | :--- | :-: | :--- |
| 5 | `Bạn hoàn thành tác vụ (tạo tài khoản → mua điện thoại → áp mã SAVE10 → thanh toán → xem lại đơn) thế nào?` | Multiple choice | ✅ | `Tôi tự làm xong - không cần gợi ý` · `Làm xong nhưng cần được gợi ý ít nhất 1 lần` · `Không hoàn thành` |
| 6 | `Tổng thời gian bạn mất (phút:giây - ví dụ 4:30)` | Short answer | ✅ | Description: `Không nhớ chính xác thì ghi khoảng đúng, ví dụ "khoảng 8 phút"` |
| 7 | `Điều bạn muốn thay đổi nhất trên trang này là gì? (không bắt buộc)` | Paragraph | ☐ | |
| 8–17 | `SUS Q1` … `SUS Q10` | Linear scale 1→5 | ✅ | Label trái `1 - Hoàn toàn không đồng ý`, phải `5 - Hoàn toàn đồng ý` |

Nội dung 10 câu SUS (**tên câu phải đúng `SUS Q1`…`SUS Q10`** — script đọc theo tên):

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

> 💡 Tạo `SUS Q1` → ⋮ → **Duplicate** 9 lần, chỉ sửa tên + nội dung.
> ⚠️ Không cắt bớt câu SUS — cắt là mất giá trị thang chuẩn. 10 câu chỉ ~30 giây.

## 4. Bản đầy đủ (tuỳ chọn — thêm 5 câu trước SUS)

| Tên câu | Kiểu | Required |
| :--- | :--- | :-: |
| `Khi áp mã SAVE10 - bạn thấy con số trên trang thế nào? Cảm giác của bạn lúc đó?` | Paragraph | ☐ |
| `Sau khi bấm xác nhận thanh toán - bạn có tin đơn đã được ghi nhận không? Vì sao?` | Paragraph | ☐ |
| `Bước nào khiến bạn rối nhất? Vì sao?` | Paragraph | ☐ |
| `Bước nào chậm nhất?` | Paragraph | ☐ |
| `Một câu bạn đã nói trong lúc dùng trang (nguyên văn - ví dụ: sao nó ra số âm?)` | Paragraph | ☐ |

`gform_to_csv.py` tự nhận diện câu có/không — không cần chỉnh script.

## 5. Confirmation message (Settings → Presentation)

```text
Cảm ơn bạn rất nhiều! 🙏
Nếu giảng viên gọi hỏi xác minh (khoảng 1 phút), bạn xác nhận giúp mình là đã tham gia
buổi dùng thử này nhé. Chúc bạn một ngày tốt lành!
```

## 6. Gửi + lấy dữ liệu

- **Send** → link rút gọn → chỉ cần gửi **1 link duy nhất** (hướng dẫn đã nằm trong form).
- Responses → **View in Sheets** → File → Download → **CSV** → lưu `usability/gform_responses.csv`.
- Chạy:

```powershell
python scripts\gform_to_csv.py --dry-run
python scripts\gform_to_csv.py
python scripts\sus_score.py
```

## 7. Kiểm tra trước khi gửi (30 giây)

- [ ] Mở link bằng **điện thoại** — chữ/link trong description có bấm được không.
- [ ] Bấm **Tiếp theo** ở trang 1 → sang trang 2 được không.
- [ ] Gửi thử 1 response của chính bạn rồi xoá (Responses → ⋮ → Delete all responses).
- [ ] 10 câu SUS đều là Linear scale 1–5, required ✅.
- [ ] Câu SUS Q9 **không** bị dính chữ của câu khác.
