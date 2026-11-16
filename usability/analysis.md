# Phân tích usability — EShop (7 phiên)

**Flow:** Đăng ký → tìm sản phẩm → thêm giỏ → áp coupon SAVE10 → thanh toán → xem lịch sử đơn.
**Dữ liệu nguồn:** `usability/gform_responses.csv` (8 response thô) → `gform_responses_dedup.csv` (7 người) →
`participants.csv`, `sus_scores.csv`, `sus_results.md`, `sessions/P1…P7/notes.md`.

> **Trạng thái: ĐÃ CÓ DỮ LIỆU — n = 7 người thật**, thu qua Google Form tự điền (unmoderated, online),
> ngày 16/11/2026, 07:18–10:52. Hạn chế phương pháp ghi rõ ở §8; không có số liệu nào được suy diễn thêm.

## 1. Tổng quan mẫu

| Field | Value |
| :--- | :--- |
| Response thô | 8 |
| Người tham gia duy nhất | **7** (1 response trùng: cùng họ tên + SĐT, gửi cách 76 giây — xem §1.1) |
| Độ tuổi | 20–23 (cả 7 đều thuộc nhóm 18–24) |
| Nghề nghiệp | Không thu thập |
| Tần suất mua online | Không thu thập |
| Thiết bị | Không thu thập (form 1 phút không có câu thiết bị) |
| Đồng ý tham gia | 7/7 (`Đồng ý`) |

### 1.1 Xử lý response trùng

`Nguyễn Thị Út Lan` gửi 2 lần: **07:18:56** và **07:20:12** (cùng SĐT). Giữ **bản gửi sau**:

| Bản | SUS | Lý do |
| :--- | ---: | :--- |
| 07:18:56 | 50.0 | Toàn bộ 10 câu = 5, kể cả 5 câu phủ định (Q2/Q4/Q6/Q8/Q10) → tự mâu thuẫn (straight-lining) |
| 07:20:12 | 87.5 | Trả lời phân biệt câu tích cực/phủ định, nhất quán |

Quyết định ghi ở `scripts/dedupe_responses.py` (giữ bản cuối theo SĐT) — chạy lại được, không sửa tay.

## 2. Task success & thời gian

| Participant | Tuổi | Task outcome (tự báo cáo) | Thời gian | Số lần trợ giúp | SUS |
| :--- | :-: | :--- | :--- | :--- | ---: |
| P1 | 21 | Success | `khong-do` | 0 (tự báo cáo) | 87.5 |
| P2 | 20 | Success | `khong-do` | 0 | 90.0 |
| P3 | 21 | Success | `khong-do` | 0 | 75.0 |
| P4 | 23 | Success | `khong-do` | 0 | 97.5 |
| P5 | 20 | Success | `khong-do` | 0 | 87.5 |
| P6 | 21 | **Help** — "cần được gợi ý ít nhất 1 lần" | `khong-do` | ≥ 1 | 77.5 |
| P7 | 22 | Success | `khong-do` | 0 | 45.0 |

**Tổng hợp:** Success = **6/7** · Success with help = **1/7** · Failure = **0/7** · Thời gian trung bình = **không có dữ liệu**.

> ⚠️ **Không có time-on-task.** Form rút gọn (~1 phút/người) không có câu thời gian, và không có moderator bấm giờ.
> Mọi con số thời gian trong báo cáo Task 2 đều là `khong-do` — không được tự điền.
>
> ⚠️ **Task outcome là tự báo cáo, chưa kiểm chứng.** Khoảng cách giữa các lần gửi form (R1→R2: 46 giây,
> R2→R3: 30 giây, R3→R4: 146 giây) **ngắn hơn nhiều so với một phiên 20 phút**. Vì vậy "Success 6/7"
> nghĩa là *6 người tự nói họ làm xong*, không chứng minh được họ đã thực sự chạy hết flow.

## 3. SUS

Sinh tự động bởi `python scripts/sus_score.py` → `usability/sus_results.md`.

| Metric | Value |
| :--- | ---: |
| Mean SUS | **80.0** |
| Median | 87.5 |
| SD | 17.2 |
| Min – Max | 45.0 (P7) – 97.5 (P4) |
| Phân loại | **Good** (68–80 good, > 80 excellent); Bangor: 81–90 = hạng B, 68–80 = hạng C → **80.0 nằm đúng ranh giới B/C** |

### 3.1 Điểm từng câu (thang 1–5, đã đảo câu phủ định khi tính điểm)

