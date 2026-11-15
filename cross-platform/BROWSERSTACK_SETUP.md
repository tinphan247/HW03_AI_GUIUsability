# Hướng dẫn lấy BrowserStack credentials (10 phút)

> Chỉ cần làm nếu muốn bổ sung bằng chứng **thiết bị/OS thật** cho Task 3.
> Task 3 hiện đã đủ 4 platform local; BrowserStack là điểm cộng, không bắt buộc.

## 1. Đăng ký trial

1. Mở https://www.browserstack.com/users/sign_up
2. Chọn gói **Trial** (không cần thẻ). Trial mặc định có **Automate** (chạy script) và **Local** (tunnel về máy bạn).
3. Xác nhận email, đăng nhập.

## 2. Lấy Username + Access Key

1. Đăng nhập → góc trên phải → **Account** (hoặc https://www.browserstack.com/accounts/settings).
2. Mục **Authentication & Security** (một số tài khoản là **Summary**).
3. Thấy 2 dòng:

```text
Username:     tinphan247_xxxxx
Access Key:   ••••••••••••••••••••   [Show]
```

4. Bấm **Show** để hiện Access Key.

## 3. Gửi cho tôi (hoặc tự chạy)

Dán vào chat đúng 2 dòng:

```text
BROWSERSTACK_USERNAME=<username>
BROWSERSTACK_ACCESS_KEY=<access key>
```

Tôi sẽ chạy:

```powershell
$env:BROWSERSTACK_USERNAME = '<username>'
$env:BROWSERSTACK_ACCESS_KEY = '<access key>'
node scripts/run_browserstack.js
```

Kết quả: `screenshots/cross-platform/bs-macos-safari/`, `bs-windows-chrome-bs/`, `bs-android-samsung/` (4 ảnh mỗi target, có overlay) + `evidence/xplat/browserstack-*.json`.

## 4. Nếu trial không cho BrowserStack Local

SUT chạy `localhost` nên cloud browser cần tunnel. Nếu tài khoản chặn **Local**, có 2 cách:

| Cách | Việc làm |
| :--- | :--- |
| A. Dùng tunnel khác | Cài `cloudflared` hoặc `ngrok`, chạy `ngrok http 5173`, rồi đặt `SUT_WEB=https://xxxx.ngrok-free.app`. Nhớ đổi cả API URL trong frontend (hoặc dùng đúng cổng API qua `SUT_API`). |
| B. Bỏ BrowserStack | Giữ 4 platform local (đã đủ yêu cầu ≥ 3), ghi rõ trong báo cáo là không dùng cloud. |

## 5. Lưu ý bảo mật

- Access Key là mật khẩu: **không commit** vào repo, không dán vào file trong bài nộp.
- Sau khi chạy xong, vào **Account → Authentication & Security → Access Key → Reset** nếu muốn vô hiệu hoá key đã gửi.
- Script chỉ đọc từ biến môi trường, không ghi key ra file/log.

## 6. Giới hạn trial

- Trial thường có 100 phút Automate → script chỉ chụp 4 màn hình/target (khoảng 1–2 phút/target), không chạy lại 53 item.
- Nếu hết phút giữa chừng, chạy từng target: `node scripts/run_browserstack.js macos-safari`.
