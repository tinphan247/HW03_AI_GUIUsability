# Phiếu ghi nhanh 7 phiên — chỉ cần 1 dòng / người

> Mục đích: sau mỗi phiên 20 phút, bạn ghi **đúng 1 dòng** vào file `usability/raw_sessions.txt`.
> Sau khi có đủ (hoặc gần đủ) 7 dòng, chạy `python scripts/sus_from_lines.py` — script tự tách
> thành `participants.csv` + `sus_scores.csv` và tính điểm SUS. Không phải gõ tay CSV.

## 1. Định dạng 1 dòng (12 trường, ngăn bằng `|`)

```text
P1 | 22 | Sinh viên CNTT | 0912345678 | 15/11 19:00 | Chrome / Windows 11 | Success | 4:30 | 0 | thấy -270.000.000 và thành tiền 300.000.000 | 4,2,5,1,4,2,5,1,4,2 | "Tưởng nút thêm giỏ bị lỗi nên bấm 2 lần"
```

| # | Trường | Ghi chú |
| :-: | :--- | :--- |
| 1 | Mã phiên | **bạn tự đánh** `P1`…`P7` theo thứ tự phiên bạn chạy (người tham gia không thấy mã này); `P0` = pilot (không tính vào 7) |
| 2 | Tuổi | số, ví dụ `22` |
| 3 | Nghề nghiệp | tự do, ví dụ `Nhân viên văn phòng` |
| 4 | SĐT hoặc email | **đầy đủ** (báo cáo sẽ tự che 4 số giữa) |
| 5 | Ngày giờ | `dd/mm hh:mm` |
| 6 | Thiết bị / browser | ví dụ `Safari / iPhone 12`, `Chrome / Windows 11` |
| 7 | Kết quả | `Success` · `Help` (cần trợ giúp) · `Failure` |
| 8 | Thời gian | `mm:ss` hoặc số giây; không đo thì ghi `khong-do` |
| 9 | Số lần trợ giúp | số nguyên; không nhớ thì ghi `khong-do` |
| 10 | Coupon | họ thấy gì / nói gì (ngắn) |
| 11 | 10 điểm SUS | `1..5`, cách nhau dấu phẩy, đúng thứ tự Q1→Q10; không có thì `khong-do` |
| 12 | 1 câu quote | nguyên văn, đặt trong `"..."` |

> Trường nào không đo được: ghi `khong-do` — script sẽ để trống, **không tự điền số**.
>
> **P1…P7 ở đây là nhãn của bạn**, không phải thứ người tham gia phải nhớ. Form chỉ hỏi
> **họ tên + SĐT/Zalo**; khi có responses, ghép dòng ghi chú với response bằng cột SĐT
> (script in ra bảng có `SĐT che` + tên che để đối chiếu).


## 2. 10 câu SUS — đọc nguyên văn cho người tham gia

Thang: 1 = Hoàn toàn không đồng ý · 5 = Hoàn toàn đồng ý.

1. Tôi nghĩ mình sẽ muốn dùng hệ thống này thường xuyên.
2. Tôi thấy hệ thống phức tạp một cách không cần thiết.
3. Tôi thấy hệ thống dễ sử dụng.
4. Tôi nghĩ mình cần người có chuyên môn hỗ trợ mới dùng được hệ thống.
5. Tôi thấy các chức năng của hệ thống được tích hợp tốt.
6. Tôi thấy hệ thống có quá nhiều điểm không nhất quán.
7. Tôi nghĩ hầu hết mọi người sẽ học dùng hệ thống này rất nhanh.
8. Tôi thấy hệ thống rất khó sử dụng.
9. Tôi cảm thấy tự tin khi dùng hệ thống.
10. Tôi cần học nhiều thứ trước khi có thể dùng hệ thống.

## 3. Quy trình 3 bước

```powershell
# 1. Ghi 7 dòng vào file (mở bằng Notepad)
notepad usability\raw_sessions.txt

# 2. Kiểm tra trước, chưa ghi gì
python scripts\sus_from_lines.py --dry-run

# 3. Ghi thật + tính SUS
python scripts\sus_from_lines.py
python scripts\sus_score.py
```

## 4. Nếu chỉ kịp ít hơn 7 người

Cứ ghi đúng số phiên đã chạy. Script báo `n = ?/7`; báo cáo sẽ ghi rõ hạn chế (mẫu nhỏ, không đại diện) thay vì thêm người không tồn tại.

## 5. Mẫu trống (copy 7 dòng này rồi điền)

```text
P1 |  |  |  |  |  |  |  |  |  |  | 
P2 |  |  |  |  |  |  |  |  |  |  | 
P3 |  |  |  |  |  |  |  |  |  |  | 
P4 |  |  |  |  |  |  |  |  |  |  | 
P5 |  |  |  |  |  |  |  |  |  |  | 
P6 |  |  |  |  |  |  |  |  |  |  | 
P7 |  |  |  |  |  |  |  |  |  |  | 
```