| Câu | Nội dung rút gọn | Trung bình thô | Đọc |
| :-: | :--- | ---: | :--- |
| Q1 | Muốn dùng thường xuyên | 4.57 | Tích cực |
| Q2 | Phức tạp không cần thiết | 1.57 | Không phức tạp |
| Q3 | Dễ sử dụng | 4.86 | Rất tích cực |
| Q4 | Cần người hỗ trợ mới dùng được | 2.43 | Không cần |
| Q5 | Chức năng tích hợp tốt | 4.43 | Tích cực (P7 cho 2) |
| Q6 | Quá nhiều điểm không nhất quán | 2.14 | Ít nhận ra |
| Q7 | Học dùng nhanh | 4.71 | Tích cực |
| Q8 | Rất khó sử dụng | 2.14 | Không khó |
| Q9 | Tự tin khi dùng | 4.57 | Tích cực |
| Q10 | Cần học nhiều thứ trước | 2.86 | Trung tính |

**Hai quan sát quan trọng:**

1. **6/7 người trả lời theo một "khuôn" rất đều**: câu tích cực = 5, câu phủ định = 1–2. Chỉ P7 và một phần P3 trả lời phân biệt. Đây là dấu hiệu **courtesy bias** (người quen của tác giả) + straight-lining → SUS thật có thể **thấp hơn 80**.
2. **P2 tự mâu thuẫn**: Q4 = 5 ("cần người có chuyên môn hỗ trợ") nhưng Q10 = 1 ("không cần học gì"). Không loại (vẫn nhất quán với pattern chung) nhưng ghi nhận.

## 4. Theme

> **Không thể affinity mapping từ quote**: form 1 phút không có câu probe, người tham gia không nói to suy nghĩ,
> câu "Điều bạn muốn thay đổi nhất" chỉ nhận được `Không` ×3 và 4 ô trống. Vì vậy 2 theme dưới đây suy ra từ
> **mẫu trả lời SUS + bằng chứng Task 1**, và được ghi rõ là *suy luận*, không phải quote của người dùng.

| Theme | Bằng chứng | Diễn giải | Độ tin cậy |
| :--- | :--- | :--- | :--- |
| **T1 — Happy path trơn tru, người dùng không chạm lỗi biên** | 6/7 Success, Q3 = 4.86, Q6/Q8 = 2.14 (thấp) | Flow chính (đăng ký → giỏ → coupon → checkout → xem đơn) chạy được; 34 lỗi của Task 1 nằm ở **đường biên**: coupon âm khi tổng tiền lớn, mất giỏ khi F5, guest vào `/checkout`, first-click. Người dùng đi đúng một lần duy nhất không gặp → SUS cao nhưng **không phủ định** 34 bug | Trung bình |
| **T2 — "Không nhất quán" bị một người nhận ra rõ** | P7: Q5 = 2, Q6 = 4, Q8 = 4, Q1 = 3 → SUS 45 (Poor) | P7 là người duy nhất chấm thấp ở cả 4 câu phản ánh cấu trúc/hệ thống. Đây là **outlier có ý nghĩa**: nếu mở rộng mẫu, nhóm "nhận ra lỗi" có thể tăng | Thấp (n = 1) |
| **T3 — Coupon không được nhắc tới** | 0/7 để lại ý kiến, không ai chọn Help vì coupon | Không kết luận được coupon có gây bối rối hay không — cần probe trực tiếp | Không đủ dữ liệu |

## 5. Severity & ưu tiên

Không có observation sheet → không tính được `impact × tần suất` theo từng phiên. Thay bằng bảng ưu tiên
**tam giác hoá Task 1 ↔ SUS ↔ mức độ người dùng nhận ra**:

| # | Vấn đề | Nguồn Task 1 | Người dùng có nhận ra? | Ưu tiên |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Coupon hiển thị `-270.000.000 ₫` / thành tiền `300.000.000 ₫` | GUI-BUG-30 (Blocker) | **Không** (0/7 nhắc) → nguy hiểm hơn: sai mà không ai biết | **P0** |
| 2 | Tổng tiền editable ở client | GUI-BUG-15 (Blocker) | Không | **P0** |
| 3 | Guest vào `/checkout` được | GUI-BUG-16 (Blocker) | Không | **P0** |
| 4 | First-click "Thêm vào giỏ" thất bại, không có phản hồi | GUI-BUG-25/21 (Major) | Có thể (P6 cần gợi ý) | **P0** |
| 5 | XSS qua `dangerouslySetInnerHTML` | GUI-BUG-32 (Blocker) | Không | **P0** (bảo mật) |
| 6 | Mất giỏ khi F5 | GUI-BUG-24 (Major) | Không (phiên 1 lượt) | P1 |
| 7 | Thiếu loading/empty state | GUI-BUG-28/29 (Minor) | Có thể (P3 SUS 75) | P1 |
| 8 | Nhãn tiếng Anh, `lang` sai, contrast | GUI-BUG-01…09 (Minor) | **Có** — P7 Q6/Q8 = 4 | P1 (mobile) |

**Kết luận ngược đời nhưng đúng dữ liệu:** SUS 80 *không* chứng minh SUT tốt. Người dùng chấm cao vì họ chỉ đi
đúng happy path một lần; 4 lỗi Blocker nằm ở nhánh mà họ không chạm. Nếu chỉ nhìn SUS mà bỏ 34 bug thì sai.

## 6. Tam giác hoá với Task 1 & Task 3

| Theme / vấn đề | Task 1 (checklist) | Task 3 (cross-platform) | Kết luận |
| :--- | :--- | :--- | :--- |
| Coupon âm | IA-04-08 / GUI-BUG-30 | Tái hiện trên 6 platform, cả BrowserStack Windows + macOS thật | Lỗi thật, mức Blocker, **người dùng không nhận ra** → phải sửa trước khi release |
| Mất giỏ khi F5 | IA-03-09 / GUI-BUG-24 | Như nhau trên mọi browser | Lỗi thật, Major, không lộ trong phiên 1 lượt |
| First-click thêm giỏ | IA-03-02 / GUI-BUG-25 | Giống nhau | Khớp với P6 cần gợi ý (1/7) |
| Không nhất quán nhãn/ngôn ngữ | IA-01-04, IA-02-03 | — | Khớp với P7 (Q6 = 4) |

## 7. Khuyến nghị (thứ tự sau khi có dữ liệu)

| # | Khuyến nghị | Vì sao (dữ liệu) |
| :-: | :--- | :--- |
| 1 | Sửa coupon + tổng tiền server-side, cấm số âm | Blocker, và **không ai trong 7 người phát hiện** → lỗi im lặng, nguy hiểm nhất |
| 2 | Sửa first-click + toast/badge giỏ | P6 (1/7) cần trợ giúp — ứng viên giải thích cho Help |
| 3 | Chuẩn hoá ngôn ngữ/nhất quán UI | P7 Q6 = 4, Q5 = 2; P3 SUS 75 |
| 4 | Persist giỏ, thêm loading/empty state | Không lộ trong phiên nhưng chặn ở sản phẩm thật |
| 5 | **Bổ sung probe 5 phút cho 7 người cũ** | Không có quote/severity per-session → nếu còn thời gian, gửi thêm 3 câu (coupon, trust, bước rối nhất) |

## 8. Hạn chế (bắt buộc đọc kèm mọi kết luận ở trên)

1. **Unmoderated, không có moderator**: không bấm giờ, không đếm số lần trợ giúp thật, không có quote nói-to-suy-nghĩ → không có dữ liệu định tính.
2. **Không có time-on-task**: form rút gọn bỏ câu thời gian; mọi `time_seconds` = trống.
3. **Không có thiết bị**: không biết phiên nào chạy trên mobile hay desktop → không đối chiếu được với Task 3.
4. **Task outcome tự báo cáo**, không kiểm chứng; khoảng cách gửi form (30–146 giây giữa 4 response đầu) nhỏ hơn thời lượng task 20 phút → nghi vấn một phần người tham gia điền nhanh.
5. **Response style**: 6/7 straight-line tích cực; người quen tác giả → courtesy bias, SUS có khả năng bị **thổi lên**.
6. **n = 7**: mô tả, không suy rộng; SD 17.2 rất lớn so với mean.
7. **Không chạy pilot** trước khi gửi form (pilot dự kiến `usability/pilot/`) — form được kiểm bằng 3 dòng CSV giả lập, không bằng người thật.

## 9. Kết luận

Với 7 người thật: **SUS 80.0 (Good/B), 6/7 tự báo success, 1/7 cần trợ giúp, 0/7 thất bại** — nhưng chất lượng
bằng chứng định tính thấp (không quote, không thời gian, không thiết bị). Giá trị của phần này nằm ở việc nó
**mâu thuẫn có kiểm soát** với Task 1: người dùng chấm điểm cao trong khi checklist tìm ra 4 Blocker — chứng tỏ
lỗi tập trung ở nhánh biên mà happy-path test không chạm. Không có số liệu nào bị bịa thêm để lấp khoảng trống
time-on-task hay quote.
